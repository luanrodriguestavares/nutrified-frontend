import React from 'react';
import Modal from 'react-modal';
import { X, TriangleAlert } from 'lucide-react';

Modal.setAppElement('#root');

export function ReportModal({ isOpen, onRequestClose, title, value, goal, remaining, percentage, unit, isOverGoal }) {
    const exceededAmount = isOverGoal ? value - goal : 0; 

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Detalhes do Card" className="relative w-11/12 max-w-md md:max-w-2xl lg:max-w-4xl p-6 mx-auto mt-10 bg-white rounded-2xl shadow-lg focus:outline-none overflow-auto max-h-[90vh]" overlayClassName="fixed inset-0 bg-gray-950 bg-opacity-70 z-30 px-4">
            <button onClick={onRequestClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-40">
                <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col p-3 space-y-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-600 mb-[-15px]">Relatório de Alimentação</h1>
                <h2 className="text-md md:text-lg font-semibold text-gray-500">{title}</h2>

                <div className="grid gap-4 w-full mb-4 grid-cols-1 cursor-default">
                    <div className="bg-emerald-400 p-4 rounded-xl text-white transform transition-transform duration-200">
                        <h3 className="font-semibold">Qtd. Consumida</h3>
                        <p>{value} {unit}</p>
                    </div>
                    <div className="bg-blue-400 p-4 rounded-xl text-white transform transition-transform duration-200">
                        <h3 className="font-semibold">Meta</h3>
                        <p>{goal} {unit}</p>
                    </div>
                    {!isOverGoal && (
                        <div className="bg-purple-400 p-4 rounded-xl text-white transform transition-transform duration-200">
                            <h3 className="font-semibold">Qtd. Restante</h3>
                            <p>{remaining} {unit}</p>
                        </div>
                    )}
                </div>

                {isOverGoal && (
                    <div className="bg-rose-400 p-4 rounded-xl text-white transform transition-transform duration-200">
                        <h3 className="font-semibold">Aviso <TriangleAlert className="inline" /></h3>
                        <p className="text-gray-50">Você ultrapassou sua meta diária em: {exceededAmount} {unit}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
