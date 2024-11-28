import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import { useUsers } from '../../hooks/useUsers';


const CreateUser = ({ isOpen, onClose, userData = null }) => {
    const { createUser, updateUser } = useUsers();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        role: 'USER'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (userData) {
                setFormData({
                    nome: userData.usuario || '',
                    email: userData.email || '',
                    senha: '',
                    confirmarSenha: '',
                    role: userData.role || 'USER'
                });
            } else {
                setFormData({
                    nome: '',
                    email: '',
                    senha: '',
                    confirmarSenha: '',
                    role: 'USER'
                });
            }
        }
        setErrors({});
    }, [isOpen, userData]);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (userData) => {
        const errors = {};

        // Validação do nome (usuário)
        if (!userData.nome) {
            errors.nome = "Nome é obrigatório";
        } else if (userData.nome.length < 3) {
            errors.nome = "Nome deve ter pelo menos 3 caracteres";
        }

        // Validação do email
        if (!userData.email) {
            errors.email = "Email é obrigatório";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
            errors.email = "Por favor, use um email válido";
        }

        // Validação da senha
        if (userData.senha) {  // Só valida senha se estiver sendo alterada
            if (userData.senha.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(userData.senha)) {
                errors.senha = "Senha deve ter pelo menos 8 caracteres e conter pelo menos um caractere especial";
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (userData) {
                await updateUser(userData.id, formData);
            } else {
                await createUser(formData);
            }
            setErrors({});
            handleClose();
        } catch (err) {
            setErrors({ submit: err.message });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={userData ? "Editar Usuário" : "Criar Novo Usuário"}
            onConfirm={handleSubmit}
            confirmText={userData ? "Salvar" : "Criar"}
            cancelText="Cancelar"
            size="medium"
        >
            <div className="form-container">
                {errors.submit && <div className="error-message">{errors.submit}</div>}
                <form className="user-form">
                    <div className="form-group">
                        <label>Nome</label>
                        <input 
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={errors.nome ? 'error' : ''}
                            required 
                        />
                        {errors.nome && <span className="error-message">{errors.nome}</span>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                            required 
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    {!userData && (
                        <div className="form-group">
                            <label>Tipo de Usuário</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="USER">Usuário</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                    )}
                    {userData && (
                        <div className="form-group">
                            <label>Tipo de Usuário</label>
                            <input 
                                type="text"
                                value={formData.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                                disabled
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>{userData ? "Nova Senha (opcional)" : "Senha"}</label>
                        <input 
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            className={errors.senha ? 'error' : ''}
                            required={!userData}
                        />
                        {errors.senha && <span className="error-message">{errors.senha}</span>}
                    </div>
                    {(!userData || formData.senha) && (
                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <input 
                                type="password"
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleInputChange}
                                className={errors.confirmarSenha ? 'error' : ''}
                                required={!userData || formData.senha}
                            />
                        </div>
                    )}
                </form>
            </div>
        </Modal>
    );
};

export default CreateUser;
