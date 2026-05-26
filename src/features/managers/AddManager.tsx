import { useNavigate, Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
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
      | React.KeyboardEvent<HTMLInputElement>,
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
          "Failed to create manager. Please try again.",
      );
    }
  };

  return (
    <div className="w-full ">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-sm font-[Poppins] mb-2">
        <Link to="/" className="text-[#0059FF] hover:underline">
          Home
        </Link>
        <FiChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-500">Users</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
        <div>
          <h1 className="font-[Poppins] text-[20px] font-semibold leading-[100%] tracking-[0px] text-[#00076F]">
            Add Users
          </h1>
        </div>

        <button
          onClick={() => navigate("/managers")}
          className="inline-flex items-center gap-2 px-4 py-2 font-[Poppins] font-medium text-[14px] leading-[120%] tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <form
        id="add-manager-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4"
      >
        {/* Card */}
        <div className="w-full p-4 sm:p-5 lg:p-6 space-y-4 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
          <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#161616] mb-2">
            Basic Information
          </h1>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-3">
            {/* Full Name */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Email <span className="text-red-500">*</span>
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
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="manager@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                {...register("empId", {
                  required: "Employee ID is required",
                  minLength: {
                    value: 2,
                    message: "Employee ID must be at least 2 characters",
                  },
                })}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="EMP001"
              />
              {errors.empId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.empId.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Designation
              </label>
              <input
                {...register("designation")}
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Project Manager"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
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
                      value={
                        options.find(
                          (option) => option.value === field.value,
                        ) ?? options[0]
                      }
                      onChange={(option) => field.onChange(option?.value)}
                      options={options}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "100%",
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
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
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="9876543210"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Password <span className="text-red-500">*</span>
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
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#444444]">
                Confirm Password <span className="text-red-500">*</span>
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
                className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/managers")}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-[135px] h-[45px] rounded-[8px] border
        bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)]
        px-6 py-3 font-[Poppins] font-medium text-[14px]
        leading-[100%] tracking-[0px] text-center text-white
        transition hover:opacity-90
        disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddManager;
