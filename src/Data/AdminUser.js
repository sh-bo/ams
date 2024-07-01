import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confirmation from '../Components/Confirmation';
import Modal from '../Components/Modal';

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [userId, setUserId] = useState(null);

    const fetchUsers = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/userData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditUser(user);
        setEmail(user.email);
        setRole(user.role);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editUserData/${editUser.userId}`,
                { email, role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditUser(null);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === editUser.userId ? { ...user, email, role } : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === editUser.userId ? { ...user, email, role } : user
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleSearch = () => {
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const handleFilter = () => {
        if (filterRole === '') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter((user) => user.role === filterRole));
        }
    };

    const handleEnableDisable = (action, id) => {
        setUserId(id);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';

        switch (modalAction) {
            case 'disable':
                url = `http://localhost:1000/api/v1/superAdmin/disable/${userId}`;
                break;
            case 'enable':
                url = `http://localhost:1000/api/v1/superAdmin/enable/${userId}`;
                break;
            default:
                break;
        }

        try {
            await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === userId
                        ? { ...user, enabled: modalAction === 'enable' }
                        : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === userId
                        ? { ...user, enabled: modalAction === 'enable' }
                        : user
                )
            );
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on user:`, error);
        }
    };

    const handleModalClose = () => {
        setEditUser(null);
        setIsEditModalOpen(false);
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">User Management</h1>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-zinc-400 rounded-md p-0.5 mr-2 outline-none w-64 ring-1 pl-2 ring-inset ring-gray-200"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-zinc-800 text-white px-4 py-0.5 rounded-lg font-semibold mr-4"
                        >
                            Search
                        </button>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="border border-zinc-400 rounded-md p-0.5 mr-2 outline-none ring-1 ring-inset ring-gray-200"
                        >
                            <option value="">All Roles</option>
                            <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                            <option value="IT_ADMIN">IT_ADMIN</option>
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="VENDOR">VENDOR</option>
                        </select>
                        <button
                            onClick={handleFilter}
                            className="bg-zinc-800 text-white px-4 py-0.5 rounded-lg font-semibold"
                        >
                            Filter
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="bg-zinc-800 text-white px-4 py-0.5 rounded-lg font-semibold ml-4"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-zinc-800 border">
                    <tr>
                        <th className="py-1 px-6 border-b font-light text-left text-white">User ID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Email Address</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Role</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.userId} className="border-b">
                            <td className="py-1 px-12 text-left font-semibold">{user.userId}</td>
                            <td className="py-1 px-4 text-left">
                                {editUser && editUser.userId === user.userId ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td className="py-1 px-4">
                                {editUser && editUser.userId === user.userId ? (
                                    user.role === 'SUPER_ADMIN' || user.role === 'VENDOR' ? (
                                        <input
                                            type="text"
                                            value={role}
                                            disabled
                                            className="border rounded-md p-1 bg-gray-100"
                                        />
                                    ) : (
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="border rounded-md p-1 outline-none"
                                        >
                                            <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                                            <option value="IT_ADMIN">IT_ADMIN</option>
                                            <option value="EMPLOYEE">EMPLOYEE</option>
                                        </select>
                                    )
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td className="py-1 px-4 text-left flex items-center space-x-2">
                                {editUser && editUser.userId === user.userId ? (
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-500 text-white px-4 py-1 rounded-lg font-semibold"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <>
                                        {user.role !== 'SUPER_ADMIN' && (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold"
                                                >
                                                    Edit
                                                    </button>
                                            <button
                                                onClick={() => handleEnableDisable(user.enabled ? 'disable' : 'enable', user.userId)}
                                                className={`bg-transparent text-${user.enabled ? 'red' : 'green'}-500 px-4 py-1 rounded-md flex items-center font-semibold`}
                                            >
                                                {user.enabled ? 'Disable' : 'Enable'}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Modal
            isOpen={isEditModalOpen}
            onClose={handleModalClose}
            onConfirm={handleSave}
            title="Edit User"
        >
            <div className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-md p-1 w-full outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    {editUser && (editUser.role === 'SUPER_ADMIN' || editUser.role === 'VENDOR') ? (
                        <input
                            type="text"
                            value={role}
                            disabled
                            className="border rounded-md p-1 w-full bg-gray-100 outline-none" 
                        />
                    ) : (
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border rounded-md p-1 w-full outline-none"
                        >
                            <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                            <option value="IT_ADMIN">IT_ADMIN</option>
                            <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                    )}
                </div>
            </div>
        </Modal>
        <Confirmation
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmAction}
            action={modalAction}
        />
    </div>
);
}

export default AdminUser;