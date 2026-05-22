import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiArrowRight,
} from "react-icons/fi";
import loginBg from '../../assets/loginbackgroun.jpg';
import img1 from '../../assets/img/img-1.png';
import img2 from '../../assets/img/img-2.png';
import img3 from '../../assets/img/img-3.png';
import img4 from '../../assets/img/img-4.png';
import img5 from '../../assets/img/img-5.png';
import img6 from '../../assets/img/img-6.png';
import img7 from '../../assets/img/img-7.png';
import img8 from '../../assets/img/img-8.png';
import img9 from '../../assets/img/img-9.png';
import img10 from '../../assets/img/img-10.png';
import img11 from '../../assets/img/img-11.png';
import logo from '../../assets/img/Prevoyance-Logo--Blue 1.png';
import { loginUser } from "./services/auth.service";

function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleLogin = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response =
                await loginUser({
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
        <>
<div className="w-full lg:h-screen">
        <div className="flex flex-wrap h-full">
            {/* <!-- Left Side - Image Grid (hidden on mobile) --> */}
            <div className="hidden lg:flex lg:w-8/12 bg-[#EDF3FF] rounded-[20px] p-1 h-full">
                <div className="flex w-full h-full">
                    {/* <!-- Column 1 --> */}
                    <div className="w-2/12 pr-1 flex flex-col">
                        <div className="mt-[5px] flex-[177]">
                            <img src={img1} alt="" className="w-full h-full rounded-[20px_20px_20px_0px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img2} alt="" className="w-full h-full rounded-[0px_20px_20px_0px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img3} alt="" className="w-full h-full rounded-[0px_20px_20px_20px] object-cover" />
                        </div>
                    </div>
                    {/* <!-- Column 2 - Box + Images --> */}
                    <div className="w-4/12 pr-1 flex flex-col">
                        <div className="mt-[5px] flex-[288] bg-gradient-blue p-[30px] rounded-[20px] text-white">
                            <h4 className="font-raleway font-semibold text-[22px] leading-[40px] tracking-[0%]">Welcome To</h4>
                            <h3 className="font-raleway font-extrabold text-[36px] leading-[100%] tracking-[0%] align-middle">ProjectHub</h3>
                            <p className="font-poppins font-normal text-[14px] leading-[24px] tracking-[0%] mt-[10px]">Manage projects, collaborate with developers, track progress, and organize documents from one modern dashboard</p>
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img4} alt="" className="w-full h-full rounded-[20px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[183]">
                            <img src={img5} alt="" className="w-full h-full rounded-[20px_20px_0px_0px] object-cover" />
                        </div>
                    </div>
                    {/* <!-- Column 3 --> */}
                    <div className="w-4/12 pr-1 flex flex-col">
                        <div className="mt-[5px] flex-[65]">
                            <img src={img6} alt="" className="w-full h-full rounded-[0px_0px_20px_20px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img7} alt="" className="w-full h-full rounded-[20px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288] bg-gradient-blue p-[40px] rounded-[20px] text-white flex flex-col items-start justify-start text-center">
                            <h3 className="font-poppins font-bold text-[40px] leading-[100%] tracking-[0%]">120+</h3>
                            <p className="font-poppins font-medium text-[16px] leading-[100%] tracking-[0%]">Active Projects</p>
                            <br />
                            <br />
                            <h3 className="font-poppins font-bold text-[40px] leading-[100%] tracking-[0%]">50+</h3>
                            <p className="font-poppins font-medium text-[16px] leading-[100%] tracking-[0%]">Team Members</p>
                        </div>
                        <div className="mt-[5px] flex-[113]">
                            <img src={img8} alt="" className="w-full h-full rounded-[20px_20px_0px_0px] object-cover" />
                        </div>
                    </div>
                    {/* <!-- Column 4 --> */}
                    <div className="w-2/12 flex flex-col">
                        <div className="mt-[5px] flex-[178]">
                            <img src={img9} alt="" className="w-full h-full rounded-[0px_20px_0px_20px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img10} alt="" className="w-full h-full rounded-[20px_0px_0px_20px] object-cover" />
                        </div>
                        <div className="mt-[5px] flex-[288]">
                            <img src={img11} alt="" className="w-full h-full rounded-[20px_0px_20px_20px] object-cover" />
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Right Side --> */}
            <div className="w-full lg:w-4/12 bg-white min-h-screen lg:min-h-0 flex flex-col justify-center">
                <div className="px-6 pt-8 sm:p-[50px] sm:pb-0">
                    <div className="logo-login">
                        <img src={logo} alt="" className="w-[120px] h-[50px] sm:w-[160px] sm:h-[70px] mx-auto block" />
                    </div>
                </div>
                {/* Login Form */}
                <div className="px-6 sm:px-11 py-6 sm:py-8">

                    <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-[34px] font-bold text-[#0057ff]">
                        Sign In
                    </h2>

                    <p className="mb-5 sm:mb-8 text-center text-sm leading-6 sm:leading-7 text-gray-500">
                        Access your project,
                        collaborate with teams,
                        and manage everything from
                        one dashboard.
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleLogin}>

                        {/* EMAIL */}
                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiMail size={18} />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiLock size={18} />
                                </div>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* OPTIONS */}
                        <div className="mb-7 flex items-center justify-between text-[13px]">

                            <label className="flex items-center gap-2 text-gray-500">
                                <input type="checkbox" />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="font-medium text-[#0057ff]"
                            >
                                Forget Password?
                            </button>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0d63ff] to-[#003ecb] text-base font-semibold text-white transition-all duration-300 ${loading
                                    ? "cursor-not-allowed opacity-70"
                                    : "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,87,255,0.35)]"
                                }`}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}

                            {!loading && (
                                <FiArrowRight />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
     
        {/* <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 sm:px-5 py-6 sm:py-10"
            style={{
                backgroundImage: `
      linear-gradient(
        rgba(42,52,180,0.55),
        rgba(42,52,180,0.55)
      ),
      url(${loginBg})
    `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

            <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-lg:flex-col">

                <div className="relative w-1/2 bg-[rgba(18,28,140,0.92)] px-6 sm:px-10 py-8 sm:py-12 text-white backdrop-blur-xl max-lg:w-full max-lg:min-h-72 sm:max-lg:min-h-95">

                    <h4 className="mb-1 text-xl sm:text-[28px] font-medium">
                        Welcome To
                    </h4>

                    <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl font-bold text-[#7db4ff]">
                        ProjectHub
                    </h1>

                    <p className="mb-6 sm:mb-10 max-w-md text-sm sm:text-[15px] leading-6 sm:leading-8 text-[#dbe0ff]">
                        Manage projects, collaborate
                        with developers, track
                        progress, and organize
                        documents from one modern
                        dashboard.
                    </p>
                    <div className="flex gap-3 sm:gap-5">
                        <div className="w-28 sm:w-35 rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-5 backdrop-blur-xl">
                            <h2 className="mb-1 text-2xl sm:text-3xl font-bold">
                                120+
                            </h2>

                            <span className="text-[13px] text-[#d7dcff]">
                                Active Projects
                            </span>
                        </div>

                        <div className="w-28 sm:w-35 rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-5 backdrop-blur-xl">
                            <h2 className="mb-1 text-2xl sm:text-3xl font-bold">
                                50+
                            </h2>

                            <span className="text-[13px] text-[#d7dcff]">
                                Team Members
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:block absolute bottom-7 left-10 text-xs text-[#cfd3ff]">
                        Copyright © 2026
                        ProjectHub. All rights
                        reserved.
                    </div>
                </div>

                <div className="w-1/2 bg-white px-5 sm:px-11 py-6 sm:py-8 max-lg:w-full">

                    <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-[34px] font-bold text-[#0057ff]">
                        Sign In
                    </h2>

                    <p className="mb-5 sm:mb-8 text-center text-sm leading-6 sm:leading-7 text-gray-500">
                        Access your project,
                        collaborate with teams,
                        and manage everything from
                        one dashboard.
                    </p>
                    <form onSubmit={handleLogin}>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiMail size={18} />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiLock size={18} />
                                </div>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-7 flex items-center justify-between text-[13px]">

                            <label className="flex items-center gap-2 text-gray-500">
                                <input type="checkbox" />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="font-medium text-[#0057ff]"
                            >
                                Forget Password?
                            </button>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0d63ff] to-[#003ecb] text-base font-semibold text-white transition-all duration-300 ${loading
                                    ? "cursor-not-allowed opacity-70"
                                    : "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,87,255,0.35)]"
                                }`}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}

                            {!loading && (
                                <FiArrowRight />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div> */}
           </>
    );
}

export default Login;