import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confirmation from '../../Components/Confirmation';
import Modal from '../../Components/Modal';

function AdminAsset() {
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [editAsset, setEditAsset] = useState(null);
    const [assetData, setAssetData] = useState({
        assetName: '',
        assetSerial: '',
        assetTag: '',
        assetCategory: '',
        assetModel: '',
        assetPurchaseCost: '',
        assetStatus: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [assetId, setAssetId] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);

    const processAssets = (data) => {
        let allAssets = [];
        let employeeMap = new Map();

        data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                if (item.assetId) {
                    let asset = {
                        ...item,
                        assetTag: String(item.assetTag),
                        assetPurchaseCost: String(item.assetPurchaseCost)
                    };
                    if (item.assignedTo && typeof item.assignedTo === 'object') {
                        employeeMap.set(item.assignedTo.employeeId, item.assignedTo);
                    }
                    allAssets.push(asset);
                }
                if (item.assignedTo && Array.isArray(item.assignedTo.assets)) {
                    item.assignedTo.assets.forEach(asset => {
                        if (typeof asset === 'object' && asset.assetId) {
                            let processedAsset = {
                                ...asset,
                                assetTag: String(asset.assetTag),
                                assetPurchaseCost: String(asset.assetPurchaseCost),
                                assignedTo: item.assignedTo
                            };
                            allAssets.push(processedAsset);
                        }
                    });
                    if (item.assignedTo && typeof item.assignedTo === 'object') {
                        employeeMap.set(item.assignedTo.employeeId, item.assignedTo);
                    }
                }
            }
        });

        allAssets = allAssets.map(asset => {
            if (typeof asset.assignedTo === 'number') {
                asset.assignedTo = employeeMap.get(asset.assignedTo) || asset.assignedTo;
            }
            return asset;
        });

        return allAssets.sort((a, b) => a.assetId - b.assetId);
    };

    const fetchAssets = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            const response = await axios.get('http://localhost:1000/api/v1/superAdmin/assetData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const processedAssets = processAssets(response.data);
            setAssets(processedAssets);
            setFilteredAssets(processedAssets);
        } catch (error) {
            console.error('Error fetching assets:', error);
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
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchAssets();
        fetchEmployees();
    }, []);

    const handleEditClick = (asset) => {
        setEditAsset(asset);
        setAssetData({
            assetName: asset.assetName,
            assetSerial: asset.assetSerial,
            assetTag: asset.assetTag,
            assetCategory: asset.assetCategory,
            assetModel: asset.assetModel,
            assetPurchaseCost: asset.assetPurchaseCost,
            assetStatus: asset.assetStatus
        });
        setIsEditModalOpen(true);
    };

    const handleDeAssign = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.post(
                `http://localhost:1000/api/v1/superAdmin/deAssignAsset/${assetId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAssets(prevAssets => prevAssets.map(asset =>
                asset.assetId === assetId
                    ? { ...asset, assignedEmployee: null }
                    : asset
            ));
            setIsAssignModalOpen(false);
            fetchAssets();
        } catch (error) {
            console.error('Error de-assigning asset:', error);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('super_adminToken');
        try {
            await axios.put(
                `http://localhost:1000/api/v1/superAdmin/editAssetData/${editAsset.assetId}`,
                assetData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditAsset(null);
            setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.assetId === editAsset.assetId ? { ...asset, ...assetData } : asset
                )
            );
            setFilteredAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.assetId === editAsset.assetId ? { ...asset, ...assetData } : asset
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating asset:', error);
        }
    };

    const handleSearch = () => {
        setFilteredAssets(
            assets.filter(
                (asset) =>
                    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    asset.assetSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    String(asset.assetTag).toLowerCase().includes(searchTerm.toLowerCase()) ||
                    asset.assetCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    asset.assetModel.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const handleDelete = (id) => {
        setAssetId(id);
        setModalAction('delete');
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('super_adminToken');
        let url = '';
    
        switch (modalAction) {
            case 'delete':
                url = `http://localhost:1000/api/v1/superAdmin/deleteAssetData/${assetId}`;
                break;
            case 'assign':
                url = `http://localhost:1000/api/v1/superAdmin/assignAsset/${assetId}/to/${employeeId}`;
                break;
            default:
                break;
        }
    
        try {
            if (modalAction === 'assign') {
                await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
                setAssets(prevAssets =>
                    prevAssets.map(asset =>
                        asset.assetId === assetId
                            ? { ...asset, assignedTo: employees.find(emp => emp.employeeId === parseInt(employeeId)) }
                            : asset
                    )
                );
            } else {
                await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
                setAssets(prevAssets => prevAssets.filter(asset => asset.assetId !== assetId));
                setFilteredAssets(prevAssets => prevAssets.filter(asset => asset.assetId !== assetId));
            }
            setIsModalOpen(false);
            setIsAssignModalOpen(false);
            fetchAssets();
        } catch (error) {
            console.error(`Error performing action (${modalAction}) on asset:`, error);
        }
    };
    

    const handleModalClose = () => {
        setEditAsset(null);
        setIsEditModalOpen(false);
        setIsModalOpen(false);
        setIsAssignModalOpen(false);
    };

    const handleAssign = (id) => {
        setAssetId(id);
        setEmployeeId('');
        setModalAction('assign');
        setIsAssignModalOpen(true);
    };

    const handleRefresh = () => {
        fetchAssets();
    };

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold mb-6">Asset Management</h1>
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
                        <th className="py-1 px-6 border-b font-light text-left text-white">Asset ID</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Name</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Serial</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Tag</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Category</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Model</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Purchase Cost</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Status</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Assigned To</th>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAssets.map((asset) => (
                        <tr key={asset.assetId} className="border-b">
                            <td className="py-1 px-10 text-left font-semibold">{asset.assetId}</td>
                            <td className="py-1 px-6 text-left">{asset.assetName}</td>
                            <td className="py-1 px-6 text-left">{asset.assetSerial}</td>
                            <td className="py-1 px-6 text-left">{asset.assetTag}</td>
                            <td className="py-1 px-6 text-left">{asset.assetCategory}</td>
                            <td className="py-1 px-6 text-left">{asset.assetModel}</td>
                            <td className="py-1 px-6 text-left">{asset.assetPurchaseCost}</td>
                            <td className="py-1 px-6 text-left">{asset.assetStatus}</td>
                            <td className="py-1 px-6 text-left">
                                {asset.assignedTo && typeof asset.assignedTo === 'object'
                                    ? asset.assignedTo.employeeName
                                    : 'Not Assigned'}
                            </td>
                            <td className="py-1 px-6 text-left flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditClick(asset)}
                                    className="bg-transparent text-blue-500 px-0 py-1 rounded-md flex items-center font-semibold mt-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(asset.assetId)}
                                    className="bg-transparent text-red-500 px-4 py-1 rounded-md flex items-center font-semibold mt-1d"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleAssign(asset.assetId)}
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
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleSave}
                    title="Edit Asset"
                >
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Name
                            </label>
                            <input
                                type="text"
                                value={assetData.assetName}
                                onChange={(e) => setAssetData({ ...assetData, assetName: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Serial
                            </label>
                            <input
                                type="text"
                                value={assetData.assetSerial}
                                onChange={(e) => setAssetData({ ...assetData, assetSerial: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Tag
                            </label>
                            <input
                                type="text"
                                value={assetData.assetTag}
                                onChange={(e) => setAssetData({ ...assetData, assetTag: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Category
                            </label>
                            <input
                                type="text"
                                value={assetData.assetCategory}
                                onChange={(e) => setAssetData({ ...assetData, assetCategory: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Model
                            </label>
                            <input
                                type="text"
                                value={assetData.assetModel}
                                onChange={(e) => setAssetData({ ...assetData, assetModel: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Purchase Cost
                            </label>
                            <input
                                type="text"
                                value={assetData.assetPurchaseCost}
                                onChange={(e) => setAssetData({ ...assetData, assetPurchaseCost: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asset Status
                            </label>
                            <select
                                value={assetData.assetStatus}
                                onChange={(e) => setAssetData({ ...assetData, assetStatus: e.target.value })}
                                className="border rounded-md p-1 w-full outline-none"
                            >
                                <option value="DEPLOYED">DEPLOYED</option>
                                <option value="UN DEPLOYABLE">UN DEPLOYABLE</option>
                                <option value="READY TO DEPLOY">READY TO DEPLOY</option>
                                <option value="IN SERVICE">IN SERVICE</option>
                            </select>
                        </div>
                    </div>
                </Modal>
            )}
            {isAssignModalOpen && (
                <Modal
                    isOpen={isAssignModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleConfirmAction}
                    title="Assignment of Asset"
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
                    {`Are you sure you want to ${modalAction} this asset?`}
                </Confirmation>
            )}
        </div>
    );
}

export default AdminAsset;
