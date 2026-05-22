import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { FiArrowLeft } from "react-icons/fi";
import { createManager } from "./api/managerApi";
import type { CreateManagerPayload } from "./types/manager.types";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

function AddManager() {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateManagerPayload>({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            empId: "",
            designation: "",
            role: "",
            mobileNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const preventCopyPaste = (
        e:
            | React.ClipboardEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            "clipboardData" in e ||
            ("ctrlKey" in e &&
                (e.key.toLowerCase() === "c" ||
                    e.key.toLowerCase() === "v" ||
                    e.key.toLowerCase() === "x"))
        ) {
            e.preventDefault();
        }
    };

    const onSubmit = async (data: CreateManagerPayload) => {
        try {
            await createManager({
                name: data.name,
                email: data.email,
                empId: data.empId,
                designation: data.designation,
                role: data.role,
                password: data.password,
                mobileNumber: data.mobileNumber,
            });

            showSuccessToast("Manager created successfully.");
            reset();
            navigate("/managers");
        } catch (error: any) {
            console.error(error);
            showErrorToast(
                error?.response?.data?.message ||
                "Failed to create manager. Please try again."
            );
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Add Manager</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Complete the manager details and save to add a new manager.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/managers")}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
                >
                    <FiArrowLeft /> <span className="hidden sm:inline">Back to Managers</span><span className="sm:hidden">Back</span>
                </button>
            </div>

            <form id="add-manager-form" onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Full Name *
                        </label>
                        <input
                            {...register("name", {
                                required: "Full name is required",
                                minLength: {
                                    value: 2,
                                    message: "Full name must be at least 2 characters",
                                },
                            })}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Email *
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="manager@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Employee ID *
                        </label>
                        <input
                            {...register("empId", {
                                required: "Employee ID is required",
                                minLength: {
                                    value: 2,
                                    message: "Employee ID must be at least 2 characters",
                                },
                            })}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="EMP001"
                        />
                        {errors.empId && (
                            <p className="mt-1 text-sm text-red-500">{errors.empId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Designation
                        </label>
                        <input
                            {...register("designation")}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Project Manager"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="role"
                            control={control}
                            defaultValue="Manager"
                            rules={{ required: "Role is required" }}
                            render={({ field }) => {
                                const options = [
                                    { value: "", label: "Select Role" },
                                    { value: "MANAGER", label: "Manager" },
                                    { value: "LEADERSHIP", label: "Leadership" },
                                ];

                                return (
                                    <Select
                                        {...field}
                                        value={options.find((option) => option.value === field.value) ?? options[0]}
                                        onChange={(option) => field.onChange(option?.value)}
                                        options={options}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: "0.75rem",
                                                borderColor: "#cbd5e1",
                                                minHeight: "3rem",
                                                boxShadow: "none",
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                borderRadius: "0.75rem",
                                            }),
                                        }}
                                    />
                                );
                            }}
                        />
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            {...register("mobileNumber", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: "Enter a valid mobile number",
                                },
                            })}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="9876543210"
                        />
                        {errors.mobileNumber && (
                            <p className="mt-1 text-sm text-red-500">{errors.mobileNumber.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Password *
                        </label>
                        <input
                            type="password"
                            form="add-manager-form"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            onCopy={preventCopyPaste}
                            onPaste={preventCopyPaste}
                            onCut={preventCopyPaste}
                            onKeyDown={preventCopyPaste}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            form="add-manager-form"
                            {...register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                            onCopy={preventCopyPaste}
                            onPaste={preventCopyPaste}
                            onCut={preventCopyPaste}
                            onKeyDown={preventCopyPaste}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Re-enter password"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/managers")}
                        className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Manager"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddManager;
