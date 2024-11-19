import { useState, useEffect } from "react";

// Hook para verificar se o usuário está logado
const useAuth = (addToast) => {
    const [user, setUser] = useState(null);

    // Verifica se o usuário está logado
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        // Redireciona para a tela de login se o usuário não estiver logado
        if (!isAuthenticated || !loggedInUser) {
            window.location.href = "/login";
            return;
        }

        const userData = JSON.parse(loggedInUser);
        setUser(userData);

        // Função para buscar os dados do usuário
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/user/${userData.id}`, {
                    method: "GET",
                });

                // Verificar se a requisição foi bem-sucedida
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    addToast("Erro ao buscar os dados do usuário", "error");
                    console.error("Usuário não encontrado");
                }
            } catch (error) {
                addToast("Erro ao buscar os dados do usuário", "error");
                console.error("Erro ao buscar os dados do usuário:", error);
            }
        };

        fetchUserInfo();
    }, [addToast]);

    return user;
};

export default useAuth;
