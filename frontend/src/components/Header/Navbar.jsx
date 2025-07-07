import React from 'react'
import Styles from "../../Styles/Styles";
import { Link, useLocation } from 'react-router-dom';
const Navbar = ({ActiveHeading,setActiveHeading}) => {
  const location = useLocation();
  
  const getActiveClass = (path) => {
    return location.pathname === path ? "text-[#007bc4]" : "text-[#242424]";
  };
 
  return (
    <div className={`${Styles.normal_flex}`}>
    <div className="flex items-center gap-[20px]">
      <Link
        to="/"
        className={`${getActiveClass('/')}  cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(1)}
      >
        home
      </Link>
      <Link
        to="/shop"
        className={`${getActiveClass('/shop')} cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(2)}
      >
        shop
      </Link>
      <Link
        to="/about"
        className={`${getActiveClass('/about')}  cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(3)}
      >
        about us
      </Link>
      <Link
        to="/contact"
        className={`${getActiveClass('/contact')}  cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(4)}
      >
        contact us
      </Link>
      <Link
        to="/privacy"
        className={`${getActiveClass('/privacy')}  cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(5)}
      >
        privacy policy
      </Link>
      <Link
        to="/blog"
        className={`${getActiveClass('/blog')} cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
        onClick={() => setActiveHeading(6)}
      >
        Blog
      </Link>
    </div>
  </div>
  )
}

export default Navbar
