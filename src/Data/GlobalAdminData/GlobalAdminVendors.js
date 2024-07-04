import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GlobalAdminVendors() {
    const [vendors, setVendors] = useState([]);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('global_adminToken');

    const fetchVendors = async () => {
        try {
            const response = await axios.get(`http://localhost:1000/api/v1/globalAdmin/getData/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVendors(response.data.vendors || []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <h1 className="text-xl font-semibold mb-6">Assigned Vendors</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-zinc-800 border">
                    <tr>
                        <th className="py-1 px-6 border-b font-light text-left text-white">VID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Name</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Phone</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Email</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Company</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Relation</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Address</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Orders</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Requests</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map((vendor) => (
                        <tr key={vendor.vendorId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{vendor.vendorId}</td>
                            <td className="py-1 px-4 text-left">{vendor.vendorName}</td>
                            <td className="py-1 px-4 text-left">{vendor.vendorPhone}</td>
                            <td className="py-1 px-4 text-left">{vendor.user.email}</td>
                            <td className="py-1 px-4 text-left">{vendor.vendorCompany}</td>
                            <td className="py-1 px-4 text-left">{vendor.vendorRelation}</td>
                            <td className="py-1 px-4 text-left">{vendor.vendorAddress}</td>
                            <td className="py-1 px-8 text-left font-semibold">{vendor.orders?.length || 0}</td>
                            <td className="py-1 px-8 text-left font-semibold">{vendor.requests?.length || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GlobalAdminVendors;
