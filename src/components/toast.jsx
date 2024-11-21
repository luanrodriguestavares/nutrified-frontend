import React, { createContext, useState, useContext, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const ToastContext = createContext();

// Provedor do Toast
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Função para adicionar um Toast
    const addToast = (message, type = "success") => {
        const id = Date.now();
        
        // Verificar se já existem 4 toasts e remover o mais antigo, se necessário
        if (toasts.length >= 4) {
            setToasts((prev) => [...prev.slice(1), { id, message, type }]);
        } else {
            setToasts((prev) => [...prev, { id, message, type }]);
        }
    };

    // Função para remover um Toast
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Renderizando os Toasts
    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// Hook para acessar o Toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Componente Toast individual
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icon = type === "success" ? (
        <CheckCircle className="text-gray-50 w-6 h-6" />
    ) : (
        <XCircle className="text-gray-50 w-6 h-6" />
    );

    const bgColor = type === "success" ? "bg-emerald-600 border-emerald-700" : "bg-rose-600 border-rose-700";

    return (
        <div className={`flex items-start p-4 border rounded-full ${bgColor} animate-fadeIn`} style={{ minWidth: "300px" }}>
            {icon}
            <div className="ml-2 flex-1">
                <p className="text-sm font-medium text-gray-50">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-50 hover:text-gray-100">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};
