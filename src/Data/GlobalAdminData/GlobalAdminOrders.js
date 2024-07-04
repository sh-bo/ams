import React, { useState, useEffect } from 'react';
import axios from 'axios';

const processOrders = (vendors) => {
    let allOrders = [];
    vendors.forEach(vendor => {
        vendor.orders.forEach(order => {
            allOrders.push({
                orderId: order.orderId,
                orderDescription: order.orderDescription,
                orderDate: order.orderDate,
                orderBudget: order.orderBudget,
                orderQty: order.orderQty,
                orderStatus: order.orderStatus,
                vendorName: vendor.vendorName,
                assignedEmployee: order.assignedEmployee ? order.assignedEmployee.employeeName : 'Unassigned',
            });
        });
    });
    return allOrders.sort((a, b) => a.orderId - b.orderId);
};

function GlobalAdminOrders() {
    const [orders, setOrders] = useState([]);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('global_adminToken');

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:1000/api/v1/globalAdmin/getData/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const allOrders = processOrders(response.data.vendors || []);
            setOrders(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <h1 className="text-xl font-semibold mb-6">Assigned Orders</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-zinc-800 border">
                    <tr>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Order ID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Description</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Date</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Budget</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Quantity</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Status</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Vendor Name</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Assigned Employee</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{order.orderId}</td>
                            <td className="py-1 px-4 text-left">{order.orderDescription}</td>
                            <td className="py-1 px-4 text-left">{order.orderDate}</td>
                            <td className="py-1 px-4 text-left">{order.orderBudget}</td>
                            <td className="py-1 px-4 text-left">{order.orderQty}</td>
                            <td className="py-1 px-4 text-left">{order.orderStatus}</td>
                            <td className="py-1 px-4 text-left">{order.vendorName}</td>
                            <td className="py-1 px-4 text-left">{order.assignedEmployee}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GlobalAdminOrders;
