import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Greeting } from "../components/greeting";
import { InputField } from "../components/inputField";
import { useToast } from "../components/toast";
import useAuth from "../hooks/useAuth"; 
import { User, Mail, Weight, Users, Ruler, ChevronDown, HeartPulse } from "lucide-react";

export function UserProfilePage() {
    const [user, setUser] = useState(null);
    const addToast = useToast();

    // Usando o hook useAuth para pegar o usuário autenticado
    const loggedUser = useAuth(addToast);

    // Atualizar o estado do usuário após o hook useAuth retornar os dados
    useEffect(() => {
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, [loggedUser]);

    // Enquanto o usuário não for carregado, nada é renderizado.
    if (!user) return null;

    const handleInputChange = (e, field) => {
        setUser({
            ...user,
            [field]: e.target.value,
        });
    };
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 mt-8 p-6 transition-all duration-300 md:ml-64">
                <h1 className="text-2xl md:text-3xl text-gray-600 tracking-tighter font-bold">
                    <Greeting />, {user.username}! <HeartPulse className="inline ml-2 h-7 w-7" />
                </h1>
                <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Aqui estão os seus dados de perfil.
                </p>
                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Nome de Usuário"
                                name="username"
                                type="text"
                                placeholder="Nome de Usuário"
                                value={user.username || ""}
                                Icon={User}
                                onChange={(e) => handleInputChange(e, "username")}
                                readonly={true}
                            />
                            <InputField
                                label="E-mail"
                                name="email"
                                type="email"
                                placeholder="E-mail"
                                value={user.email || ""}
                                Icon={Mail}
                                onChange={(e) => handleInputChange(e, "email")}
                                readonly={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Idade"
                                name="age"
                                type="number"
                                placeholder="Idade"
                                value={user.age || ""}
                                Icon={Users}
                                onChange={(e) => handleInputChange(e, "age")}
                                readonly={true}
                            />
                            <InputField
                                label="Peso"
                                name="weight"
                                type="number"
                                placeholder="Peso"
                                value={user.weight || ""}
                                Icon={Weight}
                                onChange={(e) => handleInputChange(e, "weight")}
                                readonly={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="container sm:mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Altura"
                                name="height"
                                type="number"
                                placeholder="Altura"
                                value={user.height || ""}
                                Icon={Ruler}
                                onChange={(e) => handleInputChange(e, "height")}
                                readonly={true}
                            />
                            <InputField
                                label="Gênero"
                                name="gender"
                                type="text"
                                placeholder="Gênero"
                                value={user.gender === "male" ? "Homem" : user.gender === "female" ? "Mulher" : "Outro"}
                                Icon={ChevronDown}
                                onChange={(e) => handleInputChange(e, "gender")}
                                readonly={true}
                            />
                        </div>
                        <div className="mt-8">
                            <InputField
                                label="Objetivo"
                                name="goal"
                                type="text"
                                placeholder="Objetivo"
                                value={
                                    user.goal === "maintain weight" ? "Manter peso" : user.goal === "lose weight" ? "Perder peso" : user.goal === "gain weight" ? "Ganhar peso" : "Outro"
                                }
                                Icon={ChevronDown}
                                onChange={(e) => handleInputChange(e, "goal")}
                                readonly={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
