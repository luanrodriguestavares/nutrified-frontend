import React from "react";

export function Footer() {
    return (
        <footer className="bg-gray-50 rounded-lg shadow m-4">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-xs text-gray-500 sm:text-center ">
                    © 2024 <span className="font-bold">NutriFied</span>. Todos os direitos reservados.
                </span>
                <div className="flex flex-wrap items-center mt-2 text-xs font-medium text-gray-500 sm:mt-0">
                    Sistemas de Informação - Lab. de Programação.
                </div>
            </div>
        </footer>
    );
}
