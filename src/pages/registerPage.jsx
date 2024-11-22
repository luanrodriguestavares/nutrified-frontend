import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/inputField";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useToast } from "../components/toast";
import { User, Mail, KeyRound, Weight, Users, Ruler, ChevronDown } from "lucide-react";
import art from "../assets/img/art.svg";
import { regexPatterns, errorMessages } from "../utils/regexPatterns";

export function RegisterPage() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const addToast = useToast();

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        weight: "",
        height: "",
        age: "",
        gender: "",
        goal: "",
    });

    // Estado para armazenar os erros de validação
    const [errors, setErrors] = useState({});

    // Função para lidar com as mudanças nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const pattern = regexPatterns[name];

        // Atualizando o estado
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validando o campo
        if (pattern && !pattern.test(value)) {
            setErrors((prev) => ({
                ...prev,
                [name]: errorMessages[name]?.invalid || `Campo ${name} inválido.`,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleNextStep = () => setStep(2);
    const handleGoalSelection = (goal) => setFormData((prev) => ({ ...prev, goal }));

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validando os dados
        if (Object.values(errors).some((err) => err)) {
            addToast("Corrija os erros antes de continuar.", "error");
            return;
        }
    
        // Formatando os dados
        const formattedData = {
            ...formData,
            weight: parseFloat(formData.weight),
            height: parseInt(formData.height, 10),
            age: parseInt(formData.age, 10),
        };
    
        // Enviando os dados
        try {
            const response = await fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });
    
            // Verificando se a requisição foi bem-sucedida
            if (response.ok) {
                addToast("Usuário cadastrado com sucesso!", "success");
                navigate("/login");
            } else {
                addToast("Erro ao cadastrar usuário", "error");
            }
        } catch (error) {
            addToast("Erro ao enviar dados", "error");
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
                                <h3 className="text-gray-800 text-3xl font-extrabold">Registre-se</h3>
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
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}

                                    <InputField
                                        label="E-mail"
                                        name="email"
                                        type="email"
                                        placeholder="Digite seu e-mail"
                                        Icon={Mail}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

                                    <InputField
                                        label="Senha"
                                        name="password"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

                                    <button type="button" onClick={handleNextStep} className="w-full shadow-xl py-3 px-4 text-sm rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all mt-6">
                                        Próximo
                                    </button>
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
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                        />
                                        {errors.weight && <p className="text-red-600 text-sm">{errors.weight}</p>}

                                        <InputField
                                            label="Idade"
                                            name="age"
                                            type="number"
                                            placeholder="Digite sua idade"
                                            Icon={Users}
                                            value={formData.age}
                                            onChange={handleInputChange}
                                        />
                                        {errors.age && <p className="text-red-600 text-sm">{errors.age}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Altura"
                                            name="height"
                                            type="number"
                                            placeholder="Digite sua altura (em cm)"
                                            Icon={Ruler}
                                            value={formData.height}
                                            onChange={handleInputChange}
                                        />
                                        {errors.height && <p className="text-red-600 text-sm">{errors.height}</p>}

                                        <InputField
                                            label="Gênero"
                                            name="gender"
                                            type="select"
                                            placeholder="Selecione seu gênero"
                                            Icon={ChevronDown}
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: "male", label: "Homem" },
                                                { value: "female", label: "Mulher" },
                                                { value: "other", label: "Outro" },
                                            ]}
                                        />
                                    </div>

                                    <div className="!mt-6">
                                        <label className="text-gray-800 text-sm block mb-2">Selecione seu objetivo</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <button type="button" onClick={() => handleGoalSelection("lose weight")} className={`cursor-pointer ${formData.goal === "lose weight" ? "bg-emerald-500 text-white" : "bg-white text-gray-800"} border md:aspect-square border-gray-300 hover:bg-emerald-500 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                Emagrecimento
                                            </button>
                                            <button type="button" onClick={() => handleGoalSelection("maintain weight")} className={`cursor-pointer ${formData.goal === "maintain weight" ? "bg-emerald-500 text-white" : "bg-white text-gray-800"} md:aspect-square border border-gray-300 hover:bg-emerald-500 hover:text-white  rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                Manter o peso
                                            </button>
                                            <button type="button" onClick={() => handleGoalSelection("gain weight")} className={`cursor-pointer ${formData.goal === "gain weight" ? "bg-emerald-500 text-white" : "bg-white text-gray-800"} md:aspect-square  border border-gray-300 hover:bg-emerald-500 hover:text-white rounded-lg p-2 flex items-center justify-center transition-all`}>
                                                Ganho de peso
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full shadow-xl py-3 px-4 text-sm rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all mt-8">
                                        Registrar
                                    </button>
                                </>
                            )}
                            <p className="text-sm text-center text-gray-800 !mt-8">
                                Já possui uma conta?
                                <a href="/login" className="text-emerald-600 font-semibold hover:underline ml-1">
                                    Entrar
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
