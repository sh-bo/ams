import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TiTicket } from 'react-icons/ti';
import { CgShoppingCart } from 'react-icons/cg';
import { FaUserFriends } from 'react-icons/fa';

function GlobalAdminDashboards() {
  const [stats, setStats] = useState({
    assignedVendors: 0,
    totalOrders: 0,
    assignedRequests: 0,
  });

  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('global_adminToken');

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(`http://localhost:1000/api/v1/globalAdmin/getData/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const totalOrders = response.data.vendors.reduce((total, vendor) => total + vendor.orders.length, 0);
          
          setStats({
            assignedVendors: response.data.vendors.length,
            totalOrders: totalOrders,
            assignedRequests: response.data.vendors.reduce((total, vendor) => total + vendor.requests.length, 0),
          });

          const processedOrders = processOrders(response.data.vendors);
          setOrders(processedOrders.slice(0, 6)); // Display only the first 6 orders
        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
    };

    fetchData();
  }, [email, token]);

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

  return (
    <div className="p-6 bg-neutral-200 min-h-full">
      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <FaUserFriends className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Assigned Vendors</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.assignedVendors}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <CgShoppingCart className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Orders</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.totalOrders}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <TiTicket className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Assigned Requests</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.assignedRequests}</p>
        </div>
      </div>
      <div>
        <h2 className='text-lg font-semibold mb-2'>Recent Orders</h2>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-zinc-800 border">
          <tr>
            <th className="py-2 px-4 border-b font-light text-left text-white">Order ID</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Description</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Date</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Budget</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Quantity</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Status</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Vendor Name</th>
            <th className="py-2 px-4 border-b font-light text-left text-white">Assigned Employee</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b">
              <td className="py-2 px-4 border-b">{order.orderId}</td>
              <td className="py-2 px-4 border-b">{order.orderDescription}</td>
              <td className="py-2 px-4 border-b">{order.orderDate}</td>
              <td className="py-2 px-4 border-b">{order.orderBudget}</td>
              <td className="py-2 px-4 border-b">{order.orderQty}</td>
              <td className="py-2 px-4 border-b">{order.orderStatus}</td>
              <td className="py-2 px-4 border-b">{order.vendorName}</td>
              <td className="py-2 px-4 border-b">{order.assignedEmployee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GlobalAdminDashboards;