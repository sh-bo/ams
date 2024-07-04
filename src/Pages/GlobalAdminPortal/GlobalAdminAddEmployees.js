import React from 'react'
import GASidebar from '../../Components/GlobalAdmin/GASidebar'
import GAHeader from '../../Components/GlobalAdmin/GAHeader'
import GlobalAdminAddEmployee from '../../Data/GlobalAdminData/GlobalAdminAddEmployee'

function GlobalAdminAddEmployees() {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
        <GASidebar />
        <div className='flex flex-col flex-1'>
            <div><GAHeader /></div>
            <div className='flex-1 p-4 min-h-0 overflow-auto bg-neutral-200'><GlobalAdminAddEmployee /></div>
        </div>
    </div>
  )
}

export default GlobalAdminAddEmployees