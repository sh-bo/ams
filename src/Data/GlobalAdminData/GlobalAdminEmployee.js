import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalAdminEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const token = localStorage.getItem('global_adminToken');

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:1000/api/v1/globalAdmin/employeeData', {
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
        fetchEmployees();
    }, []);

    return (
        <div className="p-1 px-2 bg-neutral-200 min-h-full">
            <h1 className="text-xl font-semibold mb-6">Employee Management</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-zinc-800 border">
                    <tr>
                        <th className="py-1 px-6 border-b font-light text-left text-white">Employee ID</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Name</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Title</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Phone</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Department</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Location</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Email</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Role</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Assets</th>
                        <th className="py-1 px-4 border-b font-light text-left text-white">Assigned Orders</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employeeId} className="border-b">
                            <td className="py-1 px-8 text-left font-semibold">{employee.employeeId}</td>
                            <td className="py-1 px-4 text-left">{employee.employeeName}</td>
                            <td className="py-1 px-4 text-left">{employee.employeeTitle}</td>
                            <td className="py-1 px-4 text-left">{employee.employeePhone}</td>
                            <td className="py-1 px-4 text-left">{employee.employeeDepartment}</td>
                            <td className="py-1 px-4 text-left">{employee.employeeLocation}</td>
                            <td className="py-1 px-4 text-left">{employee.user.email}</td>
                            <td className="py-1 px-4 text-left">{employee.user.role}</td>
                            <td className="py-1 px-4 text-center">
                                {employee.assets.length}
                            </td>
                            <td className="py-1 px-4 text-center">
                                {employee.assignedOrders.length}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GlobalAdminEmployee;
