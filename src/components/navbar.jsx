import React from 'react';
import logoWhite from '../assets/img/logo-white.svg';

export function Navbar() {
    return (
        <nav className="bg-emerald-700">
            <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-12 w-auto" src={logoWhite} alt="Logo NutriFied" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

