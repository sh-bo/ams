import React from 'react'
import SASidebar from '../Components/SuperAdmin/SASidebar'
import SAHeader from '../Components/SuperAdmin/SAHeader'
import AdminDashboard from '../Data/AdminDashboard'

function SuperAdminDashboard() {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
        <SASidebar />
        <div className='flex flex-col flex-1'>
            <div><SAHeader /></div>
            <div className='flex-1 p-4 min-h-0 overflow-auto bg-neutral-200'><AdminDashboard /></div>
        </div>
    </div>
  )
}

export default SuperAdminDashboard