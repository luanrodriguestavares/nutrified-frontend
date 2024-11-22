import React, { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff } from "lucide-react"; // Adicionando os ícones do Lucide

export function InputField({
    label,
    name,
    type,
    placeholder,
    Icon,
    options = [],
    value = "",
    onChange,
    readonly = false,
}) {
    const [filter, setFilter] = useState(String(value));
    const [selectedLabel, setSelectedLabel] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
    const inputRef = useRef(null);
    const optionsRef = useRef(null);

    // Atualiza o filtro quando o valor mudar
    useEffect(() => {
        setFilter(String(value));
    }, [value]);

    // Atualiza o filtro quando o input mudar
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setFilter(newValue === "" ? "" : String(newValue));
        if (onChange) {
            onChange(e);
        }
    };

    // Filtra as opções
    const filteredOptions = filter
        ? options.filter((option) =>
            String(option.label)
                .toLowerCase()
                .includes(String(filter).toLowerCase())
        )
        : options;

    // Seleciona uma opção
    const handleSelect = (selectedValue, label) => {
        setFilter(label);
        setSelectedLabel(label);
        setIsOpen(false);
        if (onChange && type === "select") {
            onChange({ target: { name, value: selectedValue } });
        }
    };

    // Limpa o filtro
    const handleClear = () => {
        setFilter("");
        setSelectedLabel("");
        if (onChange) {
            onChange({ target: { name, value: "" } });
        }
    };

    // Verifica se o clique foi fora do input
    const handleClickOutside = (e) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(e.target) &&
            optionsRef.current &&
            !optionsRef.current.contains(e.target)
        ) {
            setIsOpen(false);
        }
    };

    // Adiciona um event listener para detectar cliques fora do input
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Alterna entre mostrar/ocultar a senha
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className="text-gray-800 text-sm font-medium px-3 mb-2 block">
                {label}
            </label>
            <div className="relative flex items-center">
                {type === "select" ? (
                    <>
                        <input
                            ref={inputRef}
                            type="text"
                            value={selectedLabel || filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setIsOpen(true);
                                handleInputChange(e);
                            }}
                            onClick={() => setIsOpen(true)}
                            placeholder={placeholder}
                            readOnly={readonly}
                            className={`w-full text-sm px-4 py-3 rounded-full outline-emerald-600 pr-10 ${readonly
                                    ? "bg-gray-200 text-gray-600 border border-gray-200 cursor-not-allowed"
                                    : "text-gray-800 border border-gray-300"
                                }`}
                        />
                        {selectedLabel && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-12 text-gray-400 mr-2"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        {isOpen && !readonly && (
                            <ul
                                ref={optionsRef}
                                className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10 top-full"
                            >
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelect(option.value, option.label)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {option.label}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-500">
                                        Nenhuma opção encontrada
                                    </li>
                                )}
                            </ul>
                        )}
                    </>
                ) : type === "datetime" ? (
                    <input
                        name={name}
                        type="datetime-local"
                        required
                        onChange={handleInputChange}
                        readOnly={readonly}
                        className={`w-full text-sm px-4 py-3 rounded-full outline-emerald-600 pr-10 remove-calendar-icon ${readonly
                                ? "bg-gray-200 text-gray-600 border border-gray-200 cursor-not-allowed"
                                : "text-gray-800 border border-gray-300"
                            }`}
                        placeholder={placeholder}
                    />
                ) : type === "password" ? (
                    <div className="w-full flex items-center relative">
                        <input
                            name={name}
                            type={showPassword ? "text" : "password"} // Alterna entre texto e senha
                            value={filter}
                            required
                            onChange={handleInputChange}
                            readOnly={readonly}
                            className={`w-full text-sm px-4 py-3 rounded-full outline-emerald-600 pr-10 ${readonly
                                    ? "bg-gray-200 text-gray-600 border border-gray-200 cursor-not-allowed"
                                    : "text-gray-800 border border-gray-300"
                                }`}
                            placeholder={placeholder}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 text-gray-400"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                ) : (
                    <input
                        name={name}
                        type={type}
                        value={filter}
                        required
                        onChange={handleInputChange}
                        readOnly={readonly}
                        className={`w-full text-sm px-4 py-3 rounded-full outline-emerald-600 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${readonly
                                ? "bg-gray-200 text-gray-600 border border-gray-200 cursor-not-allowed"
                                : "text-gray-800 border border-gray-300"
                            }`}
                        placeholder={placeholder}
                    />
                )}
                {Icon && <Icon className="absolute right-4 text-gray-400" />}
            </div>
        </div>
    );
}
