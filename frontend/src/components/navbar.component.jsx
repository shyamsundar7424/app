import React, { useContext } from "react";
import logo from "../imgs/logo.png";
import { Link,Outlet } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../App";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  
  const { userAuth, userAuth:{ access_token, profile_img}} = useContext(UserContext);

  return (
    <>
        <nav className="navbar">
      {/* Logo and logo image is store in :scr/components/logo.png */}
      <Link to="/" className="  flex-none w-10">
        <img src={logo} alt="logo-icon" className=" w-full" />
      </Link>

      {/* this is creating search bar with all devices using tailwind css */}
      <div
        className={
          "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] " +
          "md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
          (searchBoxVisibility ? "show" : "hide")
        }
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>
      {/* create a search bar icon for toggle whwn we create 
            search button then show seach bar */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-grey w-12 h-12 
                rounded-full items-center justify-center"
          onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
        >
          <i className="fi fi-rr-search text-xl"></i>
        </button>
         {/*create write button and icon in navbar */}
        <Link to="/editor" className="hidden md:flex gap-2 link" >
        <i className="fi fi-rr-file-edit" ></i>
        <p className="text-black font-semibold" >write</p>
        </Link>
       

      {
        access_token ? 
          <> 
             <Link to="/dashboard/notification">
              <button className="w-12 h-12 rounded-full bg-grey relative
              hover:bg-black/10">

              </button>
                
             </Link>
          </>
        :
        <>
           {/*create signin button in navbar */}
           <Link className="btn-dark py-2" to="/signin" >
                sign In
            </Link>
            {/*create signUp button in navbar */}
            <Link className="btn-light py-2 hidden md:block" to="/signup" >
                sign Up
             </Link>
        </>
      }

      </div>
        </nav>

        <Outlet />
    </>
  );
};
export default Navbar;
