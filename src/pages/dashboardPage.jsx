import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Greeting } from "../components/greeting";
import { CardDashboard } from "../components/cardDashboard";
import { MealHistoryTable } from '../components/mealHistoryTable';
import { useToast } from "../components/toast";
import useAuth from "../hooks/useAuth";  
import ChartBars from "../components/chartBars";
import { GlassWater, Apple, History, HeartPulse } from "lucide-react";

export function DashboardPage() {
    const [caloriesNeeded, setCaloriesNeeded] = useState(0);
    const [waterNeeded, setWaterNeeded] = useState(0);
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [waterConsumed, setWaterConsumed] = useState(0);
    const navigate = useNavigate();
    const addToast = useToast();

    const user = useAuth(addToast);

    // Carregar as necessidades de alimentação do usuário
    useEffect(() => {
        if (user) {
            const fetchUserInfo = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/user/${user.id}/needs`, {
                        method: 'GET',
                    });
                    
                    // Verificar se a requisição foi bem-sucedida
                    if (response.ok) {
                        const data = await response.json();
                        setCaloriesNeeded(data.calories_needed);
                        setCaloriesConsumed(data.calories_consumed);
                        setWaterNeeded(data.water_needed);
                        setWaterConsumed(data.water_consumed);
                    } else {
                        addToast('Erro ao buscar as necessidades do usuário', 'error');
                        console.error('Erro ao buscar as necessidades do usuário');
                    }
                } catch (error) {
                    addToast('Erro ao buscar os dados do usuário', 'error');
                    navigate('/login');
                    console.error("Erro ao buscar os dados do usuário:", error);
                }
            };

            fetchUserInfo();
        }
    }, [user, addToast]);

    // Enquanto o usuário não for carregado, nada é renderizado.
    if (!user) return null; 

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 mt-8 p-6 transition-all duration-300 md:ml-64">
                <h1 className="text-2xl md:text-3xl text-gray-600 tracking-tighter font-bold">
                    <Greeting />, {user.username}! <HeartPulse className="inline ml-2 h-7 w-7" />
                </h1>
                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Essas são as estatísticas de sua alimentação diária.
                </p>

                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <CardDashboard
                                title="Calorias Consumidas"
                                value={caloriesConsumed || 0}
                                goal={caloriesNeeded}
                                color="bg-emerald-500"
                                Icon={Apple}
                                type="food"
                            />

                            <CardDashboard
                                title="Água Consumida"
                                value={waterConsumed || 0}
                                goal={waterNeeded}
                                color="bg-sky-500"
                                Icon={GlassWater}
                                type="water"
                            />
                        </div>
                        <div className="mt-8">
                            <ChartBars />
                        </div>
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        <h1 className="text-xl md:text-xl text-gray-600 tracking-tighter font-bold">
                            Histórico de Refeições
                            <History className="inline ml-2" />
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed">
                            Aqui são exibidas suas ultimas 6 refeições.
                        </p>
                        <MealHistoryTable page="dashboard" />
                    </div>
                </div>
            </div>
        </div>
    );
}
