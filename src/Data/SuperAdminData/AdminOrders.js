import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../Components/Modal';
import Confirmation from '../../Components/Confirmation';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [editOrder, setEditOrder] = useState(null);
    const [orderData, setOrderData] = useState({
        orderDescription: '',
        orderDate: '',
        orderBudget: '',
        orderQty: '',
        orderStatus: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/orderData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const processedOrders = processOrders(response.data);
            setOrders(processedOrders);
            setFilteredOrders(processedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
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
            setEmployees(response.data.filter(emp => emp.user.role === 'EMPLOYEE'));
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchEmployees();
    }, []);

    const processOrders = (data) => {
        let allOrders = [];
        data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                if (item.orderId) {
                    allOrders.push(item);
                }
                if (item.vendor && Array.isArray(item.vendor.orders)) {
                    item.vendor.orders.forEach(order => {
                        if (typeof order === 'object' && order.orderId) {
                            allOrders.push(order);
                        } else if (typeof order === 'number') {
                            const existingOrder = allOrders.find(o => o.orderId === order);
                            if (!existingOrder) {
                                allOrders.push({ orderId: order });
                            }
                        }
                    });
                }
            } else if (typeof item === 'number') {
                const existingOrder = allOrders.find(o => o.orderId === item);
                if (!existingOrder) {
                    allOrders.push({ orderId: item });
                }
            }
        });
        return allOrders.sort((a, b) => a.orderId - b.orderId);
    };

    const handleEditClick = (order) => {
        setEditOrder(order);
        setOrderData({
            orderDescription: order.orderDescription,
            orderDate: order.orderDate,
            orderBudget: order.orderBudget,
            orderQty: order.orderQty,
            orderStatus: order.orderStatus
        });
        setIsEditModalOpen(true);
    };

    const handleDeAssign = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.post(
                `http://localhost:1000/api/v1/superAdmin/deAssignOrder/${orderId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId
                    ? { ...order, assignedEmployee: null }
                    : order
            ));
            setIsAssignModalOpen(false);
            fetchOrders();
        } catch (error) {
            console.error('Error de-assigning order:', error);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editOrderData/${editOrder.orderId}`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditOrder(null);
            const updatedOrders = orders.map((order) =>
                order.orderId === editOrder.orderId ? { ...order, ...orderData } : order
            );
            setOrders(updatedOrders);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleDelete = (id) => {
        setOrderId(id);
        setModalAction('delete');
        setIsModalOpen(true);
    };

    const handleAssign = (id) => {
        setOrderId(id);
        setEmployeeId(''); 
        setModalAction('assign');
        setIsAssignModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';

        switch (modalAction) {
            case 'delete':
                url = `http://localhost:1000/api/v1/superAdmin/deleteOrderData/${orderId}`;
                break;
            case 'assign':
                url = `http://localhost:1000/api/v1/superAdmin/assignOrder/${orderId}/to/${employeeId}`;
                break;
            default:
                break;
        }

        try {
            if (modalAction === 'assign') {
                await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
                setOrders(prevOrders => prevOrders.map(order =>
                    order.orderId === orderId
                        ? { ...order, assignedEmployee: employees.find(emp => emp.employeeId === parseInt(employeeId)) }
                        : order
                ));
            } else {
                await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
            }
            setIsModalOpen(false);
            setIsAssignModalOpen(false);
            fetchOrders();
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on order:`, error);
        }
    };

    const handleModalClose = () => {
        setEditOrder(null);
        setIsEditModalOpen(false);
        setIsModalOpen(false);
        setIsAssignModalOpen(false);
    };

    const handleSearch = () => {
        setFilteredOrders(
            orders.filter((order) => {
                const searchTermLower = searchTerm.toLowerCase();
                return (
                    order.orderDescription.toLowerCase().includes(searchTermLower) ||
                    order.orderDate.toLowerCase().includes(searchTermLower) ||
                    order.orderBudget.toString().toLowerCase().includes(searchTermLower) ||
                    order.orderQty.toString().toLowerCase().includes(searchTermLower) ||
                    order.orderStatus.toLowerCase().includes(searchTermLower)
                );
            })
        );
    };

    const handleRefresh = () => {
        fetchOrders();
    };


    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">Order Management</h1>
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
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order ID</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order Description</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order Date</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order Budget</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order Quantity</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Order Status</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Assigned To</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="border-b">
                            <td className="py-2 px-12 border-b font-semibold">{order.orderId}</td>
                            <td className="py-2 px-6 border-b">{order.orderDescription}</td>
                            <td className="py-2 px-6 border-b">{order.orderDate}</td>
                            <td className="py-2 px-6 border-b">{order.orderBudget?.toString() || 'NA'}</td>
                            <td className="py-2 px-6 border-b">{order.orderQty?.toString() || 'NA'}</td>
                            <td className="py-2 px-6 border-b">{order.orderStatus}</td>
                            <td className="py-1 px-6 text-left">
                                {order.assignedEmployee ?
                                    (typeof order.assignedEmployee === 'object' ?
                                        order.assignedEmployee.employeeName :
                                        employees.find(emp => emp.employeeId === order.assignedEmployee)?.employeeName || `Employee ID: ${order.assignedEmployee}`
                                    ) :
                                    'Not Assigned'
                                }
                            </td>
                            <td className="py-1 px-6 text-left flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditClick(order)}
                                    className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold mt-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(order.orderId)}
                                    className="bg-transparent text-red-500 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleAssign(order.orderId)}
                                    className="bg-transparent text-slate-900 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Assign
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleSave}
                    title="Edit Order">
                    <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
                    <div>
                        <label className="block mb-2">Description:</label>
                        <input
                            type="text"
                            value={orderData.orderDescription}
                            onChange={(e) => setOrderData({ ...orderData, orderDescription: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Date:</label>
                        <input
                            type="text"
                            value={orderData.orderDate}
                            onChange={(e) => setOrderData({ ...orderData, orderDate: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Budget:</label>
                        <input
                            type="text"
                            value={orderData.orderBudget}
                            onChange={(e) => setOrderData({ ...orderData, orderBudget: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Quantity:</label>
                        <input
                            type="text"
                            value={orderData.orderQty}
                            onChange={(e) => setOrderData({ ...orderData, orderQty: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Status:</label>
                        <select
                            value={orderData.orderStatus}
                            onChange={(e) => setOrderData({ ...orderData, orderStatus: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        >
                            <option value="IN_REVIEW">In Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </Modal>
            )}

{isAssignModalOpen && (
    <Modal
        isOpen={isAssignModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmAction}
        title="Assignment of Order"
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

            {isModalOpen && (
                <Confirmation
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmAction}
                    title={`Confirm ${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}`}
                >
                    {`Are you sure you want to ${modalAction} this order?`}
                </Confirmation>
            )}
        </div>
    );
}

export default AdminOrders;
