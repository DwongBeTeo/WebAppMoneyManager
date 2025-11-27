import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import {assets} from "../assets/asset.js";
import SideBar from "./SideBar.jsx";
const MenuBar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const {user, clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    const handleDropDown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearUser();
        setShowDropdown(false);
        navigate('/login');
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if(showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);
    return (
        <div className="flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/* Left side - Menu button and tittle */}
            <div className="flex items-center gap-5">
                <button  
                onClick={() => setOpenSideMenu(!openSideMenu)}
                // lg:hidden nghĩa là: ẩn nút này đi khi màn hình ≥ 1024px
                className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors">
                    {openSideMenu ? (
                        <X className="text-2xl" />
                    ) : (
                        <Menu className="text-2xl" />
                    )}
                </button>

                {/* Logo and Title */}
                <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                    <img src={assets.logo} alt="Logo" className="h-10 w-10 cursor-pointer" />
                    <span className="text-lg font-medium text-black truncate cursor-pointer">Money Manager</span>
                </div>
            </div>

            {/* Right side - Avatar image */}
            <div className="relative" ref={dropDownRef}>
                <button 
                    onClick={handleDropDown}
                    className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2">
                        <User className="text-purple-600" />
                </button>

                {/* Drop down User */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-gray-200 py-1 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex-items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                    <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Drop down options */}
                        <div className="py-1">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                    <LogOut className="w-4 h-4 text-gray-500" />
                                    <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile side menu */}
            {openSideMenu && (
                <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
                    <SideBar activeMenu={activeMenu}/>
                </div>
            )}
        </div>
    )
}

export default MenuBar;