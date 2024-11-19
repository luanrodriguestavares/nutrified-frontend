import React, { useState } from 'react';
import { ReportModal } from './reportModal';
import { TriangleAlert } from 'lucide-react';

export function CardDashboard({ title, value, goal, color, Icon, type }) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Calcula a porcentagem
    const percentage = (value / goal) * 100;


    // Verifica se o objetivo foi atingido
    const isOverGoal = value > goal;


    // Calcula a quantidade restante
    const remaining = goal - value > 0 ? goal - value : 0;


    // Unidades de medidas 
    const unit = type === 'water' ? 'ml' : type === 'food' ? 'kcal' : '';


    // Abre e fecha o modal de relatório
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <>
            <div onClick={openModal} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer">
                <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-between px-4 py-4">
                        <div className="flex mr-4">
                            <span className={`items-center px-4 py-4 m-auto rounded-full ${color} hover:bg-opacity-75`}>
                                {Icon && <Icon className="w-6 h-6 text-gray-50" />}
                            </span>
                        </div>
                        <div className="flex-1 pl-1">
                            <div className="text-md md:text-xl font-medium text-gray-600">
                                {value} {unit} &gt; {goal} {unit} {isOverGoal && <TriangleAlert className="inline" />}
                            </div>
                            <div className="text-xs text-gray-400 sm:text-sm">
                                {title}
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full pt-2 text-sm text-gray-400">
                            <span>0 {unit}</span>
                            <span>{goal} {unit}</span>
                            {isOverGoal && <span className="text-red-500">{value} {unit}</span>}
                        </div>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title={title}
                value={value}
                goal={goal}
                remaining={remaining}
                percentage={percentage}
                unit={unit}
                isOverGoal={isOverGoal}
            />
        </>
    );
}
