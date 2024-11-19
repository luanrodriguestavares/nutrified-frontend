import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { InputField } from "../components/inputField";
import { useToast } from "../components/toast";
import useAuth from "../hooks/useAuth";  
import { Search, Salad, Fish, Ham, CookingPot, Plus, X } from 'lucide-react';

export function RegisterMealPage() {
    const [user, setUser] = useState(null);
    const [foods, setFoods] = useState([{ id: 1, food_id: "", quantity: 0, calories: 0, portionWeight: 0 }]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [foodOptions, setFoodOptions] = useState([]);
    const [nextId, setNextId] = useState(2);
    const [date, setDate] = useState("");
    const addToast = useToast();

    // Usando o hook useAuth para obter o usuário autenticado
    const loggedUser = useAuth(addToast);

    useEffect(() => {
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, [loggedUser]);

    // Função para buscar os alimentos
    const fetchFoods = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/food/');
            const data = await response.json();
            const formattedOptions = data.map(food => ({
                value: food.id,
                label: `${food.name} - ${food.category}`,
                calories_per_portion: food.calories_per_portion,
                portion_weight: food.portion_weight,
            }));
            setFoodOptions(formattedOptions);
        } catch (error) {
            addToast("Erro ao buscar alimentos", "error");
            console.error("Erro ao buscar alimentos:", error);
        }
    };

    // Busca os alimentos ao montar o componente
    useEffect(() => {
        fetchFoods();
    }, []);

    // Função para obter a data e hora atual
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        setDate(currentDateTime);
    }, []);

    // Função para lidar com o evento de mudança de alimento
    const handleFoodChange = (id, foodId) => {
        const selectedOption = foodOptions.find(option => option.value === foodId);
        setFoods(prevFoods =>
            prevFoods.map(food =>
                food.id === id
                    ? {
                        ...food,
                        food_id: foodId,
                        calories: selectedOption ? selectedOption.calories_per_portion : 0,
                        portionWeight: selectedOption ? selectedOption.portion_weight : 0,
                    }
                    : food
            )
        );
    };

    // Função para lidar com o evento de mudança de quantidade
    const handleQuantityChange = (id, value) => {
        const quantity = Number(value);
        setFoods(prevFoods =>
            prevFoods.map(food =>
                food.id === id ? { ...food, quantity: isNaN(quantity) ? 0 : quantity } : food
            )
        );
    };

    // Função para adicionar um novo alimento
    const handleAddFood = () => {
        setFoods([...foods, { id: nextId, food_id: "", quantity: 0, calories: 0, portionWeight: 0 }]);
        setNextId(nextId + 1);
    };

    // Função para remover um alimento
    const handleRemoveFood = (id) => {
        setFoods(prevFoods => prevFoods.filter(food => food.id !== id));
    };

    // Função para calcular o total de calorias
    const calculateTotalCalories = () => {
        const total = foods.reduce((sum, food) => {
            const caloriesForFood = food.calories * food.quantity;
            return sum + (isNaN(caloriesForFood) ? 0 : caloriesForFood);
        }, 0);
        setTotalCalories(total);
    };

    // Função para adicionar uma refeição
    const handleAddMeal = async () => {
        if (!user) {
            addToast("Erro: Usuário não encontrado", "error");
            console.error("Usuário não encontrado no hook useAuth");
            return;
        }

        // Crie os dados da refeição
        const mealData = {
            user_id: user.id,
            foods: foods.map(food => ({
                food_id: food.food_id,
                quantity: food.quantity,
                calories: food.calories,
            })),
            total_calories: totalCalories,
            date: date,
        };

        // Tente adicionar a refeição
        try {
            const response = await fetch('http://127.0.0.1:5000/meal/meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealData),
                credentials: 'include',
            });

            const data = await response.json();

            // Verifique se a refeição foi adicionada com sucesso
            if (response.ok) {
                addToast("Refeição adicionada com sucesso!", "success");
                console.log("Refeição adicionada com sucesso:");
                setFoods([]);
                setTotalCalories(0);
                setDate(""); 
                setNextId(2);
            } else {
                addToast(`Erro ao adicionar refeição: ${data.message || 'Erro desconhecido'}`, "error");
                console.error("Erro ao adicionar refeição:", data);
            }
        } catch (error) {
            addToast("Erro ao enviar refeição", "error");
            console.error("Erro ao enviar refeição:", error);
        }
    };

    useEffect(() => {
        calculateTotalCalories();
    }, [foods]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 mt-8 p-6 transition-all duration-300 md:ml-64">
                <h1 className="text-2xl md:text-3xl text-gray-600 tracking-tighter font-bold">
                    Adicionar Refeição <CookingPot className="inline ml-2 h-7 w-7" />
                </h1>
                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Registre as refeições que você está consumindo durante o dia.
                </p>

                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        {foods.map((food) => (
                            <div key={food.id} className="relative mb-6 border border-gray-200 rounded-2xl py-6 px-3 bg-gray-50">
                                <button onClick={() => handleRemoveFood(food.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition">
                                    <X className="h-5 w-5" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <InputField
                                        label="Selecione o Alimento"
                                        name={`food-${food.id}`}
                                        type="select"
                                        placeholder="Digite para filtrar..."
                                        options={foodOptions}
                                        Icon={Search}
                                        value={food.selectedFood}
                                        onChange={(e) => handleFoodChange(food.id, e.target.value)}
                                    />
                                    <InputField
                                        label="Quantidade"
                                        name={`quantity-${food.id}`}
                                        type="number"
                                        placeholder="Quantidade"
                                        value={food.quantity || ""}
                                        onChange={(e) => handleQuantityChange(food.id, e.target.value)}
                                        Icon={Salad}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <InputField
                                        label="Calorias por Porção"
                                        name={`calories-${food.id}`}
                                        type="number"
                                        placeholder="Calorias por porção"
                                        value={food.calories || ""}
                                        Icon={Fish}
                                        readonly
                                    />
                                    <InputField
                                        label="Peso da Porção (g)"
                                        name={`portionWeight-${food.id}`}
                                        type="number"
                                        placeholder="Peso da porção"
                                        value={food.portionWeight || ""}
                                        Icon={Ham}
                                        readonly
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={handleAddFood} className="flex text-sm items-center mt-4 text-emerald-600 hover:text-emerald-700 border-2 rounded-full p-1 border-emerald-600 hover:border-emerald-700 font-semibold">
                            <Plus className="mr-2 h-5 w-5" />
                            Adicionar outro alimento
                        </button>

                        <div className="mt-6">
                            <div className="mb-4">
                                <strong>Calorias Totais: {totalCalories}</strong>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="text-gray-800 text-sm font-medium px-3 mb-2 block">Data e Hora da Refeição</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                            <button onClick={handleAddMeal} className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all">
                                Adicionar Refeição
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
