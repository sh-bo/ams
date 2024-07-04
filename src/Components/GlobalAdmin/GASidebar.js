import { ArrowLeftIcon, CogIcon, IdentificationIcon, InboxIcon, ShoppingCartIcon, TicketIcon, UserAddIcon, UsersIcon } from "@heroicons/react/solid";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from '../../Assets/Logo.png'

function GASidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("global_adminToken");
        localStorage.removeItem("email");
        navigate("/auth/login");
    };

    const isActive = (path) =>
        location.pathname === path
            ? "bg-zinc-800 text-white"
            : "text-gray-200 hover:bg-zinc-800 hover:text-white";

    return (
        <div className="h-screen flex flex-col justify-between bg-zinc-950 text-white w-56 p-6">
            <div>
                <div className="flex items-center justify-center mb-10">
                    <img
                        className="h-10 w-auto filter invert"
                        src={LOGO}
                        alt="Logo"
                    />
                    <h2 className="ml-4 mt-1 font-semibold text-xs">Global Admin Portal</h2>
                </div>
                <nav className="flex flex-col space-y-2">
                    <Link
                        to="/portal/globalAdmin/dashboard"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/dashboard"
                        )}`}
                    >
                        <InboxIcon className="h-4 w-4 mr-3" />
                        Dashboard
                    </Link>
                    <Link
                        to="/portal/globalAdmin/vendors"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/vendors"
                        )}`}
                    >
                        <IdentificationIcon className="h-4 w-4 mr-3" />
                        Assigned Vendors
                    </Link>
                    <Link
                        to="/portal/globalAdmin/orders"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/orders"
                        )}`}
                    >
                        <ShoppingCartIcon className="h-4 w-4 mr-3" />
                        Assigned Orders
                    </Link>
                    <Link
                        to="/portal/globalAdmin/employees"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/employees"
                        )}`}
                    >
                        <UsersIcon className="h-4 w-4 mr-3" />
                        Employees
                    </Link>
                    <Link
                        to="/portal/globalAdmin/addEmployee"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/addEmployee"
                        )}`}
                    >
                        <UserAddIcon className="h-4 w-4 mr-3" />
                        Register Employee
                    </Link>
                    <Link
                        to="/portal/globalAdmin/requests"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/globalAdmin/requests"
                        )}`}
                    >
                        <TicketIcon className="h-4 w-4 mr-3" />
                        Assigned Requests
                    </Link>
                </nav>
            </div>
            <div>
                <nav className="flex flex-col space-y-2">
                    <Link
                        to="/portal/globalAdmin/settings"
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center ${isActive(
                            "/portal/globalAdmin/settings"
                        )}`}
                    >
                        <CogIcon className="h-4 w-4 mr-3" />
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-300 bg-rose-700 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Logout
                    </button>
                </nav>
            </div>
        </div>
    )
}

export default GASidebar