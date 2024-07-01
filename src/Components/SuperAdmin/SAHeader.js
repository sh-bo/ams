import React from 'react'

function SAHeader() {

    const userEmail = localStorage.getItem('email');

    return (
        <header className="bg-zinc-950 text-white p-4 flex justify-between items-center">
            <div className='flex'>
                <h2 className='font-light text-sm'>In Development : v1.0.0</h2>
            </div>
            <div className="flex space-x-4">
                <h2 className="font-light text-sm mr-4"><span className='font-semibold'>Logged in : </span>{userEmail}</h2>
            </div>
        </header>
    )
}

export default SAHeader