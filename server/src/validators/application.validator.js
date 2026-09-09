
const validateApplication = (data) => {
    const errors = {};

   
    if (!data.phone) {
        errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number";
    }

    
    if (!data.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
    } else {
        const dob = new Date(data.dateOfBirth);

        if (isNaN(dob.getTime())) {
            errors.dateOfBirth = "Invalid date of birth";
        } else if (dob >= new Date()) {
            errors.dateOfBirth = "Date of birth must be in the past";
        }
    }

   
    if (
        !data.serviceCategories ||
        !Array.isArray(data.serviceCategories) ||
        data.serviceCategories.length === 0
    ) {
        errors.serviceCategories =
            "At least one service category is required";
    }

    
    if (
        !data.skills ||
        !Array.isArray(data.skills) ||
        data.skills.length === 0
    ) {
        errors.skills = "At least one skill is required";
    }

    // Experience
    if (!data.experience) {
        errors.experience = "Experience is required";
    } else {

        if (
            data.experience.years === undefined ||
            data.experience.years === null ||
            data.experience.years === ""
        ) {
            errors.experienceYears =
                "Experience years are required";
        } else if (
            Number(data.experience.years) < 0
        ) {
            errors.experienceYears =
                "Experience cannot be negative";
        }

        if (
            data.experience.description &&
            data.experience.description.length > 500
        ) {
            errors.experienceDescription =
                "Experience description must be less than 500 characters";
        }
    }


    if (!data.location) {
        errors.location = "Location is required";
    } else {

        if (!data.location.address?.trim()) {
            errors.address = "Address is required";
        }

        if (!data.location.city?.trim()) {
            errors.city = "City is required";
        }

        if (!data.location.state?.trim()) {
            errors.state = "State is required";
        }

        if (!data.location.pincode) {
            errors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(data.location.pincode)) {
            errors.pincode = "Pincode must be 6 digits";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export { validateApplication };