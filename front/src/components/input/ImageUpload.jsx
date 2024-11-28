import React, { useState, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, initialImage }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (initialImage) {
            console.log('Initial image received:', initialImage); // Debug log
            
            // Se for uma URL
            if (typeof initialImage === 'string') {
                setPreview(initialImage);
            } 
            // Se for um arquivo
            else if (initialImage instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(initialImage);
            }
        } else {
            setPreview(null);
        }
    }, [initialImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            onImageSelect(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange({ target: { files: [file] } });
        }
    };

    // Adicionar tratamento de erro para imagens
    const handleImageError = () => {
        console.error('Erro ao carregar a imagem:', initialImage);
        setPreview(null);
    };

    return (
        <div className="form-group">
            <label>Imagem do Produto</label>
            <div 
                className="image-upload-container table-container"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="custom-file-input"
                    id="product-image-input"
                    onChange={handleImageChange}
                />
                
                <div className="image-preview-container">
                    {preview ? (
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="image-preview"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="upload-placeholder">
                            <i className="fas fa-cloud-upload-alt upload-icon"></i>
                            <span>Arraste uma imagem ou clique para fazer upload</span>
                        </div>
                    )}
                </div>
                
                <label htmlFor="product-image-input" className="upload-button">
                    <i className="fas fa-camera"></i>
                    {preview ? 'Alterar imagem' : 'Selecionar imagem'}
                </label>
            </div>
        </div>
    );
};

export default ImageUpload;