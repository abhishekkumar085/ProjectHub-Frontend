import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { createManager, updateManager } from "./api/managerApi";
import type { CreateManagerPayload, Manager } from "./types/manager.types";

interface Props {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    manager?: Manager | null;
}

function ManagerFormModal({
    open,
    onClose,
    refresh,
    manager,
}: Props) {
    const isEditing = !!manager;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } =
        useForm<CreateManagerPayload>({
            defaultValues: {
                name: "",
                email: "",
                empId: "",
                designation: "",
                password: "",
                confirmPassword: "",

            },
        });

    useEffect(() => {
        if (manager) {
            reset({
                name: manager.name,
                email: manager.email,
                empId: manager.empId,
                designation: manager.designation,
            });
        } else {
            reset();
        }
    }, [manager, reset]);

     const password = watch("password");

    const preventCopyPaste = (
        e:
            | React.ClipboardEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        // prevent copy/paste/cut
        if (
            "clipboardData" in e ||
            ("ctrlKey" in e &&
                (e.key.toLowerCase() === "c" ||
                    e.key.toLowerCase() ===
                        "v" ||
                    e.key.toLowerCase() ===
                        "x"))
        ) {
            e.preventDefault();
        }
    };

   const onSubmit = async (
        data: CreateManagerPayload
    ) => {
        try {
            const payload: CreateManagerPayload =
                {
                    name: data.name,
                    email: data.email,
                    empId:
                        data.empId,
                    designation:
                        data.designation,
                    password: data.password,
                };

            if (isEditing && manager) {
                await updateManager(
                    manager.id,
                    payload
                );
            } else {
                await createManager(
                    payload
                );
            }

            refresh();

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {isEditing
                            ? "Edit Manager"
                            : "Create Manager"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="p-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Full Name *
                            </label>

                            <input
                                {...register(
                                    "name",
                                    {
                                        required: true,
                                    }
                                )}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="John Doe"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    Full name is
                                    required
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Email *
                            </label>

                            <input
                                type="email"
                                {...register("email", {
                                    required: true,
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="manager@example.com"
                            />
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Employee ID *
                            </label>

                            <input
                                {...register(
                                    "empId",
                                    {
                                        required: true,
                                    }
                                )}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="EMP001"
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Designation
                            </label>

                            <input
                                {...register(
                                    "designation"
                                )}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Project Manager"
                            />
                        </div>
                        {/* Password */}
                        {!isEditing && (
                            <>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-600">
                                    Password *
                                </label>

                                <input
                                    type="password"
                                    {...register(
                                        "password",
                                        {
                                            required: true,
                                        }
                                    )}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                    placeholder="********"
                                />
                            </div>
                      
                         {/* Confirm Password */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                                        Confirm Password *
                                    </label>

                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        onCopy={
                                            preventCopyPaste
                                        }
                                        onPaste={
                                            preventCopyPaste
                                        }
                                        onCut={
                                            preventCopyPaste
                                        }
                                        onKeyDown={
                                            preventCopyPaste
                                        }
                                        {...register(
                                            "confirmPassword",
                                            {
                                                required:
                                                    "Confirm password is required",
                                                validate:
                                                    (
                                                        value
                                                    ) =>
                                                        value ===
                                                            password ||
                                                        "Passwords do not match",
                                            }
                                        )}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                        placeholder="********"
                                    />

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                errors
                                                    .confirmPassword
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Create Manager"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManagerFormModal;