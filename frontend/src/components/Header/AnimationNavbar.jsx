import React from 'react'
import Styles from "../../Styles/Styles";
import { Link, useLocation } from 'react-router-dom';

const AnimationNavbar = ({ActiveHeading,setActiveHeading}) => {
  const location = useLocation();
  
  const getActiveClass = (path) => {
    return location.pathname === path ? "text-[#007bc4]" : "text-[#fff]";
  };
  return (
    <div className={`${Styles.normal_flex}`}>
      
            <div className="flex" >
                <Link to={'/'}
                className={`${getActiveClass('/')} 
                 px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}onClick={()=>setActiveHeading(1)}>
                home
                </Link>
                <Link to={'/shop'}
                className={`${getActiveClass('/shop')} 
                 px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}onClick={()=>setActiveHeading(2)}>
                shop
                </Link>
                <Link to={'/about'}
                className={`${getActiveClass('/about')} 
                 px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}onClick={()=>setActiveHeading(3)}>
                about us
                </Link>
                <Link to={'/contact'}
                className={`${getActiveClass('/contact')} 
                 px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}onClick={()=>setActiveHeading(4)}>
                contact us
                </Link>
                <Link to={'/privacy'}
                className={`${getActiveClass('/privacy')} 
                 px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}onClick={()=>setActiveHeading(4)}>
                privacy policy
                </Link>
                <Link
                  to="/blog"
                  className={`${getActiveClass('/blog')}  px-4 cursor-pointer uppercase ProxymaSemiBold 1280px:text-[13px]`}
                  onClick={() => setActiveHeading(4)}
                >
                  Blog
                </Link>
            </div>
        
    </div>
  )
}

export default AnimationNavbar
