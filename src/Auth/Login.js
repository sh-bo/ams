import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import COVER_IMAGE from "../Assets/Login.jpg";
import LOGO from '../Assets/Logo.png';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("SUPER_ADMIN");
    const [calloutMessage, setCalloutMessage] = useState("");
    const [showCallout, setShowCallout] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [calloutType, setCalloutType] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("Please enter a valid email address.");
        }
        if (!password) {
            setPasswordError("Password field cannot be empty.");
        }
        if (!email || !password) {
            return;
        }

        try {
            const response = await fetch("http://localhost:1000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const tokenKey = role.toLowerCase() + "Token";
                localStorage.setItem(tokenKey, data.token);
                localStorage.setItem("role", role);
                localStorage.setItem("email", email);

                if (
                    (role === "SUPER_ADMIN" && data.role === "SUPER_ADMIN") ||
                    (role === "GLOBAL_ADMIN" && data.role === "GLOBAL_ADMIN") ||
                    (role === "IT_ADMIN" && data.role === "IT_ADMIN") ||
                    (role === "EMPLOYEE" && data.role === "EMPLOYEE") ||
                    (role === "VENDOR" && data.role === "VENDOR")
                ) {
                    setCalloutMessage("Login Successful.");
                    setCalloutType("success");
                    setShowCallout(true);

                    setTimeout(() => {
                        const redirectUrl =
                            role === "SUPER_ADMIN"
                                ? "/portal/superAdmin/dashboard"
                                : role === "GLOBAL_ADMIN"
                                    ? "/portal/globalAdmin/dashboard"
                                    : role === "IT_ADMIN"
                                        ? "/portal/itAdmin/dashboard"
                                        : role === "EMPLOYEE"
                                            ? "/portal/employee/dashboard"
                                            : "/portal/vendor/dashboard";
                        navigate(redirectUrl);
                    }, 1000);
                } else {
                    setCalloutMessage(
                        "Access Denied: You do not have the necessary permissions."
                    );
                    setCalloutType("error");
                    setShowCallout(true);
                }
            } else {
                setCalloutMessage("Login failed. Please check your credentials.");
                setCalloutType("error");
                setShowCallout(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setCalloutMessage(
                "An error occurred during login. Please try again later."
            );
            setCalloutType("error");
            setShowCallout(true);
        }
    };

    useEffect(() => {
        if (showCallout) {
            setFadeOut(false);
            const fadeTimer = setTimeout(() => setFadeOut(true), 4000);
            const hideTimer = setTimeout(() => setShowCallout(false), 5000);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [showCallout]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError("");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (passwordError) {
            setPasswordError("");
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="w-full h-screen flex items-start">
            {showCallout && (
                <div
                    className={`fixed top-0 left-1/2 right-0 ${calloutType === "success" ? "bg-green-500" : "bg-red-500"
                        } text-white text-center text-sm p-4 transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"
                        }`}
                >
                    {calloutType === "success"
                        ? `${calloutMessage} Redirecting to ${role} Portal...`
                        : calloutMessage}
                </div>
            )}
            <div className="relative w-1/2 h-full flex flex-col bg-purple-800">
                <div className="absolute top-[15%] left-[10%] flex flex-col">
                    <h1 className="text-xl text-slate-800 font-bold my-3">
                        {role} Portal
                    </h1>
                    <p className="text-l text-slate-800 font-semibold">
                        {role === "SUPER_ADMIN"
                            ? "Developing solutions for the coming future."
                            : role === "GLOBAL_ADMIN"
                                ? "Managing global administration tasks."
                                : role === "IT_ADMIN"
                                    ? "Overseeing IT infrastructure."
                                    : role === "EMPLOYEE"
                                        ? "Empowering our team for the future."
                                        : "Access our exclusive library of assets."}
                    </p>
                </div>
                <img
                    src={COVER_IMAGE}
                    alt="Login"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-1/2 h-full bg-white flex flex-col p-20 justify-between items-center">
                <img
                    className="mx-auto h-16 w-auto mb-2"
                    src={LOGO}
                    alt="Asset Platform"
                />
                <div className="w-full flex flex-col max-w-[500px]">
                    <div className="w-full flex flex-col mb-2">
                        <h3 className="text-l font-semibold mb-2">{role} Login</h3>
                        <p className="text-sm mb-2">
                            Welcome! Please enter your details to access your account.
                        </p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium leading-6 text-gray-900 mt-2"
                        >
                            Select Role
                        </label>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                className="block appearance-none w-full text-black py-1.5 pr-8 pl-3 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none rounded-md"
                            >
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                                <option value="IT_ADMIN">IT_ADMIN</option>
                                <option value="EMPLOYEE">EMPLOYEE</option>
                                <option value="VENDOR">VENDOR</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 mb-0.5 text-slate-800">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M7 10l5 5 5-5H7z" />
                                </svg>
                            </div>
                        </div>

                        <div className="w-full flex flex-col mb-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900 mt-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="john.doe@gmail.com"
                                className={`w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md ${emailError ? "border-red-500 ring-red-500" : ""
                                    }`}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-0">{emailError}</p>
                            )}
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900 mt-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    className={`w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md ${passwordError ? "border-red-500 ring-red-500" : ""
                                        }`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {passwordVisible ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-0">{passwordError}</p>
                            )}
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <div className="w-full flex items-center"></div>
                        </div>

                        <div className="w-full flex flex-col my-5">
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 rounded-md"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </div>
            </div>
        </div>
    );
}

export default Login;
