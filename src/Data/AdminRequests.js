import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal';
import Confirmation from '../Components/Confirmation';

function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [editRequest, setEditRequest] = useState(null);
    const [requestData, setRequestData] = useState({
        requestDetails: '',
        requestType: '',
        requestDate: '',
        requestStatus: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [requestId, setRequestId] = useState(null);

    const fetchRequests = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/requestData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRequests(response.data);
            setFilteredRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleEditClick = (request) => {
        setEditRequest(request);
        setRequestData({
            requestDetails: request.requestDetails,
            requestType: request.requestType,
            requestDate: request.requestDate,
            requestStatus: request.requestStatus
        });
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editRequestData/${editRequest.requestId}`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditRequest(null);
            const updatedRequests = requests.map((request) =>
                request.requestId === editRequest.requestId ? { ...request, ...requestData } : request
            );
            setRequests(updatedRequests);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    const handleDelete = (id) => {
        setRequestId(id);
        setModalAction('delete');
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';

        switch (modalAction) {
            case 'delete':
                url = `http://localhost:1000/api/v1/superAdmin/deleteRequestData/${requestId}`;
                break;
            default:
                break;
        }

        try {
            await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
            setRequests((prevRequests) => prevRequests.filter((request) => request.requestId !== requestId));
            setFilteredRequests((prevRequests) => prevRequests.filter((request) => request.requestId !== requestId));
            setIsModalOpen(false);
            fetchRequests();
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on request:`, error);
        }
    };

    const handleModalClose = () => {
        setEditRequest(null);
        setIsEditModalOpen(false);
        setIsModalOpen(false);
    };

    const handleSearch = () => {
        setFilteredRequests(
            requests.filter((request) => {
                const searchTermLower = searchTerm.toLowerCase();
                return (
                    request.requestDetails.toLowerCase().includes(searchTermLower) ||
                    request.requestType.toLowerCase().includes(searchTermLower) ||
                    request.requestDate.toLowerCase().includes(searchTermLower) ||
                    request.requestStatus.toLowerCase().includes(searchTermLower)
                );
            })
        );
    };

    const handleRefresh = () => {
        fetchRequests();
    };

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">Request Management</h1>
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
                        <th className="py-2 px-6 border-b font-light text-left text-white">Request ID</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Request Details</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Request Type</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Request Date</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Request Status</th>
                        <th className="py-2 px-6 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.requestId} className="border-b">
                            <td className="py-2 px-12 border-b font-semibold">{request.requestId}</td>
                            <td className="py-2 px-6 border-b">{request.requestDetails}</td>
                            <td className="py-2 px-6 border-b">{request.requestType}</td>
                            <td className="py-2 px-6 border-b">{request.requestDate}</td>
                            <td className="py-2 px-6 border-b">{request.requestStatus}</td>
                            <td className="py-1 px-6 text-left flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditClick(request)}
                                    className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(request.requestId)}
                                    className="bg-transparent text-red-500 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Delete
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
                    title="Edit Request">
                    <h2 className="text-xl font-semibold mb-4">Edit Request</h2>
                    <div>
                        <label className="block mb-2">Request Details:</label>
                        <input
                            type="text"
                            value={requestData.requestDetails}
                            onChange={(e) => setRequestData({ ...requestData, requestDetails: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Request Type:</label>
                        <input
                            type="text"
                            value={requestData.requestType}
                            onChange={(e) => setRequestData({ ...requestData, requestType: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Request Date:</label>
                        <input
                            type="text"
                            value={requestData.requestDate}
                            onChange={(e) => setRequestData({ ...requestData, requestDate: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Request Status:</label>
                        <select
                            value={requestData.requestStatus}
                            onChange={(e) => setRequestData({ ...requestData, requestStatus: e.target.value })}
                            className="border rounded-md p-1 w-full outline-none"
                        >
                            <option value="IN_REVIEW">In Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </Modal>
            )}
            {isModalOpen && (
                <Confirmation
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleConfirmAction}
                    title="Confirm Action"
                >
                    <h2 className="text-xl">Are you sure you want to {modalAction} this request?</h2>
                </Confirmation>
            )}
        </div>
    );
}

export default AdminRequests;
