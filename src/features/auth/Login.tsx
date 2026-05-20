import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiArrowRight,
} from "react-icons/fi";
import { loginUser } from "./services/auth.service";

function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] =
        useState("");



const handleLogin = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      "token",
      response.accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );
    

    navigate("/dashboard");
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="relative flex h-screen overflow-hidden bg-slate-950">
            {/* Left Section */}
            <div className="relative hidden w-1/2 overflow-hidden lg:flex">
                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-indigo-700 to-slate-900" />

                {/* Glow Effects */}
                <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-14 text-white">

                    <h1 className="text-5xl font-bold leading-tight tracking-tight whitespace-nowrap">
                        Welcome to Project Hub
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-slate-200">
                        Manage projects, collaborate with
                        developers, track progress, and
                        organize documents from one modern
                        dashboard.
                    </p>

                    {/* Stats */}
                    <div className="mt-8 flex gap-6">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
                            <h3 className="text-3xl font-bold">
                                120+
                            </h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Active Projects
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
                            <h3 className="text-3xl font-bold">
                                40+
                            </h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Team Members
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#020617] px-6 py-4 lg:w-1/2">

                {/* Background Glow */}
                <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />

                {/* Floating Shapes */}
                <div className="absolute left-20 top-24 h-24 w-24 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-xl animate-bounce" />

                <div className="relative z-10 w-full max-w-120">

                    {/* Mobile Logo */}
                    <div className="mb-10 flex justify-center lg:hidden">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-linear-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white shadow-[0_20px_60px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 hover:rotate-6">
                            P
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_100px_rgba(59,130,246,0.25)]">

                        {/* Card Glow */}
                        <div className="absolute inset-0 rounded-[36px] bg-linear-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Top Border Glow */}
                        <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-70" />

                        <div className="relative z-10">

                            {/* Header */}
                            <div className="mb-7">
                                <h2 className="bg-linear-to-r text-center from-white via-blue-100 to-slate-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent z-100 pb-2">
                                    Sign In
                                </h2>

                                <p className="mt-4 text-lg leading-relaxed text-slate-400">
                                    Access your projects, collaborate with teams, and manage everything from one dashboard.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >

                                {/* Email */}
                                <div>
                                    <label className="mb-3 block text-sm font-semibold tracking-wide text-slate-300">
                                        Email Address
                                    </label>

                                    <div className="group relative">
                                        {/* Icon */}
                                        <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500 transition-all duration-300 group-focus-within:text-blue-400">
                                            <FiMail size={20} />
                                        </div>

                                        {/* Input */}
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="h-16 w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 pl-16 pr-5 text-[15px] text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 hover:border-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="mb-3 block text-sm font-semibold tracking-wide text-slate-300">
                                        Password
                                    </label>

                                    <div className="group/input relative">

                                        <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-blue-400">
                                            <FiLock size={20} />
                                        </div>

                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="h-16 w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 pl-16 pr-5 text-[15px] text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 hover:border-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Remember */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
                                        />
                                        Remember me
                                    </label>

                                    <button
                                        type="button"
                                        className="text-sm font-semibold text-blue-400 transition-all hover:text-blue-300 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="group/button relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-lg font-bold text-white shadow-[0_10px_40px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(79,70,229,0.55)] active:scale-[0.99]"
                                >

                                    {/* Animated Glow */}
                                    <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-all duration-700 group-hover/button:translate-x-full group-hover/button:opacity-100" />

                                    <span className="relative z-10 flex items-center gap-3">
                                        {loading
                                            ? "Signing In..."
                                            : "Sign In"}

                                        {!loading && (
                                            <FiArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
                                        )}
                                    </span>
                                </button>
                                {
                                    error && (
                                        <div className="text-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                            {error}
                                        </div>
                                    )
                                }
                            </form>

                            {/* Footer */}
                            <div className="mt-10 border-t border-white/10 pt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    © 2026 Project Hub Platform
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;