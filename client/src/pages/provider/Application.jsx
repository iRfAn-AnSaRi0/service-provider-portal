
import { useState, useEffect } from "react";
import { Upload, ArrowRight, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "../../services/api";

const Application = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [loadingApplication, setLoadingApplication] = useState(true);
    const [existingApplication, setExistingApplication] = useState(null);

    const [formData, setFormData] = useState({
        phone: "",
        dateOfBirth: "",
        profilePhoto: null,

        serviceCategories: [],
        skills: [],
        experience: {
            years: "",
            description: "",
        },

        location: {
            address: "",
            city: "",
            state: "",
            pincode: "",
        },

        identityProof: null,
        addressProof: null,
    });

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await api.get("/application");

                console.log("Existing application:", response.data);

                const application = response.data.data;


                if (application) {
                    setExistingApplication(application);
                    setFormData({
                        phone: application.phone || "",
                        dateOfBirth: application.dateOfBirth
                            ? application.dateOfBirth.split("T")[0]
                            : "",
                        profilePhoto: null,

                        serviceCategories: application.serviceCategories || [],
                        skills: application.skills || [],

                        experience: {
                            years: application.experience?.years || "",
                            description:
                                application.experience?.description || "",
                        },

                        location: {
                            address: application.location?.address || "",
                            city: application.location?.city || "",
                            state: application.location?.state || "",
                            pincode: application.location?.pincode || "",
                        },

                        identityProof: null,
                        addressProof: null,
                    });
                }
            } catch (error) {
    console.error("Get application error:", error);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
            } finally {
                setLoadingApplication(false);
            }
        };

        fetchApplication();
    }, []);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // Validate Step 1
    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number.";
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required.";
        }

        if (!formData.profilePhoto && !existingApplication?.profilePhoto?.url) {
            newErrors.profilePhoto = "Profile photo is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Validate Step 2
    const validateStep2 = () => {
        const newErrors = {};

        if (formData.serviceCategories.length === 0) {
            newErrors.serviceCategories =
                "Select at least one service category.";
        }

        if (formData.skills.length === 0) {
            newErrors.skills = "Enter at least one skill.";
        }

        if (formData.experience.years === "") {
            newErrors.experienceYears =
                "Years of experience is required.";
        } else if (Number(formData.experience.years) < 0) {
            newErrors.experienceYears =
                "Experience cannot be negative.";
        }

        if (!formData.experience.description.trim()) {
            newErrors.experienceDescription =
                "Experience description is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Validate Step 3
    const validateStep3 = () => {
        const newErrors = {};

        if (!formData.location.address.trim()) {
            newErrors.address = "Address is required.";
        }

        if (!formData.location.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!formData.location.state.trim()) {
            newErrors.state = "State is required.";
        }

        if (!formData.location.pincode.trim()) {
            newErrors.pincode = "Pincode is required.";
        } else if (!/^[0-9]{6}$/.test(formData.location.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit pincode.";
        }

        if (
            !formData.identityProof &&
            !existingApplication?.documents?.identityProof?.url
        ) {
            newErrors.identityProof = "Identity proof is required.";
        }

        if (
            !formData.addressProof &&
            !existingApplication?.documents?.addressProof?.url
        ) {
            newErrors.addressProof = "Address proof is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;

        if (step === 1) {
            isValid = validateStep1();
        }

        if (step === 2) {
            isValid = validateStep2();
        }

        if (isValid) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        setErrors({});
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep3()) {
            return;
        }

        setSubmitMessage("");
        setSubmitError("");

        try {
            setIsSubmitting(true);

            const formDataToSend = new FormData();

            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("dateOfBirth", formData.dateOfBirth);

            formDataToSend.append(
                "serviceCategories",
                JSON.stringify(formData.serviceCategories)
            );

            formDataToSend.append(
                "skills",
                JSON.stringify(formData.skills)
            );

            formDataToSend.append(
                "experience",
                JSON.stringify(formData.experience)
            );

            formDataToSend.append(
                "location",
                JSON.stringify(formData.location)
            );

            if (formData.profilePhoto) {
                formDataToSend.append(
                    "profilePhoto",
                    formData.profilePhoto
                );
            }

            if (formData.identityProof) {
                formDataToSend.append(
                    "identityProof",
                    formData.identityProof
                );
            }

            if (formData.addressProof) {
                formDataToSend.append(
                    "addressProof",
                    formData.addressProof
                );
            }

            const response = existingApplication
                ? await api.put("/application", formDataToSend)
                : await api.post("/application", formDataToSend);

            setSubmitMessage(
                response.data.message || "Application saved as draft."
            );

            setExistingApplication(response.data.data);

            console.log("Application saved:", response.data);

        } catch (error) {
            console.error("Application submission failed:", error);

            setSubmitError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            setIsSubmitting(true);
            setSubmitMessage("");
            setSubmitError("");

            const response = await api.post("/application/submit");

            setExistingApplication(response.data.data);

            setSubmitMessage(
                response.data.message || "Application submitted successfully."
            );
        } catch (error) {
            setSubmitError(
                error.response?.data?.message ||
                "Unable to submit application."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">

            {/* Header */}
            <div className="mx-auto max-w-4xl">
                <h1 className="text-2xl font-bold">
                    Provider Application
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Complete your application to become a service provider.
                </p>
            </div>

            {submitMessage && (
                <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <p className="text-sm text-green-600">
                        {submitMessage}
                    </p>
                </div>
            )}

            {submitError && (
                <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>
                </div>
            )}

            {/* Step Indicator */}
            <div className="mx-auto mt-8 max-w-4xl">
                <div className="flex items-center justify-between">

                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${step >= 1
                                ? "bg-primary text-primary-foreground"
                                : "border"
                                }`}
                        >
                            1
                        </div>

                        <p className="mt-2 text-sm">
                            Personal
                        </p>
                    </div>

                    {/* Line */}
                    <div
                        className={`mx-4 h-px flex-1 ${step >= 2
                            ? "bg-primary"
                            : "bg-border"
                            }`}
                    />

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${step >= 2
                                ? "bg-primary text-primary-foreground"
                                : "border"
                                }`}
                        >
                            2
                        </div>

                        <p className="mt-2 text-sm">
                            Services
                        </p>
                    </div>

                    {/* Line */}
                    <div
                        className={`mx-4 h-px flex-1 ${step >= 3
                            ? "bg-primary"
                            : "bg-border"
                            }`}
                    />

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${step >= 3
                                ? "bg-primary text-primary-foreground"
                                : "border"
                                }`}
                        >
                            3
                        </div>

                        <p className="mt-2 text-sm">
                            Documents
                        </p>
                    </div>

                </div>
            </div>

            {/* Form */}
            <div className="mx-auto mt-8 max-w-4xl rounded-xl border bg-card p-6">

                {/* ================= STEP 1 ================= */}

                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Provide your basic personal information.
                        </p>

                        <div className="mt-6 space-y-6">

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number
                                </Label>

                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                                {errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">
                                    Date of Birth
                                </Label>

                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />

                                {errors.dateOfBirth && (
                                    <p className="text-sm text-destructive">
                                        {errors.dateOfBirth}
                                    </p>
                                )}
                            </div>

                            {/* Profile Photo */}
                            <div className="space-y-2">
                                <Label htmlFor="profilePhoto">
                                    Profile Photo
                                </Label>

                                <div className="flex items-center gap-4">
                                    <label
                                        htmlFor="profilePhoto"
                                        className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose Photo
                                    </label>

                                    <input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleChange}
                                    />

                                    {formData.profilePhoto ? (
                                        <span className="text-sm text-muted-foreground">
                                            {formData.profilePhoto.name}
                                        </span>
                                    ) : existingApplication?.profilePhoto?.url ? (
                                        <span className="text-sm text-green-600">
                                            ✓ Profile photo already uploaded
                                        </span>
                                    ) : null}
                                </div>

                                {errors.profilePhoto && (
                                    <p className="text-sm text-destructive">
                                        {errors.profilePhoto}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Upload a clear profile photo.
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* ================= STEP 2 ================= */}

                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold">
                            Services & Experience
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Tell us about your services, skills, and professional experience.
                        </p>

                        <div className="mt-6 space-y-6">

                            {/* Service Categories */}
                            <div className="space-y-2">
                                <Label>
                                    Service Categories
                                </Label>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {[
                                        "AC & Appliance Repair",
                                        "Electrician",
                                        "Plumber",
                                        "Carpenter",
                                        "Cleaning",
                                        "Pest Control",
                                        "Painting",
                                        "Waterproofing",
                                        "Beauty & Salon",
                                        "Home Installation",
                                    ].map((category) => (
                                        <label
                                            key={category}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.serviceCategories.includes(category)}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        serviceCategories: e.target.checked
                                                            ? [
                                                                ...prev.serviceCategories,
                                                                category,
                                                            ]
                                                            : prev.serviceCategories.filter(
                                                                (item) => item !== category
                                                            ),
                                                    }));

                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        serviceCategories: "",
                                                    }));
                                                }}
                                            />

                                            <span className="text-sm">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {errors.serviceCategories && (
                                    <p className="text-sm text-destructive">
                                        {errors.serviceCategories}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Select all services you provide.
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="skills">
                                    Skills
                                </Label>

                                <Input
                                    id="skills"
                                    placeholder="Example: AC installation, wiring, pipe repair"
                                    value={formData.skills.join(", ")}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            skills: e.target.value
                                                .split(",")
                                                .map((skill) => skill.trim())
                                                .filter(Boolean),
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            skills: "",
                                        }));
                                    }}
                                />

                                {errors.skills && (
                                    <p className="text-sm text-destructive">
                                        {errors.skills}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Enter multiple skills separated by commas.
                                </p>
                            </div>

                            {/* Experience Years */}
                            <div className="space-y-2">
                                <Label htmlFor="experienceYears">
                                    Years of Experience
                                </Label>

                                <Input
                                    id="experienceYears"
                                    type="number"
                                    min="0"
                                    placeholder="Example: 5"
                                    value={formData.experience.years}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience: {
                                                ...prev.experience,
                                                years: e.target.value,
                                            },
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            experienceYears: "",
                                        }));
                                    }}
                                />

                                {errors.experienceYears && (
                                    <p className="text-sm text-destructive">
                                        {errors.experienceYears}
                                    </p>
                                )}
                            </div>

                            {/* Experience Description */}
                            <div className="space-y-2">
                                <Label htmlFor="experienceDescription">
                                    Experience Description
                                </Label>

                                <Textarea
                                    id="experienceDescription"
                                    placeholder="Describe your experience and expertise..."
                                    maxLength={500}
                                    rows={5}
                                    value={formData.experience.description}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience: {
                                                ...prev.experience,
                                                description: e.target.value,
                                            },
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            experienceDescription: "",
                                        }));
                                    }}
                                />

                                {errors.experienceDescription && (
                                    <p className="text-sm text-destructive">
                                        {errors.experienceDescription}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Maximum 500 characters.
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* ================= STEP 3 ================= */}

                {step === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold">
                            Location & Documents
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Provide your service location and required documents.
                        </p>

                        <div className="mt-6 space-y-6">

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    Address
                                </Label>

                                <Input
                                    id="address"
                                    placeholder="Enter your full address"
                                    value={formData.location.address}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                address: e.target.value,
                                            },
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            address: "",
                                        }));
                                    }}
                                />

                                {errors.address && (
                                    <p className="text-sm text-destructive">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* City + State */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                                <div className="space-y-2">
                                    <Label htmlFor="city">
                                        City
                                    </Label>

                                    <Input
                                        id="city"
                                        placeholder="Enter city"
                                        value={formData.location.city}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                location: {
                                                    ...prev.location,
                                                    city: e.target.value,
                                                },
                                            }));

                                            setErrors((prev) => ({
                                                ...prev,
                                                city: "",
                                            }));
                                        }}
                                    />

                                    {errors.city && (
                                        <p className="text-sm text-destructive">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">
                                        State
                                    </Label>

                                    <Input
                                        id="state"
                                        placeholder="Enter state"
                                        value={formData.location.state}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                location: {
                                                    ...prev.location,
                                                    state: e.target.value,
                                                },
                                            }));

                                            setErrors((prev) => ({
                                                ...prev,
                                                state: "",
                                            }));
                                        }}
                                    />

                                    {errors.state && (
                                        <p className="text-sm text-destructive">
                                            {errors.state}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Pincode */}
                            <div className="space-y-2">
                                <Label htmlFor="pincode">
                                    Pincode
                                </Label>

                                <Input
                                    id="pincode"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6-digit pincode"
                                    value={formData.location.pincode}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                pincode: e.target.value,
                                            },
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            pincode: "",
                                        }));
                                    }}
                                />

                                {errors.pincode && (
                                    <p className="text-sm text-destructive">
                                        {errors.pincode}
                                    </p>
                                )}
                            </div>

                            {/* Identity Proof */}
                            <div className="space-y-2">
                                <Label>
                                    Identity Proof
                                </Label>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <label
                                        htmlFor="identityProof"
                                        className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose File
                                    </label>

                                    <input
                                        id="identityProof"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                identityProof:
                                                    e.target.files?.[0] || null,
                                            }));

                                            setErrors((prev) => ({
                                                ...prev,
                                                identityProof: "",
                                            }));
                                        }}
                                    />

                                    {formData.identityProof && (
                                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                            {formData.identityProof.name}
                                        </span>
                                    )}
                                </div>

                                {errors.identityProof && (
                                    <p className="text-sm text-destructive">
                                        {errors.identityProof}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Upload a valid identity document.
                                </p>
                            </div>

                            {/* Address Proof */}
                            <div className="space-y-2">
                                <Label>
                                    Address Proof
                                </Label>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <label
                                        htmlFor="addressProof"
                                        className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose File
                                    </label>

                                    <input
                                        id="addressProof"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                addressProof:
                                                    e.target.files?.[0] || null,
                                            }));

                                            setErrors((prev) => ({
                                                ...prev,
                                                addressProof: "",
                                            }));
                                        }}
                                    />

                                    {formData.addressProof && (
                                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                            {formData.addressProof.name}
                                        </span>
                                    )}
                                </div>

                                {errors.addressProof && (
                                    <p className="text-sm text-destructive">
                                        {errors.addressProof}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Upload a valid address proof document.
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex justify-between">

                    {step > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                        >
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                        >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Application"}
                            </Button>

                            {existingApplication?.status === "DRAFT" && (
                                <Button
                                    type="button"
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Application;
