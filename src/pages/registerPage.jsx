import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/inputField";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useToast } from "../components/toast";
import { User, Mail, KeyRound, Weight, Users, Ruler, ChevronDown } from "lucide-react";
import art from "../assets/img/art.svg";

export function RegisterPage() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const addToast = useToast();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [goal, setGoal] = useState('');

    // Função para lidar com a mudança de pagina
    const handleNextStep = () => {
        setStep(2);
    };

    // Função para enviar o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            email,
            password,
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender,
            goal
        };

        // Envia os dados para o backend
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Verifica se a requisição foi bem-sucedida
            if (response.ok) {
                addToast("Usuário cadastrado com sucesso!", "success");
                console.log("Cadastro realizado com sucesso!");
                navigate('/login');
            } else {
                addToast("Erro ao cadastrar usuário", "error");
                console.error("Erro ao cadastrar usuário");
            }
        } catch (error) {
            addToast("Erro ao enviar dados", "error");
            console.error("Erro ao enviar dados", error);
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
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <h3 className="text-gray-800 text-3xl font-extrabold">
                                    Registre-se
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                                    Crie sua conta no Nutrified e descubra um universo de bem-estar e saúde ao seu alcance.
                                </p>
                            </div>

                            {step === 1 && (
                                <>
                                    <InputField
                                        label="Nome de Usuário"
                                        name="username"
                                        type="text"
                                        placeholder="Digite seu nome de usuário"
                                        Icon={User}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <InputField
                                        label="E-mail"
                                        name="email"
                                        type="email"
                                        placeholder="Digite seu e-mail"
                                        Icon={Mail}
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

                                    <div className="!mt-8">
                                        <button type="button" onClick={handleNextStep} className="w-full shadow-xl py-3 px-4 text-sm rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all">
                                            Próximo
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Peso"
                                            name="weight"
                                            type="number"
                                            placeholder="Digite seu peso"
                                            Icon={Weight}
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                        <InputField
                                            label="Idade"
                                            name="age"
                                            type="number"
                                            placeholder="Digite sua idade"
                                            Icon={Users}
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Altura"
                                            name="height"
                                            type="number"
                                            placeholder="Digite sua altura (em cm)"
                                            Icon={Ruler}
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                        />
                                        <InputField
                                            label="Gênero"
                                            name="gender"
                                            type="select"
                                            placeholder="Selecione seu gênero"
                                            Icon={ChevronDown}
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            options={[
                                                { value: "male", label: "Homem" },
                                                { value: "female", label: "Mulher" },
                                                { value: "other", label: "Outro" }
                                            ]}
                                        />
                                    </div>

                                    <div className="!mt-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <label className="text-gray-800 text-sm block col-span-1 md:col-span-3">
                                                Selecione seu objetivo
                                            </label>
                                            <button type="button" onClick={() => setGoal("lose weight")} className={`cursor-pointer ${goal === 'lose weight' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800'} border border-gray-300 hover:bg-emerald-500 hover:border-none md:aspect-square rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                <p className="text-center text-sm">
                                                    Emagrecimento
                                                </p>
                                            </button>
                                            <button type="button" onClick={() => setGoal("maintain weight")} className={`cursor-pointer ${goal === 'maintain weight' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800'} border border-gray-300 hover:bg-emerald-500 hover:border-none md:aspect-square rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                <p className="text-center text-sm">
                                                    Manter seu peso
                                                </p>
                                            </button>
                                            <button type="button" onClick={() => setGoal("gain weight")} className={`cursor-pointer ${goal === 'gain weight' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800'} border border-gray-300 hover:bg-emerald-500 hover:border-none md:aspect-square rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                <p className="text-center text-sm">
                                                    Subir de peso
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="!mt-8">
                                        <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all">
                                            Registrar
                                        </button>
                                    </div>
                                </>
                            )}

                            <p className="text-sm text-center text-gray-800 !mt-8">
                                Já tem uma conta?
                                <a href="/login" className="text-emerald-600 font-semibold hover:underline ml-1">
                                    Faça Login
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
