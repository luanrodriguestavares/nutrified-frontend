import React from "react";

export function Greeting() {
    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            return "Bom dia";

        } else if (currentHour < 18) {
            return "Boa tarde";

        } else {
            return "Boa noite";
        }
    };

    return <span>{getGreeting()}</span>;
}