import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoEmerald from '../assets/img/logo-emerald.svg';
import { Home, Menu, Citrus, X, Dumbbell, Banana, LogOut, GlassWater } from 'lucide-react';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();


    // Efeito para bloquear/desbloquear o scroll da página quando a sidebar estiver aberta
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    // Função para fechar a sidebar
    const handleCloseSidebar = () => {
        setIsOpen(false);
    };


    // Função para tratar o logout (ainda sem lógica real)
    const handleLogout = async () => {
        try {
            console.log("Logout acionado");
    
            const response = await fetch('http://127.0.0.1:5000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login';
            } else {
                console.error('Falha ao fazer logout');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer logout', error);
        }
    };


    // Função para determinar a classe CSS de cada link
    const getLinkClass = (path) => {
        const location = useLocation();
        const isActive = location.pathname === path || (path === "/dashboard" && location.pathname === "/");
        return `relative flex flex-row items-center h-11 focus:outline-none ${
            isActive ? "bg-gray-100 text-gray-700 border-emerald-600" : "hover:bg-gray-100 text-gray-700 border-transparent"
        } border-l-4 pr-6`;
    };


    return (
        <div className="flex relative">
            <div className="w-10 h-10 flex items-center justify-center top-2 left-2 md:hidden z-20 fixed bg-gray-50 rounded-full border border-gray-200 shadow-md shadow-gray-700/10">
                <button className="text-gray-500 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-950 bg-opacity-70 z-10 md:hidden" onClick={handleCloseSidebar}></div>
            )}

            <div className={`fixed flex flex-col top-0 left-0 h-full bg-gray-50 border-r border-gray-200 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 z-20 md:translate-x-0 md:w-64`}>
                <div className="flex items-center justify-center border-b border-gray-200 h-28">
                    <div>
                        <img src={logoEmerald} className="w-20 h-auto" alt="Logo" />
                    </div>
                </div>
                
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-medium tracking-wide text-gray-700">Menu</div>
                            </div>
                        </li>
                        <li>
                            <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Home className="w-5 h-5" />
                                </span>
                                <span className="ml-2 text-sm truncate">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register-meal" className={getLinkClass("/register-meal")}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Citrus className="w-5 h-5" />
                                </span>
                                <span className="ml-2 text-sm truncate">Refeição</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register-water" className={getLinkClass("/register-water")}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <GlassWater className="w-5 h-5" />
                                </span>
                                <span className="ml-2 text-sm truncate">Água</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/meal-history" className={getLinkClass("/meal-history")}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Banana className="w-5 h-5" />
                                </span>
                                <span className="ml-2 text-sm truncate">Histórico de Refeições</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-profile" className={getLinkClass("/user-profile")}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Dumbbell className="w-5 h-5" />
                                </span>
                                <span className="ml-2 text-sm truncate">Seu Perfil</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="border-t border-gray-200 p-4 fixed bottom-0 w-64 bg-gray-50">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LogOut className="w-5 h-5 mr-2" />
                        <span className="text-sm">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
