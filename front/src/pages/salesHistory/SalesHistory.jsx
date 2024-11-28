import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { FiEye } from 'react-icons/fi';
import SearchInput from '../../components/input/SearchInput';
import './SalesHistory.css';
import api from '../../services/Api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { BiSortUp, BiSortDown } from 'react-icons/bi';

const SalesHistory = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [modalAnimation, setModalAnimation] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [showClosureModal, setShowClosureModal] = useState(false);
    const [closureModalAnimation, setClosureModalAnimation] = useState('');
    const [openSales, setOpenSales] = useState([]);
    const [closureData, setClosureData] = useState({
        oldestDate: null,
        newestDate: null,
        totalAmount: 0
    });

    const filterOptions = [
        {
            id: 'total',
            title: 'Valor',
            options: [
                { value: 'totalAsc', icon: <BiSortUp />, label: 'Menor Valor' },
                { value: 'totalDesc', icon: <BiSortDown />, label: 'Maior Valor' }
            ]
        },
        {
            id: 'date',
            title: 'Data',
            options: [
                { value: 'dateAsc', icon: <BiSortUp />, label: 'Mais Antiga' },
                { value: 'dateDesc', icon: <BiSortDown />, label: 'Mais Recente' }
            ]
        }
    ];

    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await api.get('/venda');
            let sortedSales = [...response.data];

            // Aplicar ordenação por valor total
            if (activeFilters.total) {
                sortedSales.sort((a, b) => {
                    const totalA = calculateTotal(a.itens || []);
                    const totalB = calculateTotal(b.itens || []);
                    if (activeFilters.total === 'totalAsc') {
                        return totalA - totalB;
                    }
                    return totalB - totalA;
                });
            }

            // Aplicar ordenação por data
            if (activeFilters.date) {
                sortedSales.sort((a, b) => {
                    const dateA = new Date(a.dataVenda).getTime();
                    const dateB = new Date(b.dataVenda).getTime();
                    if (activeFilters.date === 'dateAsc') {
                        return dateA - dateB;
                    }
                    return dateB - dateA;
                });
            }

            // Aplicar filtro de busca
            if (searchValue) {
                sortedSales = sortedSales.filter(sale => 
                    sale.id.toString().includes(searchValue) ||
                    calculateTotal(sale.itens || []).toString().includes(searchValue)
                );
            }

            setSales(sortedSales);
        } catch (err) {
            setError(`Erro ao carregar o histórico de vendas: ${err.message}`);
            toast.error('Erro ao carregar histórico de vendas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [activeFilters, searchValue]);

    const handleShowDetails = (sale) => {
        setSelectedSale(sale);
        setShowDetailsModal(true);
        setModalAnimation('entering');
        setTimeout(() => {
            setModalAnimation('entered');
        }, 300);
    };

    const handleCloseModal = () => {
        setModalAnimation('exiting');
        setTimeout(() => {
            setShowDetailsModal(false);
            setModalAnimation('');
            setSelectedSale(null);
        }, 300);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.totalByProduto, 0);
    };

    const handleOpenClosureModal = async () => {
        try {
            setLoading(true);
            const response = await api.get('/venda/status?statusFechado=false');
            const openSalesData = response.data;
            
            if (openSalesData.length === 0) {
                toast.info('Não há vendas abertas para fechar');
                return;
            }

            // Organiza as datas e calcula o total
            const dates = openSalesData.map(sale => new Date(sale.dataVenda));
            const total = openSalesData.reduce((sum, sale) => {
                const saleTotal = sale.itens.reduce((itemSum, item) => 
                    itemSum + item.totalByProduto, 0);
                return sum + saleTotal;
            }, 0);

            setOpenSales(openSalesData);
            setClosureData({
                oldestDate: new Date(Math.min(...dates)),
                newestDate: new Date(Math.max(...dates)),
                totalAmount: total
            });

            setShowClosureModal(true);
            setClosureModalAnimation('entering');
            setTimeout(() => {
                setClosureModalAnimation('entered');
            }, 300);
        } catch (error) {
            console.error('Erro ao buscar vendas abertas:', error);
            toast.error('Erro ao carregar vendas abertas');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseClosureModal = () => {
        setClosureModalAnimation('exiting');
        setTimeout(() => {
            setShowClosureModal(false);
            setClosureModalAnimation('');
            setOpenSales([]);
        }, 300);
    };

    const handleCloseSales = async () => {
        try {
            setLoading(true);
            
            // Fecha cada venda aberta
            for (const sale of openSales) {
                await api.post(`/venda/${sale.id}/fechar`);
            }

            toast.success('Caixa fechado com sucesso!');
            handleCloseClosureModal();
            fetchSales(); // Atualiza a lista de vendas
        } catch (error) {
            console.error('Erro ao fechar vendas:', error);
            toast.error('Erro ao fechar o caixa');
        } finally {
            setLoading(false);
        }
    };

    const formatStatus = (sale) => {
        return sale.statusFechado ? 'Fechado' : 'Aberto';
    };

    const handleSort = (groupId, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[groupId] === value) {
                delete newFilters[groupId];
            } else {
                newFilters[groupId] = value;
            }
            return newFilters;
        });
    };

    return (
        <MainLayout>
            <div className="sh-sales-history-container">
                <h1>Histórico de Vendas</h1>
                
                {/* Controles superiores */}
                <div className="sh-controls">
                    <SearchInput 
                        placeholder="Pesquisar vendas..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onSortChange={handleSort}
                        activeFilters={activeFilters}
                        filterType="sales"
                    />
                </div>

                <div className="sh-content-container">
                    <div className="sh-table-container">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data da Venda</th>
                                        <th>Quantidade de Itens</th>
                                        <th>Valor Total</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map(sale => (
                                        <tr key={sale.id}>
                                            <td>{sale.id}</td>
                                            <td>{formatDate(sale.dataVenda)}</td>
                                            <td>{sale.itens?.length || 0}</td>
                                            <td>R$ {calculateTotal(sale.itens || []).toFixed(2)}</td>
                                            <td className="sh-actions">
                                                <button 
                                                    className="sh-action-button view"
                                                    onClick={() => handleShowDetails(sale)}
                                                >
                                                    <FiEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showDetailsModal && (
                        <div className="sh-modal-container">
                            <div className={`sh-modal-overlay ${modalAnimation}`} onClick={handleCloseModal} />
                            <div className={`sh-modal-content sh-sale-details-modal ${modalAnimation}`}>
                                <span className="close-button" onClick={handleCloseModal}>&times;</span>
                                <h2>Detalhes da Venda #{selectedSale?.id}</h2>
                                
                                <div className="sh-sale-info">
                                    <p><strong>Data:</strong> {formatDate(selectedSale?.dataVenda)}</p>
                                    <p><strong>Total:</strong> R$ {calculateTotal(selectedSale?.itens || []).toFixed(2)}</p>
                                </div>

                                <div className="sh-items-list">
                                    <h3>Itens da Venda</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Quantidade</th>
                                                <th>Preço Unit.</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSale?.itens?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.produto.nome}</td>
                                                    <td>{item.quantidade}</td>
                                                    <td>R$ {item.precoUnitario.toFixed(2)}</td>
                                                    <td>R$ {item.totalByProduto.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de Fechamento de Caixa */}
                    {showClosureModal && (
                        <div className="sh-modal-container">
                            <div 
                                className={`sh-modal-overlay ${closureModalAnimation}`}
                                onClick={handleCloseClosureModal}
                            />
                            <div className={`sh-modal-content sh-closure-modal ${closureModalAnimation}`}>
                                <span className="sh-close-button" onClick={handleCloseClosureModal}>&times;</span>
                                <h2>Fechamento de Caixa</h2>
                                
                                <div className="sh-closure-info">
                                    <p>
                                        <strong>Primeira Venda:</strong> {closureData.oldestDate?.toLocaleString('pt-BR')}
                                    </p>
                                    <p>
                                        <strong>Última Venda:</strong> {closureData.newestDate?.toLocaleString('pt-BR')}
                                    </p>
                                    <p className="sh-total-amount">
                                        <strong>Valor Total:</strong> R$ {closureData.totalAmount.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Total de Vendas:</strong> {openSales.length}
                                    </p>
                                </div>

                                <div className="sh-modal-buttons">
                                    <button 
                                        className="sh-cancel-button" 
                                        onClick={handleCloseClosureModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="sh-confirm-button"
                                        onClick={handleCloseSales}
                                        disabled={loading}
                                    >
                                        {loading ? 'Fechando...' : 'Fechar Caixa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default SalesHistory;
