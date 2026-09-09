const validateRegister = (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length < 3) {
        errors.name = "Name must be at least 3 characters";
    }

    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Please enter a valid email";
    }

    if (!data.password) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

const validateLogin = (data) => {
    const errors = {};

    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Please enter a valid email";
    }

    if (!data.password) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export { validateRegister, validateLogin };