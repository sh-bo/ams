import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confirmation from '../../Components/Confirmation';
import Modal from '../../Components/Modal';

function AdminVendor() {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [editVendor, setEditVendor] = useState(null);
    const [vendorData, setVendorData] = useState({
        vendorName: '',
        vendorCompany: '',
        vendorAddress: '',
        vendorPhone: '',
        vendorRelation: '',
        email: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [vendorId, setVendorId] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);

    const processVendors = (data) => {
        let allVendors = new Map();

        const processVendor = (vendor) => {
            if (typeof vendor === 'object' && vendor !== null && vendor.vendorId) {
                let processedVendor = {
                    ...vendor,
                    orders: vendor.orders || [],
                    requests: vendor.requests || [],
                    assignedTo: null
                };

                if (typeof vendor.assignedEmployee === 'object' && vendor.assignedEmployee !== null) {
                    processedVendor.assignedTo = {
                        employeeId: vendor.assignedEmployee.employeeId,
                        employeeName: vendor.assignedEmployee.employeeName,
                        employeeTitle: vendor.assignedEmployee.employeeTitle
                    };
                } else if (typeof vendor.assignedEmployee === 'number') {
                    let employee = data.find(item => item.assignedEmployee && item.assignedEmployee.employeeId === vendor.assignedEmployee);
                    if (employee && employee.assignedEmployee) {
                        processedVendor.assignedTo = {
                            employeeId: employee.assignedEmployee.employeeId,
                            employeeName: employee.assignedEmployee.employeeName,
                            employeeTitle: employee.assignedEmployee.employeeTitle
                        };
                    } else {
                        processedVendor.assignedTo = { employeeId: vendor.assignedEmployee };
                    }
                }

                allVendors.set(vendor.vendorId, processedVendor);
            }
        };

        const processNestedStructures = (item) => {
            if (typeof item === 'object' && item !== null) {
                if (item.vendorId) {
                    processVendor(item);
                }

                if (Array.isArray(item)) {
                    item.forEach(subItem => {
                        if (typeof subItem === 'object' && subItem !== null) {
                            processVendor(subItem);
                        }
                    });
                }

                Object.values(item).forEach(value => {
                    if (typeof value === 'object' && value !== null) {
                        processNestedStructures(value);
                    }
                });
            }
        };

        data.forEach(processNestedStructures);

        return Array.from(allVendors.values())
            .sort((a, b) => a.vendorId - b.vendorId);
    };


    const fetchVendors = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/vendorData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const processedVendors = processVendors(response.data);
            setVendors(processedVendors);
            setFilteredVendors(processedVendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const fetchEmployees = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/employeeData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data.filter(emp => emp.user.role === 'GLOBAL_ADMIN'));
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
        fetchEmployees();
    }, []);

    const handleEditClick = (vendor) => {
        setEditVendor(vendor);
        setVendorData({
            vendorName: vendor.vendorName,
            vendorCompany: vendor.vendorCompany,
            vendorAddress: vendor.vendorAddress,
            vendorPhone: vendor.vendorPhone,
            vendorRelation: vendor.vendorRelation,
            email: vendor.user.email
        });
        setIsEditModalOpen(true);
    };

    const handleDeAssign = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.post(
                `http://localhost:1000/api/v1/superAdmin/deAssignVendor/${vendorId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVendors(prevVendors => prevVendors.map(vendor =>
                vendor.vendorId === vendorId
                    ? { ...vendor, assignedEmployee: null }
                    : vendor
            ));
            setIsAssignModalOpen(false);
            fetchVendors();
        } catch (error) {
            console.error('Error de-assigning asset:', error);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editVendorData/${editVendor.vendorId}`,
                vendorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditVendor(null);
            setVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor.vendorId === editVendor.vendorId ? { ...vendor, ...vendorData, user: { ...vendor.user, email: vendorData.email } } : vendor
                )
            );
            setFilteredVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor.vendorId === editVendor.vendorId ? { ...vendor, ...vendorData, user: { ...vendor.user, email: vendorData.email } } : vendor
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating vendor:', error);
        }
    };

    const handleSearch = () => {
        setFilteredVendors(
            vendors.filter(
                (vendor) =>
                    vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.vendorCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.vendorAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.vendorRelation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const handleDelete = (id) => {
        setVendorId(id);
        setModalAction('delete');
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';
    
        switch (modalAction) {
            case 'delete':
                url = `http://localhost:1000/api/v1/superAdmin/deleteVendorData/${vendorId}`;
                break;
            case 'assign':
                url = `http://localhost:1000/api/v1/superAdmin/assignVendor/${vendorId}/to/${employeeId}`;
                break;
            default:
                break;
        }
    
        try {
            if (modalAction === 'assign') {
                await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
                setVendors(prevVendors =>
                    prevVendors.map(vendor =>
                        vendor.vendorId === vendorId
                            ? { ...vendor, assignedTo: employees.find(emp => emp.employeeId === parseInt(employeeId)) }
                            : vendor
                    )
                );
            } else {
                await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
                setVendors(prevVendors => prevVendors.filter(vendor => vendor.vendorId !== vendorId));
                setFilteredVendors(prevVendors => prevVendors.filter(vendor => vendor.vendorId !== vendorId));
            }
            setIsModalOpen(false);
            setIsAssignModalOpen(false);
            fetchVendors();
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on vendor:`, error);
        }
    };
    

    const handleModalClose = () => {
        setEditVendor(null);
        setIsEditModalOpen(false);
        setIsModalOpen(false);
        setIsAssignModalOpen(false);
    };

    const handleAssign = (id) => {
        setVendorId(id);
        setEmployeeId('');
        setModalAction('assign');
        setIsAssignModalOpen(true);
    };

    const handleRefresh = () => {
        fetchVendors();
    };

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">Vendor Management</h1>
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
                        <th className="py-1 px-6 border-b font-light text-left text-white">VID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Name</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Phone</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Company</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Relation</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Address</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Assigned To</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Orders</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Requests</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVendors.map((vendor) => (
                        <tr key={vendor.vendorId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{vendor.vendorId}</td>
                            <td className="py-1 px-4 text-left">
                                {editVendor && editVendor.vendorId === vendor.vendorId ? (
                                    <input
                                        type="text"
                                        value={vendorData.vendorName}
                                        onChange={(e) => setVendorData({ ...vendorData, vendorName: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    vendor.vendorName
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editVendor && editVendor.vendorId === vendor.vendorId ? (
                                    <input
                                        type="text"
                                        value={vendorData.vendorPhone}
                                        onChange={(e) => setVendorData({ ...vendorData, vendorPhone: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    vendor.vendorPhone
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editVendor && editVendor.vendorId === vendor.vendorId ? (
                                    <input
                                        type="text"
                                        value={vendorData.vendorCompany}
                                        onChange={(e) => setVendorData({ ...vendorData, vendorCompany: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    vendor.vendorCompany
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editVendor && editVendor.vendorId === vendor.vendorId ? (
                                    <input
                                        type="text"
                                        value={vendorData.vendorRelation}
                                        onChange={(e) => setVendorData({ ...vendorData, vendorRelation: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    vendor.vendorRelation
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {editVendor && editVendor.vendorId === vendor.vendorId ? (
                                    <input
                                        type="text"
                                        value={vendorData.vendorAddress}
                                        onChange={(e) => setVendorData({ ...vendorData, vendorAddress: e.target.value })}
                                        className="border rounded-md p-1"
                                    />
                                ) : (
                                    vendor.vendorAddress
                                )}
                            </td>
                            <td className="py-1 px-4 text-left">
                                {vendor.assignedTo && vendor.assignedTo.employeeName
                                    ? vendor.assignedTo.employeeName
                                    : 'Not Assigned'}
                            </td>
                            <td className="py-1 px-8 text-left">{vendor.orders?.length || 0}</td>
                            <td className="py-1 px-8 text-left">{vendor.requests?.length || 0}</td>
                            <td className="py-1 px-4 text-left flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditClick(vendor)}
                                    className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(vendor.vendorId)}
                                    className="bg-transparent text-red-500 px-4 py-1 rounded-md flex items-center font-semibold"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleAssign(vendor.vendorId)}
                                    className="bg-transparent text-slate-900 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Assign
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleModalClose}
                onConfirm={handleSave}
                title={"Edit Vendor"}
            >
                <div className='flex flex-col space-y-4'>
                    <div className="mb-2">
                        <label className="block text-sm">Name</label>
                        <input
                            type="text"
                            value={vendorData.vendorName}
                            onChange={(e) => setVendorData({ ...vendorData, vendorName: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Company</label>
                        <input
                            type="text"
                            value={vendorData.vendorCompany}
                            onChange={(e) => setVendorData({ ...vendorData, vendorCompany: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Address</label>
                        <input
                            type="text"
                            value={vendorData.vendorAddress}
                            onChange={(e) => setVendorData({ ...vendorData, vendorAddress: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Phone</label>
                        <input
                            type="text"
                            value={vendorData.vendorPhone}
                            onChange={(e) => setVendorData({ ...vendorData, vendorPhone: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Relation</label>
                        <input
                            type="text"
                            value={vendorData.vendorRelation}
                            onChange={(e) => setVendorData({ ...vendorData, vendorRelation: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Email</label>
                        <input
                            type="text"
                            value={vendorData.email}
                            onChange={(e) => setVendorData({ ...vendorData, email: e.target.value })}
                            className="border rounded-md p-1 w-full bg-gray-100 outline-none"
                            readOnly
                        />
                    </div>
                </div>
            </Modal>
            {isAssignModalOpen && (
                <Modal
                    isOpen={isAssignModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleConfirmAction}
                    title="Assignment of Vendor"
                >
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Employee
                            </label>
                            <select
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="border rounded-md p-1 w-full outline-none"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.employeeId} value={employee.employeeId}>
                                        {employee.user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleDeAssign}
                                className="bg-transparent text-red-600 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                            >
                                Remove Assign
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            <Confirmation
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAction}
                action={modalAction}
            />
        </div>
    );
}

export default AdminVendor;
