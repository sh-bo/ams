import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confirmation from '../Components/Confirmation';
import Modal from '../Components/Modal';

function AdminEmployee() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editEmployee, setEditEmployee] = useState(null);
    const [employeeData, setEmployeeData] = useState({
        employeeName: '',
        employeeTitle: '',
        employeePhone: '',
        employeeDepartment: '',
        employeeLocation: '',
        email: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [employeeId, setEmployeeId] = useState(null);

    const processEmployees = (data) => {
        let allEmployees = new Map();
    
        const processEmployee = (employee) => {
            if (typeof employee === 'object' && employee !== null && employee.employeeId) {
                allEmployees.set(employee.employeeId, {
                    ...employee,
                    assets: employee.assets || [],
                    vendors: employee.vendors || [],
                    assignedOrders: employee.assignedOrders || []
                });
            }
        };
    
        const processNestedStructures = (item) => {
            if (typeof item === 'object' && item !== null) {
                processEmployee(item);
    
                if (Array.isArray(item.vendors)) {
                    item.vendors.forEach(vendor => {
                        if (vendor.assignedEmployee) {
                            processEmployee(vendor.assignedEmployee);
                        }
                        if (Array.isArray(vendor.orders)) {
                            vendor.orders.forEach(order => {
                                if (order.assignedEmployee) {
                                    processEmployee(order.assignedEmployee);
                                }
                            });
                        }
                    });
                }
    
                if (Array.isArray(item.assets)) {
                    item.assets.forEach(asset => {
                        if (typeof asset.assignedTo === 'object') {
                            processEmployee(asset.assignedTo);
                        }
                    });
                }
    
                if (Array.isArray(item.assignedOrders)) {
                    item.assignedOrders.forEach(order => {
                        if (typeof order === 'object' && order.assignedEmployee) {
                            processEmployee(order.assignedEmployee);
                        }
                    });
                }
            }
        };
    
        data.forEach(processNestedStructures);
    
        return Array.from(allEmployees.values())
        .sort((a, b) => a.employeeId - b.employeeId);
    };

    const fetchEmployees = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/employeeData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const processedEmployees = processEmployees(response.data);
            setEmployees(processedEmployees);
            setFilteredEmployees(processedEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEditClick = (employee) => {
        setEditEmployee(employee);
        setEmployeeData({
            employeeName: employee.employeeName,
            employeeTitle: employee.employeeTitle,
            employeePhone: employee.employeePhone,
            employeeDepartment: employee.employeeDepartment,
            employeeLocation: employee.employeeLocation,
            email: employee.user.email
        });
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editEmployeeData/${editEmployee.employeeId}`,
                employeeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditEmployee(null);
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.employeeId === editEmployee.employeeId ? { ...employee, ...employeeData, user: { ...employee.user, email: employeeData.email } } : employee
                )
            );
            setFilteredEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.employeeId === editEmployee.employeeId ? { ...employee, ...employeeData, user: { ...employee.user, email: employeeData.email } } : employee
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleSearch = () => {
        setFilteredEmployees(
            employees.filter(
                (employee) =>
                    employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employeeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employeeDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employeeLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const handleDelete = (id) => {
        setEmployeeId(id);
        setModalAction('delete');
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';

        switch (modalAction) {
            case 'delete':
                url = `http://localhost:1000/api/v1/superAdmin/deleteEmployeeData/${employeeId}`;
                break;
            default:
                break;
        }

        try {
            await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.employeeId !== employeeId));
            setFilteredEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.employeeId !== employeeId));
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on employee:`, error);
        }
    };

    const handleModalClose = () => {
        setEditEmployee(null);
        setIsEditModalOpen(false);
    };

    const handleRefresh = () => {
        fetchEmployees();
    };

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">Employee Management</h1>
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
                            className="bg-zinc-800 text-white px-4 py-0.5 rounded-lg font-semibold mr-0"
                        >
                            Search
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
                        <th className="py-1 px-6 border-b font-light text-left text-white">EID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Name</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Title</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Phone</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Location</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Department</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Email</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Role</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Vendors</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Assets</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Orders</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee.employeeId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{employee.employeeId}</td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="text"
                                        value={employeeData.employeeName}
                                        onChange={(e) => setEmployeeData({ ...employeeData, employeeName: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.employeeName
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="text"
                                        value={employeeData.employeeTitle}
                                        onChange={(e) => setEmployeeData({ ...employeeData, employeeTitle: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.employeeTitle
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="text"
                                        value={employeeData.employeePhone}
                                        onChange={(e) => setEmployeeData({ ...employeeData, employeePhone: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.employeePhone
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="text"
                                        value={employeeData.employeeLocation}
                                        onChange={(e) => setEmployeeData({ ...employeeData, employeeLocation: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.employeeLocation
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="text"
                                        value={employeeData.employeeDepartment}
                                        onChange={(e) => setEmployeeData({ ...employeeData, employeeDepartment: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.employeeDepartment
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <input
                                        type="email"
                                        value={employeeData.email}
                                        onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    employee.user.email
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {employee.user.role}
                            </td>
                            <td className="py-1 px-4 text-center">
                                {employee.vendors.length}
                            </td>
                            <td className="py-1 px-4 text-center">
                                {employee.assets.length}
                            </td>
                            <td className="py-1 px-4 text-center">
                                {employee.assignedOrders.length}
                            </td>
                            <td className="py-1 px-4 text-left flex items-center space-x-2">
                                {editEmployee && editEmployee.employeeId === employee.employeeId ? (
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-500 text-white px-4 py-1 rounded-lg font-semibold"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(employee)}
                                            className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold mt-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.employeeId)}
                                            className="bg-transparent text-red-500 px-4 py-1 rounded-md flex items-center font-semibold mt-1"
                                        >
                                            Delete
                                        </button>
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
                title="Edit Employee"
            >
                <div className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={employeeData.employeeName}
                            onChange={(e) => setEmployeeData({ ...employeeData, employeeName: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={employeeData.employeeTitle}
                            onChange={(e) => setEmployeeData({ ...employeeData, employeeTitle: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            value={employeeData.employeePhone}
                            onChange={(e) => setEmployeeData({ ...employeeData, employeePhone: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={employeeData.employeeLocation}
                            onChange={(e) => setEmployeeData({ ...employeeData, employeeLocation: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            value={employeeData.employeeDepartment}
                            onChange={(e) => setEmployeeData({ ...employeeData, employeeDepartment: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={employeeData.email}
                            onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none bg-gray-100"
                            readOnly
                        />
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

export default AdminEmployee;
