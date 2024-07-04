import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GlobalAdminAddEmployee() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeTitle, setEmployeeTitle] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeeDepartment, setEmployeeDepartment] = useState('');
  const [employeeLocation, setEmployeeLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = {
      email,
      password,
      employeeName,
      employeeTitle,
      employeePhone,
      employeeDepartment,
      employeeLocation,
    };

    try {
      const response = await axios.post('http://localhost:1000/api/v1/auth/registerEmployee', employeeData);
      console.log('Employee added successfully:', response.data);
      // Optionally, reset form fields after successful submission
      navigate('/portal/globalAdmin/employees')
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-full h-full bg-slate-100 flex flex-col mb-20 justify-center items-center">
        <div className="w-full flex flex-col max-w-[500px]">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Add Employee</h3>
            <p className="text-base mb-2">Please enter the employee details.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col col-span-2">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor="employeeName" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Employee Name
              </label>
              <input
                type="text"
                placeholder="Employee Name"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor="employeeTitle" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Employee Title
              </label>
              <input
                type="text"
                placeholder="Employee Title"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={employeeTitle}
                onChange={(e) => setEmployeeTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor="employeePhone" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Employee Phone
              </label>
              <input
                type="text"
                placeholder="Employee Phone"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={employeePhone}
                onChange={(e) => setEmployeePhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor="employeeDepartment" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Employee Department
              </label>
              <input
                type="text"
                placeholder="Employee Department"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={employeeDepartment}
                onChange={(e) => setEmployeeDepartment(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="employeeLocation" className="block text-sm font-medium leading-6 text-gray-900 mt-0">
                Employee Location
              </label>
              <input
                type="text"
                placeholder="India"
                className="w-full text-black py-2 my-0 shadow-sm ring-1 ring-inset ring-gray-300 bg-white border-0 border-gray-400 outline-none focus:outline-none px-4 rounded-md"
                value={employeeLocation}
                onChange={(e) => setEmployeeLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-2">
              <button
                type="submit"
                className="w-full text-white my-2 font-semibold bg-slate-900 rounded-md p-3 text-center flex items-center justify-center cursor-pointer hover:bg-slate-800"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-[#060606] opacity-80">© AMS 2024</p>
        </div>
      </div>
    </div>
  );
}

export default GlobalAdminAddEmployee;
