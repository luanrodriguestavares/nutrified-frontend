import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { MealHistoryTable } from '../components/mealHistoryTable';
import { useToast } from "../components/toast";
import useAuth from "../hooks/useAuth";  
import { Coffee } from "lucide-react";

export function MealHistoryPage() {
    const [user, setUser] = useState(null);
    const addToast = useToast();
    const loggedUser = useAuth(addToast);

    // Verifica se o usuário está logado
    useEffect(() => {
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, [loggedUser]);

    if (!user) return null; 

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 mt-8 p-6 transition-all duration-300 md:ml-64">
                <h1 className="text-2xl md:text-3xl text-gray-600 tracking-tighter font-bold">
                    Hístórico de Refeições <Coffee className="inline ml-2 h-7 w-7"/>
                </h1>
                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Aqui serão exibidas todos os registros de suas refeições.
                </p>
                <div className="mt-8 space-y-6">
                    <MealHistoryTable page="mealhistorypage" />
                </div>
            </div>
        </div>
    );
}
