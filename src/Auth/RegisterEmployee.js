import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../Assets/Logo.png';
import COVER_IMAGE from "../Assets/Login.jpg";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

function RegisterEmployee() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeTitle, setEmployeeTitle] = useState('');
    const [employeePhone, setEmployeePhone] = useState('');
    const [employeeDepartment, setEmployeeDepartment] = useState('');
    const [employeeLocation, setEmployeeLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email || !password || !employeeName || !employeeTitle || !employeePhone || !employeeDepartment || !employeeLocation) {
            setErrorMessage('Please fill in all the fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:1000/api/v1/auth/registerEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    employeeName,
                    employeeTitle,
                    employeePhone,
                    employeeDepartment,
                    employeeLocation,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Registration successful. Redirecting to login page...');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 1000);
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred during registration. Please try again later.');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="w-full h-screen flex items-start">
            {successMessage && (
                <div className="fixed top-0 left-1/2 right-0 bg-green-500 text-white text-center text-sm p-4">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="fixed top-0 left-1/2 right-0 bg-red-500 text-white text-center text-sm p-4">
                    {errorMessage}
                </div>
            )}
            <div className="relative w-1/2 h-full flex flex-col bg-purple-800">
                <div className="absolute top-[15%] left-[10%] flex flex-col">
                    <h1 className="text-xl text-slate-800 font-bold my-3">
                        Employee Registration
                    </h1>
                    <p className="text-l text-slate-800 font-semibold">
                        Register to become a part of our team.
                    </p>
                </div>
                <img
                    src={COVER_IMAGE}
                    alt="Register"
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
                        <h3 className="text-l font-semibold mb-2">Register Employee</h3>
                        <p className="text-sm mb-2">
                            Please fill in the details to create an account.
                        </p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="w-full">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="john.doe@gmail.com"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Password
                                </label>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center text-sm leading-5"
                                >
                                    {passwordVisible ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Software Engineer"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={employeeTitle}
                                    onChange={(e) => setEmployeeTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="98726-00926"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={employeePhone}
                                    onChange={(e) => setEmployeePhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    placeholder="IT"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={employeeDepartment}
                                    onChange={(e) => setEmployeeDepartment(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="India"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={employeeLocation}
                                    onChange={(e) => setEmployeeLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col my-5">
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 rounded-md"
                            >
                                Register
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

export default RegisterEmployee;
