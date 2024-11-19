import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { InputField } from "../components/inputField";
import { useToast } from "../components/toast";
import useAuth from "../hooks/useAuth";
import { GlassWater } from "lucide-react";

export function RegisterWaterPage() {
    const [waterLogs, setWaterLogs] = useState([]);
    const [inputQuantity, setInputQuantity] = useState("");
    const [totalWater, setTotalWater] = useState(0);
    const [date, setDate] = useState("");
    const addToast = useToast();
    const loggedUser = useAuth(addToast);

    // Função para salvar o registro de água
    const handleAddWaterRecord = async () => {
        if (!loggedUser) {
            addToast("Erro: Usuário não encontrado", "error");
            return;
        }

        // Cria o objeto do registro
        const waterRecord = {
            user_id: loggedUser.id,
            quantity: totalWater,
            date,
        };

        // Envia o registro para o backend
        try {
            const response = await fetch("http://127.0.0.1:5000/water/record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(waterRecord),
                credentials: "include",
            });

            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida
            if (response.ok) {
                addToast("Registro de água adicionado com sucesso!", "success");
                setInputQuantity("");
                setTotalWater(0);
                setDate("");
                fetchWaterLogs();
            } else {
                addToast(`Erro ao adicionar registro: ${data.message || "Erro desconhecido"}`, "error");
            }
        } catch (error) {
            addToast("Erro ao enviar registro", "error");
        }
    };

    // Função para buscar os registros de água
    const fetchWaterLogs = async () => {
        if (!loggedUser) return;

        // Envia a requisição para o backend
        try {
            const response = await fetch(`http://127.0.0.1:5000/water/logs?user_id=${loggedUser.id}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida
            if (response.ok) {
                setWaterLogs(data);
            } else {
                setWaterLogs([]);
            }
        } catch (error) {
            addToast("Erro ao buscar registros", "error");
        }
    };

    useEffect(() => {
        fetchWaterLogs();
    }, [loggedUser]);

    // Função para atualizar o total de água
    const handleInputQuantityChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setInputQuantity(value);
        setTotalWater(value ? parseInt(value) : 0);
    };

    // Função para preencher a data e hora atual
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    }, []);

    if (!loggedUser) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 mt-8 p-6 md:ml-64">
                <h1 className="text-3xl text-gray-600 font-bold">
                    Adicionar Consumo de Água <GlassWater className="inline ml-2 h-7 w-7" />
                </h1>
                <p className="text-gray-500 mb-2">Registre a quantidade de água consumida ao longo do dia.</p>

                <div className="mt-8 space-y-6">
                    <div className="relative mb-6 border border-gray-200 rounded-2xl py-6 px-3 bg-gray-50">
                        <InputField
                            label="Quantidade de Água (ml)"
                            name="quantity"
                            placeholder="Digite a quantidade de água em ml"
                            type="number"
                            value={inputQuantity}
                            onChange={handleInputQuantityChange}
                        />
                    </div>

                    <div className="mt-6">
                        <div className="mb-4">
                            <label htmlFor="date" className="text-gray-800 text-sm font-medium px-3 mb-2">
                                Data e Hora do Registro
                            </label>
                            <input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm"
                            />
                        </div>
                        <button onClick={handleAddWaterRecord} className="w-full py-3 px-4 text-sm font-semibold rounded-full text-white bg-emerald-600 hover:bg-emerald-700">
                            Adicionar Consumo de Água
                        </button>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-700">Registros de Consumo</h2>
                        {waterLogs.length > 0 ? (
                            <div className="mt-4">
                                <ul className="space-y-4">
                                    {waterLogs.map((log) => (
                                        <li key={log.id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                                            <p className="text-gray-800 font-medium">Quantidade: {log.quantity} ml</p>
                                            <p className="text-gray-500 text-sm">
                                                Data e Hora: {new Date(log.date).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-4">Nenhum registro de consumo encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
