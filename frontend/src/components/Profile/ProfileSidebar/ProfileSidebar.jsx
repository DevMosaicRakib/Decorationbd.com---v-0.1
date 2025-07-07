import React, { useEffect, useState } from 'react'
import { RxPerson } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
// import { FaCloudDownloadAlt } from "react-icons/fa";
import { BsListCheck } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
// import axios from 'axios';
import { getToken } from '../../../Redux/UserAndAuthServices/LocalStorageService';


const ProfileSidebar = ({active,setActive,handleLogout,setIsForm,setBillingAddressForm,setShippingForm,resetForm}) => {
      // Customer Order Fetch
  const {access_token} = getToken()    
  const [orders,setOrders] = useState([]);
  // const allOrders = async ()=>{
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}api/allorders/`,
  //       {
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${access_token}`
  //         }
  //     }
  //     )
  //     console.log(response.data)
  //     setOrders(response.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(()=>{
  //   allOrders();
  // },[])
  // Calculate total quantity of all products in all orders
// const totalQuantity = orders.reduce((sum, order) => {
//     const orderQuantity = order.order_items.reduce((orderSum, item) => orderSum + item.quantity, 0);
//     return sum + orderQuantity;
//   }, 0);
  
//   console.log(`Total product quantity: ${totalQuantity}`);
  // const [totalQuantity, setTotalQuantity] = useState('');

  // Load totalQuantity from local storage on mount
  // useEffect(() => {
  //   const savedQuantity = JSON.parse(localStorage.getItem('totalQuantity'));
  //   if (savedQuantity && savedQuantity > 0) {
  //     setTotalQuantity(savedQuantity);
  //   }
  // }, []);

  // Update totalQuantity when orders change (new order created)
  // useEffect(() => {
  //   if (orders?.length > 0) {
  //     const calculatedQuantity = orders.reduce((sum, order) => {
  //       return sum + order.order_items.reduce((orderSum, item) => orderSum + item.quantity, 0);
  //     }, 0);
  //     setTotalQuantity(calculatedQuantity);
  //     localStorage.setItem('totalQuantity', JSON.stringify(calculatedQuantity)); // Store in local storage
  //   }
  // }, [orders]);

  // Handle click event to hide totalQuantity
  const handleClick = () => {
    setActive(2);
    setIsForm(false);
    setBillingAddressForm(false);
    setShippingForm(false);
    resetForm();
    // setTotalQuantity(null); // Clear totalQuantity
    // localStorage.setItem('totalQuantity', JSON.stringify(null)); // Also clear in local storage
  };


    const navigate = useNavigate()
  return (
    <div className='w-full  bg-white shadow-sm rounded-sm 768px:p-4 300px:p-3 1280px:pt-8 '>
        <div className="flex items-center cursor-pointer w-full mb-8 1350px:mb-6"
        onClick={()=>{setActive(1);setIsForm(false);setBillingAddressForm(false);setShippingForm(false);resetForm()}}>
            <RxPerson  color={active===1?"#007bc4":""} className='text-[18px]'/>
            <span className={`pl-3 ${active===1?"text-[#007bc4]":""} text-[13.5px] ProxymaRegular hidden 1280px:inline`}>Profile</span>
        </div>
        {/* <div className="flex items-center cursor-pointer w-full mb-8 relative"
        onClick={()=>{setActive(2);setIsForm(false);setBillingAddressForm(false);setShippingForm(false);resetForm()}}>
            <BsListCheck  color={active===2?"red":""} className='text-[18px] '/>
            <span className='absolute text-[10px] text-[white] font-Roboto text-center
             bg-[red] rounded-[50%] px-1 py-1 w-[14px] h-[14px] flex items-center justify-center
            top-[-8px] left-[12px]'><span>{orders?.length > 0 ? totalQuantity : ''}</span></span>
            <span className={`pl-3 ${active===2?"text-[red]":""} text-[13px] font-normal hidden 1280px:inline`}>Orders</span>
        </div> */}

        <div className="flex items-center cursor-pointer w-full mb-8 relative" onClick={handleClick}>
              <BsListCheck color={active === 2 ? "#007bc4" : ""} className='text-[18px]' />
              {/* <span className={`${totalQuantity ? 'bg-[red]' : 'bg-white'} absolute text-[10px] text-white font-Roboto text-center
                rounded-[50%] px-1 py-1 w-[14px] h-[14px] flex items-center justify-center
                top-[-8px] left-[12px]`}>
                <span>{totalQuantity || ''}</span> 
              </span> */}
              <span className={`pl-3 ${active === 2 ? "text-[#007bc4]" : ""} text-[13.5px] ProxymaRegular hidden 1280px:inline`}>Orders</span>
            </div>

        <div className="flex items-center cursor-pointer w-full mb-8"
        onClick={()=>{setActive(4);setIsForm(false);setBillingAddressForm(false);setShippingForm(false);resetForm()}}>
            <FaMapLocationDot  color={active===4?"#007bc4":""} className='text-[18px]'/>
            <span className={`pl-3 ${active===4?"text-[#007bc4]":""} text-[13.5px] ProxymaRegular hidden 1280px:inline`}>Address</span>
        </div>
        <div className="flex items-center cursor-pointer w-full mb-8"
        onClick={()=>{setActive(5);setIsForm(false);setBillingAddressForm(false);setShippingForm(false);resetForm()}}>
            <RiAccountPinCircleFill  color={active===5?"#007bc4":""} className='text-[18px]'/>
            <span className={`pl-3 ${active===5?"text-[#007bc4]":""} text-[13.5px] ProxymaRegular hidden 1280px:inline`}>Account Details</span>
        </div>
        <div className="flex items-center cursor-pointer w-full 1280px:mb-8 mb-2"
        onClick={()=>{
            setActive(6);
            handleLogout();
        }}>
            <IoMdLogOut color={active===6?"#007bc4":""} className='text-[18px]'/>
            <span className={`pl-3 ${active===6?"text-[#007bc4]":""} text-[13.5px] ProxymaRegular hidden 1280px:inline`}>Logout</span>
        </div>
    </div>
  )
}

export default ProfileSidebar
