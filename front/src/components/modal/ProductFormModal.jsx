import React, { useState, useEffect } from 'react';
import CustomInput from '../input/custom/CustomInput';
import CategorySelect from '../select/CategorySelect';
import BarcodeInput from '../input/BarcodeInput';
import ImageUpload from '../input/ImageUpload';
import Modal from './Modal';
import CustomAlert from '../alert/CustomAlert';
import './css/ProductFormModal.css';
import { useSaveProduct } from '../../hooks/useSaveProduct';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ProductFormModal = ({ isOpen, onClose, onProductSaved, onError, editingProduct = null }) => {
    const { saveProduct, loading: savingLoading } = useSaveProduct();
    const { updateProduct, loading: updatingLoading } = useUpdateProduct();
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: 0,
        quantidade: 0,
        codigoBarras: '',
        categoryId: '',
        id: null
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        productToEdit: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formValues, setFormValues] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
        codigoBarras: '',
        imagem: null
    });

    // Carrega dados do produto quando estiver editando
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                id: editingProduct.id,
                nome: editingProduct.nome || '',
                descricao: editingProduct.descricao || '',
                preco: editingProduct.preco || '',
                quantidade: editingProduct.quantidade || '',
                categoryId: editingProduct.categoria?.id || '',
                codigoBarras: editingProduct.codigoBarras || ''
            });

            console.log('Carregando produto para edição:', editingProduct); // Debug

            if (editingProduct.imagem) {
                // A imagem vem do backend como string base64 pura
                setSelectedImage(editingProduct.imagem);
                setImagePreview(`data:image/jpeg;base64,${editingProduct.imagem}`);
            }
        }
    }, [editingProduct]);

    // Atualizar valores quando editingProduct mudar
    useEffect(() => {
        if (editingProduct) {
            setFormValues({
                nome: editingProduct.nome || '',
                descricao: editingProduct.descricao || '',
                preco: editingProduct.preco || '',
                quantidade: editingProduct.quantidade || '',
                codigoBarras: editingProduct.codigoBarras || '',
                imagem: editingProduct.imagem || null
            });
        } else {
            // Resetar form quando não estiver editando
            setFormValues({
                nome: '',
                descricao: '',
                preco: '',
                quantidade: '',
                codigoBarras: '',
                imagem: null
            });
        }
    }, [editingProduct]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validação para campos numéricos
        if (name === 'quantidade' || name === 'preco') {
            if (Number(value) < 0) {
                toast.error(`${name === 'quantidade' ? 'Quantidade' : 'Preço'} não pode ser negativo!`, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExistingProduct = (product) => {
        setAlertConfig({
            isOpen: true,
            productToEdit: product
        });
    };

    const handleAlertConfirm = () => {
        const product = alertConfig.productToEdit;
        setAlertConfig({ isOpen: false, productToEdit: null });
        onClose();
        if (window.openEditModal && product) {
            window.openEditModal(product);
        }
    };

    const handleAlertClose = () => {
        setAlertConfig({ isOpen: false, productToEdit: null });
    };

    const handleNewProduct = async (productData) => {
        console.log("Dados recebidos do BarcodeInput:", productData);
        
        setFormData(prev => ({
            ...prev,
            nome: productData.nome || '',
            descricao: productData.descricao || '',
            preco: Number(productData.preco || 0).toFixed(2),
            quantidade: Number(productData.quantidade || 0),
            categoryId: productData.categoryId || '',
            codigoBarras: productData.codigoBarras || ''
        }));

        if (productData.imagem) {
            const base64Image = productData.imagem.includes('base64,') 
                ? productData.imagem.split(',')[1] 
                : productData.imagem;
            
            setSelectedImage(base64Image);
            setImagePreview(`data:image/jpeg;base64,${base64Image}`);
        }
    };

    // Função para converter base64 para File (quando for salvar)
    const base64ToFile = (base64String, filename = 'product-image.jpg') => {
        if (!base64String) return null;
        
        // Remove o prefixo data:image/jpeg;base64, se existir
        const base64Content = base64String.replace(/^data:image\/\w+;base64,/, '');
        
        try {
            const byteCharacters = atob(base64Content);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            return new File(byteArrays, filename, { type: 'image/jpeg' });
        } catch (error) {
            console.error('Erro ao converter base64 para File:', error);
            return null;
        }
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Pegando apenas a parte base64 da string, removendo o prefixo data:image/...
                    const base64String = e.target.result.split(',')[1];
                    setSelectedImage(base64String);
                    setImagePreview(`data:image/jpeg;base64,${base64String}`); // Mantém o preview com o prefixo
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!formData.nome || !formData.preco || !formData.quantidade) {
                throw new Error('Por favor, preencha todos os campos obrigatórios');
            }

            // Validação adicional para valores negativos
            if (Number(formData.quantidade) < 0) {
                throw new Error('A quantidade não pode ser negativa');
            }

            if (Number(formData.preco) < 0) {
                throw new Error('O preço não pode ser negativo');
            }

            const productData = {
                id: editingProduct?.id,
                nome: formData.nome,
                descricao: formData.descricao,
                preco: Number(formData.preco),
                quantidade: Number(formData.quantidade),
                codigoBarras: formData.codigoBarras,
                categoria: {
                    id: Number(formData.categoryId)
                },
                imagem: selectedImage || null
            };

            console.log('Dados do produto antes de enviar:', productData);

            let response;
            if (editingProduct) {
                response = await updateProduct(productData);
            } else {
                response = await saveProduct(productData);
            }
            
            onProductSaved();
            onClose();
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (onError) {
                onError(error);
            } else {
                toast.error(error.message || error.response?.data?.error || 'Erro ao salvar produto');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            preco: '',
            quantidade: '',
            categoryId: '',
            codigoBarras: '',
            id: null
        });
        setSelectedImage(null);
        setImagePreview(null);
        setImageFile(null);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    resetForm();
                    onClose();
                }}
                title={editingProduct ? "Editar Produto" : "Cadastrar Novo Produto"}
                onConfirm={handleSubmit}
                confirmText={
                    (editingProduct ? updatingLoading : savingLoading)
                        ? "Salvando..."
                        : (editingProduct ? "Atualizar" : "Salvar")
                }
                size="large"
            >
                <div className="form-container">
                    <div className="manual-form">
                        {!editingProduct && (
                            <BarcodeInput 
                                onExistingProduct={handleExistingProduct}
                                onNewProduct={handleNewProduct}
                                value={formData.codigoBarras}
                                onChange={handleInputChange}
                            />
                        )}
                        
                        <CustomInput
                            label="Nome do Produto"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            placeholder="Nome do produto"
                            required
                        />
                        
                        <CustomInput
                            label="Descrição"
                            type="textarea"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            placeholder="Descrição do produto"
                            rows={3}
                        />
                        
                        <CustomInput
                            label="Preço"
                            type="number"
                            name="preco"
                            value={formData.preco}
                            onChange={handleInputChange}
                            placeholder="Preço"
                            step="0.01"
                            min="0"
                            onWheel={(e) => e.target.blur()}
                            required
                        />
                        
                        <CustomInput
                            label="Quantidade"
                            type="number"
                            name="quantidade"
                            value={formData.quantidade}
                            onChange={handleInputChange}
                            placeholder="Quantidade"
                            min="0"
                            onWheel={(e) => e.target.blur()}
                            required
                        />
                        
                        <CategorySelect 
                            value={formData.categoryId}
                            onChange={(value) => {
                                setFormData(prev => ({
                                    ...prev,
                                    categoryId: value
                                }));
                            }}
                        />
                        <div className="product-image-upload">
                            <p>Arraste uma imagem ou clique para fazer upload</p>
                            <button 
                                type="button"
                                className="product-select-image-btn"
                                onClick={handleImageUpload}
                            >
                                Selecionar imagem
                            </button>
                            {imagePreview && (
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="product-image-preview"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            <CustomAlert 
                isOpen={alertConfig.isOpen}
                onClose={handleAlertClose}
                onConfirm={handleAlertConfirm}
                title="Produto Encontrado"
                message={
                    alertConfig.productToEdit 
                        ? `O produto "${alertConfig.productToEdit.nome}" já existe no sistema. Deseja editar?`
                        : ''
                }
            />
        </>
    );
};

ProductFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onProductSaved: PropTypes.func.isRequired,
    onError: PropTypes.func,
    editingProduct: PropTypes.object
};

export default ProductFormModal;