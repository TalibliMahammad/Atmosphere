
import React from 'react'
import { CiLight } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { TiWeatherWindy } from "react-icons/ti";

import { Link } from 'react-router-dom';
import { useTheme } from './context/theme.provider';
import CitySearch from './city-search';

const Header = () => {

    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";


    return (
        <header className='sticky top-0 z-50 w-full bg-background/95 background-vlur py-2 supports-[backdrop-filter]:bg-background/60 '>
            <div className='container mx-auto flex h-16  gap-5 items-center  md:justify-between justify-center md:px-4'>
                <Link to="/" className='flex items-center md:gap-5  '>
                    <TiWeatherWindy className={`md:h-10 h-7 md:w-10 w-7 ${isDark ? "text-white" : "text-black"}`} />
                    <span className={`flex items-center md:text-2xl text-[12px] font-bold  ${isDark ? "text-muted-foreground" : "text-black"}`}>Atmosphere</span>
                </Link>

                <div className='flex gap-4'>
                    <div>
                        <CitySearch />
                    </div>
                    <div onClick={() => setTheme(isDark ? "light" : "dark")} className='cursor-pointer'>
                        {isDark ? <CiLight className='size-8 transition duration-500 ease-in-out hover:rotate-180 ' /> : <FaMoon className='size-8 transition duration-500 ease-in-out hover:rotate-190 ' />}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header