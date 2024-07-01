import { ArrowLeftIcon, CogIcon, IdentificationIcon, InboxIcon, ServerIcon, ShoppingCartIcon, TicketIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/solid";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from '../../Assets/Logo.png'

function SASidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("super_adminToken");
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
                    <h2 className="ml-4 mt-1 font-semibold text-xs">Super Admin Portal</h2>
                </div>
                <nav className="flex flex-col space-y-2">
                    <Link
                        to="/portal/superAdmin/dashboard"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/dashboard"
                        )}`}
                    >
                        <InboxIcon className="h-4 w-4 mr-3" />
                        Dashboard
                    </Link>
                    <Link
                        to="/portal/superAdmin/users"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/users"
                        )}`}
                    >
                        <IdentificationIcon className="h-4 w-4 mr-3" />
                        Users
                    </Link>
                    <Link
                        to="/portal/superAdmin/employees"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/employees"
                        )}`}
                    >
                        <UserGroupIcon className="h-4 w-4 mr-3" />
                        Employees
                    </Link>
                    <Link
                        to="/portal/superAdmin/vendors"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/vendors"
                        )}`}
                    >
                        <UsersIcon className="h-4 w-4 mr-3" />
                        Vendors
                    </Link>
                    <Link
                        to="/portal/superAdmin/assets"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/assets"
                        )}`}
                    >
                        <ServerIcon className="h-4 w-4 mr-3" />
                        Assets
                    </Link>
                    <Link
                        to="/portal/superAdmin/orders"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/orders"
                        )}`}
                    >
                        <ShoppingCartIcon className="h-4 w-4 mr-3" />
                        Orders
                    </Link>
                    <Link
                        to="/portal/superAdmin/requests"
                        className={`px-3 py-2 rounded-md text-xs font-lg flex items-center ${isActive(
                            "/portal/superAdmin/requests"
                        )}`}
                    >
                        <TicketIcon className="h-4 w-4 mr-3" />
                        Requests
                    </Link>
                </nav>
            </div>
            <div>
                <nav className="flex flex-col space-y-2">
                    <Link
                        to="/portal/superAdmin/settings"
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center ${isActive(
                            "/portal/superAdmin/settings"
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

export default SASidebar