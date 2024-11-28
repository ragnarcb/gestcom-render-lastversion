import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './CategorySelect.css';
import api from '../../services/Api';

const CategorySelect = ({ value, onChange }) => {
    const { categories, loading, error, refetchCategories } = useCategories();
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState({
        nome: '',
        descricao: ''
    });

    console.log('CategorySelect props:', { value, valueType: typeof value });

    if (loading) return <div>Carregando categorias...</div>;
    if (error) return <div>Erro ao carregar categorias</div>;

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const numericValue = selectedValue ? Number(selectedValue) : '';
        console.log('Categoria selecionada:', numericValue);
        onChange(numericValue);
    };

    const handleAddCategory = async () => {
        try {
            if (!newCategory.nome || !newCategory.descricao) {
                toast.error('Preencha todos os campos');
                return;
            }

            const response = await api.post('/categoria', {
                nome: newCategory.nome,
                descricao: newCategory.descricao
            });

            setNewCategory({ nome: '', descricao: '' });
            setShowNewCategoryInput(false);

            await refetchCategories();
            onChange(Number(response.data.id));
            toast.success('Categoria criada com sucesso!');
            
        } catch (error) {
            console.error('Erro:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar categoria');
        }
    };

    return (
        <div className="category-select-container">
            <div className="select-with-button">
                <select 
                    value={value || ''}
                    onChange={handleChange}
                    className="custom-select"
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                        <option 
                            key={category.id} 
                            value={category.id}
                        >
                            {category.nome}
                        </option>
                    ))}
                </select>
                <button 
                    type="button" 
                    className="add-category-btn"
                    onClick={() => setShowNewCategoryInput(true)}
                >
                    <FaPlus />
                </button>
            </div>

            {showNewCategoryInput && (
                <div className="new-category-inputs">
                    <input
                        type="text"
                        placeholder="Nome da categoria"
                        value={newCategory.nome}
                        onChange={(e) => setNewCategory(prev => ({
                            ...prev,
                            nome: e.target.value
                        }))}
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={newCategory.descricao}
                        onChange={(e) => setNewCategory(prev => ({
                            ...prev,
                            descricao: e.target.value
                        }))}
                    />
                    <div className="new-category-buttons">
                        <button onClick={handleAddCategory}>Salvar</button>
                        <button onClick={() => setShowNewCategoryInput(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelect;