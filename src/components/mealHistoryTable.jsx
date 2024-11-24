import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Modal from 'react-modal';

export function MealHistoryTable({ page }) {
    const isDashboard = page === 'dashboard';
    const [currentPage, setCurrentPage] = useState(0);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [animateOpen, setAnimateOpen] = useState(false);

    const itemsPerPage = isDashboard ? 6 : 10;

    // Verifica se o usuário está logado
    const user = useAuth();
    const userId = user ? user.id : null;

    // Busca as refeições
    useEffect(() => {
        if (!userId) return;

        const fetchMeals = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/meal/meals?user_id=${userId}`);
                
                // Verifica se a requisição foi bem-sucedida
                if (!response.ok) {
                    throw new Error('Erro ao carregar as refeições');
                }
                const data = await response.json();
                setMeals(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Chama a função para buscar as refeições
        fetchMeals();
    }, [userId]);

    // Formata a data e a hora
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        if (isNaN(date)) {
            return 'Data inválida';
        }
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Abre o modal
    const openModal = (meal) => {
        setSelectedMeal(meal);
        setModalIsOpen(true);
        setTimeout(() => setAnimateOpen(true), 0);
    };

    // Fecha o modal
    const closeModal = () => {
        setAnimateOpen(false); 
        setSelectedMeal(null);
        setModalIsOpen(false); 
    };

    // Habilita a animação ao abrir o modal
    if (loading) {
        return <div>Carregando...</div>;
    }

    // Exibe a mensagem de erro
    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center rounded-2xl border border-gray-300 py-4">
                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Ao registrar suas refeições, elas aparecerão aqui. 😊
                </p>
            </div>
        );
    }

    // Ordena as refeições por data
    const sortedData = [...meals].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calcula os dados paginados
    const paginatedData = isDashboard
        ? sortedData.slice(0, itemsPerPage)
        : sortedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Funções de navegação para avançar
    const handleNextPage = () => {
        const maxPage = Math.ceil(sortedData.length / itemsPerPage) - 1;
        setCurrentPage((prev) => Math.min(prev + 1, maxPage));
    };

    // Funções de navegação para voltar
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    return (
        <>
            <div className="relative overflow-x-auto rounded-2xl border border-gray-200 max-w-[325px] sm:max-w-full overflow-y-auto">
                <table className="w-full text-xs text-left rtl:text-right table-auto">
                    <thead className="text-xs text-gray-50 bg-emerald-600">
                        <tr>
                            <th scope="col" className="px-3 py-3">Calorias</th>
                            <th scope="col" className="px-3 py-3">Data</th>
                            <th scope="col" className="px-3 py-3">Visualizar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((meal, index) => (
                            <tr key={index} className="bg-gray-50 border-b text-xs hover:bg-emerald-200/10">
                                <td className="px-3 py-4">{meal.total_calories} kcal</td>
                                <td className="px-3 py-4">{formatDateTime(meal.date)}</td>
                                <td className="px-3 py-4">
                                    <button onClick={() => openModal(meal)} className="text-blue-500">
                                        Visualizar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Detalhes da Refeição"
                ariaHideApp={false}
                className={`relative w-11/12 max-w-md md:max-w-2xl lg:max-w-4xl p-6 mx-auto mt-10 bg-white rounded-2xl shadow-lg focus:outline-none overflow-auto max-h-[90vh] transform transition-transform duration-300 ${
                    animateOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                overlayClassName="fixed inset-0 bg-gray-950 bg-opacity-70 z-30 px-4 transition-opacity duration-300"
            >
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-40">
                    <X className="w-6 h-6" />
                </button>

                {selectedMeal && (
                    <div className="flex flex-col p-1">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-700">Detalhes da Refeição</h1>
                        <p className="text-md text-gray-600 mb-6">Data: {formatDateTime(selectedMeal.date)}</p>

                        <div className="space-y-4 mb-3">
                            <ul className="space-y-2">
                                {selectedMeal.foods.map((food, index) => (
                                    <li
                                        key={index}
                                        className="flex text-sm justify-between bg-gray-50 p-3 rounded-2xl border border-gray-300"
                                    >
                                        <span className="text-gray-700 font-medium">{food.food}</span>
                                        <span className="text-gray-500">{food.calories} kcal</span>
                                        <span className="text-gray-500">{food.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-emerald-200 p-4 text-sm rounded-xl text-gray-700">
                            <h3 className="font-semibold">Total de Calorias Consumidas</h3>
                            <p className="text-lg font-bold">{selectedMeal.total_calories} kcal</p>
                        </div>
                    </div>
                )}
            </Modal>

            {!isDashboard && (
                <div className="flex justify-between items-center py-3">
                    <button onClick={handlePrevPage} disabled={currentPage === 0} className="p-2 rounded-full bg-gray-50 hover:bg-gray-300 border border-gray-200 disabled:opacity-0">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm">
                        Página {currentPage + 1} de {Math.ceil(sortedData.length / itemsPerPage)}
                    </span>
                    <button onClick={handleNextPage} disabled={(currentPage + 1) * itemsPerPage >= sortedData.length} className="p-2 rounded-full bg-gray-50 hover:bg-gray-300 border border-gray-200 disabled:opacity-0">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
}
