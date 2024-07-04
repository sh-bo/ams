import React, { useState, useEffect } from 'react';
import axios from 'axios';

const processRequests = (vendors) => {
    let allRequests = [];
    vendors.forEach(vendor => {
        vendor.requests.forEach(request => {
            allRequests.push({
                requestId: request.requestId,
                requestDetails: request.requestDetails,
                requestType: request.requestType,
                requestDate: request.requestDate,
                requestStatus: request.requestStatus,
                vendorName: vendor.vendorName,
            });
        });
    });
    return allRequests.sort((a, b) => a.requestId - b.requestId);
};

function GlobalAdminRequests() {
    const [requests, setRequests] = useState([]);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('global_adminToken');

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:1000/api/v1/globalAdmin/getData/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const allRequests = processRequests(response.data.vendors || []);
            setRequests(allRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <h1 className="text-xl font-semibold mb-6">Assigned Requests</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-zinc-800 border">
                    <tr>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Request ID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Details</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Type</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Date</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Status</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Vendor Name</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.requestId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{request.requestId}</td>
                            <td className="py-1 px-4 text-left">{request.requestDetails}</td>
                            <td className="py-1 px-4 text-left">{request.requestType}</td>
                            <td className="py-1 px-4 text-left">{request.requestDate}</td>
                            <td className="py-1 px-4 text-left">{request.requestStatus}</td>
                            <td className="py-1 px-4 text-left">{request.vendorName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GlobalAdminRequests;
