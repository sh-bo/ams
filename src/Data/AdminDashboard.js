import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TiTicket } from 'react-icons/ti';
import { BiServer } from 'react-icons/bi';
import { CgShoppingCart } from 'react-icons/cg';
import { FaUserFriends, FaUsers } from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState({
    numberOfVendors: 0,
    numberOfEmployees: 0,
    numberOfOrders: 0,
    numberOfAssets: 0,
    numberOfRequests: 0,
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('super_adminToken'); 
      if (token) {
        try {
          const statsResponse = await axios.get('http://localhost:1000/api/v1/superAdmin/globalStats', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStats(statsResponse.data);

          const ordersResponse = await axios.get('http://localhost:1000/api/v1/superAdmin/orderData', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const processedOrders = processOrders(ordersResponse.data);
          setOrders(processedOrders.slice(0, 6)); 
        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
    };

    fetchData();
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
            }
          });
        }
      }
    });
    return allOrders.sort((a, b) => b.orderId - a.orderId); 
  };

  return (
    <div className="p-6 bg-neutral-200 min-h-full">
      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <FaUserFriends className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Vendors</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.numberOfVendors}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <FaUsers className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Employees</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.numberOfEmployees}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <CgShoppingCart className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Orders</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.numberOfOrders}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <BiServer className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Assets</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.numberOfAssets}</p>
        </div>
        <div className="flex-1 m-2 p-6 bg-zinc-800 rounded-lg shadow-md text-center">
          <div className='flex items-center justify-center'>
            <TiTicket className='h-8 w-8 mr-4 text-white'/>
            <h3 className="text-lg font-light text-white">Total Requests</h3>
          </div>
          <p className="text-2xl font-bold text-white mt-8">{stats.numberOfRequests}</p>
        </div>
      </div>
      <div>
            <h2 className='text-lg font-semibold mb-2'>Recent Orders</h2>
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
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-11 border-b">{order.orderId}</td>
              <td className="py-2 px-6 border-b">{order.orderDescription}</td>
              <td className="py-2 px-6 border-b">{order.orderDate}</td>
              <td className="py-2 px-6 border-b">{order.orderBudget}</td>
              <td className="py-2 px-6 border-b">{order.orderQty}</td>
              <td className="py-2 px-6 border-b">{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
