import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../Assets/Logo.png';
import COVER_IMAGE from "../Assets/Login.jpg";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

function RegisterVendor() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [vendorCompany, setVendorCompany] = useState('');
    const [vendorPhone, setVendorPhone] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorRelation, setVendorRelation] = useState('IT Services'); // Default value set here
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email || !password || !vendorName || !vendorPhone || !vendorCompany || !vendorAddress || !vendorRelation) {
            setErrorMessage('Please fill in all the fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:1000/api/v1/auth/registerVendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    vendorName,
                    vendorCompany,
                    vendorPhone,
                    vendorAddress,
                    vendorRelation,
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

    const handleVendorRelationChange = (e) => {
        setVendorRelation(e.target.value);
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
                        Vendor Registration
                    </h1>
                    <p className="text-l text-slate-800 font-semibold">
                        Register to become a part of our community.
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
                        <h3 className="text-l font-semibold mb-2">Register Vendor</h3>
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
                                value={vendorName}
                                onChange={(e) => setVendorName(e.target.value)}
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
                                    className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center text-sm leading-5 outline-none"
                                >
                                    {passwordVisible ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500 outline-none" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500 outline-none" />
                                    )}
                                </button>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="98726-00926"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={vendorPhone}
                                    onChange={(e) => setVendorPhone(e.target.value)}
                                />

                            </div>
                            <div className='relative'>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Vendor Relation
                                </label>
                                <select
                                    value={vendorRelation}
                                    onChange={handleVendorRelationChange}
                                    className="block appearance-none w-full text-black py-1.5 pr-8 pl-3 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none rounded-md"
                                >
                                    <option value="IT Services">IT Services</option>
                                    <option value="Private">Private</option>
                                    <option value="Government">Government</option>
                                    <option value="Software">Software</option>
                                    <option value="Services">Services</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-7 text-slate-800">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M7 10l5 5 5-5H7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Google LLC"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={vendorCompany}
                                    onChange={(e) => setVendorCompany(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                                    Company Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="La Street, California"
                                    className="w-full text-black py-1.5 my-1 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                                    value={vendorAddress}
                                    onChange={(e) => setVendorAddress(e.target.value)}
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

export default RegisterVendor;
