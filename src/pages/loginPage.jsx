import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { InputField } from "../components/inputField";
import { Footer } from "../components/footer";
import { useToast } from "../components/toast";
import { User, KeyRound } from "lucide-react";
import art from "../assets/img/art.svg";

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const addToast = useToast();
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email: email,
            password: password
        };

        // Envia os dados para o backend
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida
            if (response.ok) {
                addToast("Bem-vindo!", "success");
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/dashboard');
            } else {
                addToast("Erro ao fazer login", "error");
                setError(data.error || 'Erro desconhecido');
            }
        } catch (error) {
            addToast("Erro ao fazer login", "error");
            setError('Erro ao tentar se conectar. Tente novamente.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="fixed top-0 w-full z-30">
                <Navbar />
            </div>

            <div className="font-[sans-serif] mt-24 md:mt-16 flex flex-col items-center justify-center px-4 flex-grow">
                <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-lg w-full shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] mx-auto">
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div className="mb-8">
                                <h3 className="text-gray-800 text-3xl font-extrabold">
                                    Login
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                                    Acesse sua conta no Nutrified e descubra um universo de bem-estar e saúde ao seu alcance.
                                </p>
                            </div>

                            <InputField
                                label="E-mail"
                                name="email"
                                type="text"
                                placeholder="Digite seu email"
                                Icon={User}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <InputField
                                label="Senha"
                                name="password"
                                type="password"
                                placeholder="Digite sua senha"
                                Icon={KeyRound}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && <div className="text-red-500 text-sm">{error}</div>}

                            <div className="!mt-8">
                                <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all">
                                    Login
                                </button>
                            </div>
                            <p className="text-sm text-center text-gray-800 !mt-8">
                                Não possui uma conta?
                                <a href="/register" className="text-emerald-600 font-semibold hover:underline ml-1">
                                    Cadastre-se aqui
                                </a>
                            </p>
                        </form>
                    </div>
                    <div className="lg:h-[500px] md:h-[500px] mt-8 md:mt-0">
                        <img src={art} className="w-full h-full max-md:w-4/5 mx-auto" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
