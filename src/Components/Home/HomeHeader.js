import React from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { FaBars } from 'react-icons/fa';
import LOGO from '../../Assets/Logo.png'

function HomeHeader() {
  const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    }

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
        <img
            className="h-16 w-54 filter invert mt-1"
            src={LOGO}
            alt="Logo"
        />
        <ul className='hidden md:flex'>
            <Link to={'/'}><li className='p-4'>Home</li></Link>
            <Link to={'/auth/login'}><li className='p-4'>Login</li></Link>
            <Link to={'/auth/registerEmployee'}><li className='p-4'>Employee Registration</li></Link>
        </ul>
        <div onClick={handleNav} className='block md:hidden'>
         {nav ? <IoMdClose size={20} /> : <FaBars size={20} />}
        </div>
        <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-black ease-in-out duration-500' : 'fixed left-[-100%]'}>
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>Asset Platform</h1>
            <ul className='pt-12 uppercase p-4'>
                <Link to={'/'}><li className='p-4 border-b border-gray-600'>Home</li></Link>
                <Link to={'/auth/login'}><li className='p-4 border-b border-gray-600'>Vendor</li></Link>
                <Link to={'/auth/registerEmployee'}><li className='p-4 border-b border-gray-600'>Employee Registration</li></Link>
            </ul>
        </div>
    </div>
  )
}

export default HomeHeader