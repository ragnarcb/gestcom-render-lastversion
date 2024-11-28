import React, { useState, useEffect } from 'react';
import api from '../../services/Api';
import { toast } from 'react-toastify';
import './css/CustomerModal.css';
import axios from 'axios';
import viaCepApi from '../../services/ViaCepApi';

const CustomerModal = ({ show, onClose, customer = null }) => {
    const [modalAnimation, setModalAnimation] = useState('');
    const [customerData, setCustomerData] = useState({
        usuario: '',
        email: '',
        telefone: '',
        cpf: '',
        valorDevedor: 0,
        diasPreferencialPagamento: [],
        observacoes: '',
        statusAtivo: true,
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
    });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (show) {
            setModalAnimation('entering');
            setTimeout(() => {
                setModalAnimation('entered');
            }, 300);
        }
    }, [show]);

    useEffect(() => {
        if (customer) {
            setCustomerData({
                ...customer,
                cpf: customer.cpf ? formatCpf(customer.cpf) : ''
            });
        } else {
            setCustomerData({
                usuario: '',
                email: '',
                telefone: '',
                cpf: '',
                valorDevedor: 0,
                diasPreferencialPagamento: [],
                observacoes: '',
                statusAtivo: true,
                cep: '',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: ''
            });
        }
    }, [customer]);

    const handleClose = () => {
        setModalAnimation('exiting');
        setTimeout(() => {
            onClose();
            setModalAnimation('');
        }, 300);
    };

    const formatCpf = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 11) {
            return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, g1, g2, g3, g4) => {
                if (g4) return `${g1}.${g2}.${g3}-${g4}`;
                if (g3) return `${g1}.${g2}.${g3}`;
                if (g2) return `${g1}.${g2}`;
                if (g1) return g1;
                return '';
            });
        }
        return numericValue.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cep') {
            const formattedCep = formatCep(value);
            setCustomerData(prev => ({
                ...prev,
                [name]: formattedCep
            }));
            
            const numericCep = formattedCep.replace(/\D/g, '');
            if (numericCep.length === 8) {
                handleCepSearch(numericCep);
            }
        } else if (name === 'cpf') {
            const formattedCpf = formatCpf(value);
            setCustomerData(prev => ({
                ...prev,
                [name]: formattedCpf
            }));
        } else {
            setCustomerData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const formatCep = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 8) {
            return numericValue.replace(/(\d{5})(\d{0,3})/, (_, g1, g2) => {
                if (g2) return `${g1}-${g2}`;
                if (g1) return g1;
                return '';
            });
        }
        return numericValue.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handleCepSearch = async (cep) => {
        try {
            const response = await viaCepApi.get(`/${cep}/json/`);
            const data = response.data;
            if (!data.erro) {
                setCustomerData(prev => ({
                    ...prev,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            toast.error('Erro ao buscar CEP. Verifique se o CEP está correto.');
        }
    };

    const handleSave = async () => {
        setValidationErrors({});
        
        const requiredFields = {
            usuario: 'Nome',
            telefone: 'Telefone',
            cpf: 'CPF',
            logradouro: 'Rua',
            numero: 'Número'
        };

        const errors = {};
        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!customerData[field]?.trim()) {
                errors[field] = `${label} é obrigatório`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const dataToSend = {
                ...customerData,
                cpf: formatCpf(customerData.cpf)
            };

            if (customerData.id) {
                await api.put(`/cliente/${customerData.id}`, dataToSend);
                toast.success('Cliente atualizado com sucesso!');
            } else {
                await api.post('/cliente', dataToSend);
                toast.success('Cliente cadastrado com sucesso!');
            }
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            toast.error('Erro ao salvar cliente');
        }
    };

    if (!show) return null;

    return (
        <div className="modal-container">
            <div className={`modal-overlay ${modalAnimation}`} onClick={handleClose} />
            <div className={`modal-content ${modalAnimation}`}>
                <span className="close-button" onClick={handleClose}>&times;</span>
                <h2>{customerData.id ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h2>

                <div className="form-container">
                    <div className="form-group">
                        <label>Nome *</label>
                        <input
                            type="text"
                            name="usuario"
                            value={customerData.usuario}
                            onChange={handleInputChange}
                            placeholder="Nome do cliente"
                            className={validationErrors.usuario ? 'error' : ''}
                        />
                        {validationErrors.usuario && (
                            <span className="error-message">{validationErrors.usuario}</span>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={customerData.email}
                            onChange={handleInputChange}
                            placeholder="Email do cliente"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Telefone *</label>
                        <input
                            type="tel"
                            name="telefone"
                            value={customerData.telefone}
                            onChange={handleInputChange}
                            placeholder="Telefone do cliente"
                            className={validationErrors.telefone ? 'error' : ''}
                        />
                        {validationErrors.telefone && (
                            <span className="error-message">{validationErrors.telefone}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>CPF *</label>
                        <input
                            type="text"
                            name="cpf"
                            value={customerData.cpf}
                            onChange={handleInputChange}
                            placeholder="000.000.000-00"
                            maxLength="14"
                            className={validationErrors.cpf ? 'error' : ''}
                        />
                        {validationErrors.cpf && (
                            <span className="error-message">{validationErrors.cpf}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>CEP</label>
                        <input
                            type="text"
                            name="cep"
                            value={customerData.cep}
                            onChange={handleInputChange}
                            placeholder="00000-000"
                            maxLength="9"
                        />
                    </div>

                    <div className="form-group">
                        <label>Rua *</label>
                        <input
                            type="text"
                            name="logradouro"
                            value={customerData.logradouro}
                            onChange={handleInputChange}
                            placeholder="Rua"
                            className={validationErrors.logradouro ? 'error' : ''}
                        />
                        {validationErrors.logradouro && (
                            <span className="error-message">{validationErrors.logradouro}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Número *</label>
                        <input
                            type="text"
                            name="numero"
                            value={customerData.numero}
                            onChange={handleInputChange}
                            placeholder="Número"
                            className={validationErrors.numero ? 'error' : ''}
                        />
                        {validationErrors.numero && (
                            <span className="error-message">{validationErrors.numero}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Complemento</label>
                        <input
                            type="text"
                            name="complemento"
                            value={customerData.complemento}
                            onChange={handleInputChange}
                            placeholder="Complemento"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bairro</label>
                        <input
                            type="text"
                            name="bairro"
                            value={customerData.bairro}
                            onChange={handleInputChange}
                            placeholder="Bairro"
                        />
                    </div>

                    <div className="form-group">
                        <label>Cidade</label>
                        <input
                            type="text"
                            name="cidade"
                            value={customerData.cidade}
                            onChange={handleInputChange}
                            placeholder="Cidade"
                        />
                    </div>

                    <div className="form-group">
                        <label>Estado</label>
                        <input
                            type="text"
                            name="estado"
                            value={customerData.estado}
                            onChange={handleInputChange}
                            placeholder="Estado"
                            maxLength="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Observações</label>
                        <textarea
                            name="observacoes"
                            value={customerData.observacoes}
                            onChange={handleInputChange}
                            placeholder="Observações"
                        />
                    </div>
                </div>
                
                <button 
                    className="save-button"
                    onClick={handleSave}
                >
                    Salvar Cliente
                </button>
            </div>
        </div>
    );
};

export default CustomerModal;