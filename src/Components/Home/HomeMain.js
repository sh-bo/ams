import React from 'react'
import {ReactTyped}  from 'react-typed'
import { Link } from 'react-router-dom'

function HomeMain() {
  return (
    <div className='text-white'>
        <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>Asset Platform.</h1>
        <div className='flex justify-center items-center'>
            <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>All in One Platform for</p>
            <ReactTyped 
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600'
            strings={["ADMIN", "EMPLOYEE", "VENDOR"]} typeSpeed={95} backSpeed={95} loop/>
        </div>
        <p className='md:text-2xl text-xl font-bold text-gray-400'>Providing Solutions To 300+ Happy Customers.</p>
        <Link to={'/auth/registerVendor'}><button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black'>Vendor Registration</button></Link>
        </div>        
    </div>
  )
}

export default HomeMain