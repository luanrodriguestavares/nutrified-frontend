const regexPatterns = {
    username: /^[a-zA-Z][a-zA-Z0-9._]{2,14}$/,
    email: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    weight: /^(?:\d{1,3}(?:\.\d{1,2})?)$/,
    height: /^(?:[3-9][0-9]|[1-2][0-9]{2})$/,
    age: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
};

const errorMessages = {
    username: {
        required: "O nome de usuário é obrigatório.",
        invalid: "O nome de usuário deve começar com uma letra e ter de 3 a 15 caracteres.",
    },
    email: {
        required: "O e-mail é obrigatório.",
        invalid: "Insira um e-mail válido, como exemplo@dominio.com.",
    },
    password: {
        required: "A senha é obrigatória.",
        invalid: "A senha deve ter ao menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.",
    },
    weight: {
        required: "O peso é obrigatório.",
        invalid: "O peso deve ser um número com até 3 dígitos e 2 casas decimais (exemplo: 70.5).",
    },
    height: {
        required: "A altura é obrigatória.",
        invalid: "A altura deve ser um número inteiro entre 30 e 300 (em cm).",
    },
    age: {
        required: "A idade é obrigatória.",
        invalid: "A idade deve ser um número inteiro entre 1 e 120.",
    },
};

export { regexPatterns, errorMessages };
