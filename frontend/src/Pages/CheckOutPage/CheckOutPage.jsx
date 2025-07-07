import React, { useEffect, useRef, useState } from 'react'
import Styles from "../../Styles/Styles"
import "./CheckOut.scss"
import { RxCross2 } from 'react-icons/rx';
import bkash from "../../Assets/img/bKash.png";
import { FiChevronDown } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { BiSolidDiscount } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import nogod from "../../Assets/img/CheckOut/nogod.png";
import rocket from "../../Assets/img/CheckOut/rocket.png";
import credit from "../../Assets/img/CheckOut/credit.jpg";
import axios from 'axios';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import { useFetchCustomerShippingAddressesQuery } from '../../Redux/AddressSlice/addressApi';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
// import {useFetchCartItemsQuery} from '../../Redux/CartSlice/cartApi.js';

const CheckOutPage = ({autoclose,shipping_charge,deviceCookie}) => {
  // console.log(shipping_charge)
    
    const [coupon,setCoupon] = useState(false);
   
    const [partialCod,setPartialCod] = useState(false);
    const [paymentButton,setPaymentButton] = useState(true);
    const [partialPaymentButton,setPartialPaymentButton] = useState(false);

    const {access_token} = getToken();
    const [carts,setCarts] = useState([]);
    const [quantities, setQuantities] = useState({});

    // Fetch Shipping Address Areas from api
    const allDistricts = [
      "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Barishal", "Sylhet", "Rangpur", "Mymensingh",
      "Cumilla", "Narayanganj", "Gazipur", "Jessore", "Cox's Bazar", "Noakhali", "Feni",
      "Bogura", "Pabna", "Jamalpur", "Tangail", "Brahmanbaria", "Satkhira", "Kushtia",
      "Chuadanga", "Jhenaidah", "Meherpur", "Magura", "Rajbari", "Faridpur", "Shariatpur", "Gopalganj",
      "Kishoreganj", "Netrokona", "Sherpur", "Lalmonirhat", "Nilphamari", "Thakurgaon", "Panchagarh",
      "Dinajpur", "Naogaon", "Natore", "Joypurhat", "Chapainawabganj", "Bagerhat", "Pirojpur",
      "Jhalokathi", "Bhola", "Barguna", "Habiganj", "Moulvibazar", "Sunamganj", "Madaripur", "Manikganj",
      "Munshiganj", "Chandpur", "Lakshmipur", "Bandarban", "Khagrachari", "Rangamati"
    ];
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    // Filter based on user input
    const filteredDistricts = allDistricts.filter(district =>
      district.toLowerCase().includes(searchInput.toLowerCase())
    );
      
    // Close dropdown when clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // const addressAreas = async () => {
    //   const res = await axios.get(`${process.env.REACT_APP_API_URL}dbd/api/shippingaddressarea/`)
    //   // console.log(res.data)
    //   setShippaddressArea(res.data)
    // }
    // useEffect(()=>{
    //   addressAreas()
    // },[])
    // console.log(shippaddressArea)

    const cartItems = async () => {
      try {
        if (access_token) {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}dbd/api/checkout/`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
              }
            }
          );
          setCarts(res.data)
        } else {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}dbd/api/checkout/`,
            {
              headers: {
                'Content-Type': 'application/json',
                'device': deviceCookie
              }
            }
          );
          // console.log(res.response)
          setCarts(res.data)
        }
        
        // console.log(res.data)
      } catch (error) {
        console.log(error)
        // if (error.response.data.error) {
        //   toast.error(error.response.data.error,{
        //     autoClose:700
        //   })
        // }
      }
    }
    useEffect(()=>{
      cartItems();
    },[])
    const [partialMessage,setPartialMessage] = useState('')
    const PartialMessageData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}dbd/api/partialmessage/`
        );
        // console.log(res)
        setPartialMessage(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      PartialMessageData();
    },[])
    
    // fetch date time and time preference from url 
    const location = useLocation();
    const [formattedDateTime, setFormattedDateTime] = useState("");
  
    // useEffect(() => {
    //   // Extract query parameters
    //   const searchParams = new URLSearchParams(location.search);
    //   const dateParam = searchParams.get("date"); // 2025-02-03T11:00:00.000Z
    //   const timePreference = searchParams.get("timePreference"); // before or after
  
    //   if (dateParam) {
    //     const dateObj = new Date(dateParam);
  
    //     // Format date (DD-MM-YYYY)
    //     const formattedDate = dateObj.toLocaleDateString("en-GB", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     });
  
    //     // Format time (h:mm A)
    //     const formattedTime = dateObj.toLocaleTimeString("en-US", {
    //       hour: "numeric",
    //       minute: "2-digit",
    //       hour12: true,
    //     });
  
    //     // Combine Date, Time, and Preference
    //     setFormattedDateTime(`${formattedDate} ${timePreference?timePreference:''} ${formattedTime}`);
        
    //   }
    // }, [location.search]);

    // console.log(formattedDateTime)

    const [totalSum, setTotalSum] = useState(0);
    // Fetch delivery charge functions start
    const [deliveryCharges, setDeliveryCharges] = useState([]);
    const [activeCharge, setActiveCharge] = useState(null);
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    useEffect(() => {
      if (shipping_charge?.length > 0) {
        const sortedCharges = [...shipping_charge].sort(
          (a, b) => parseFloat(a.min_amount) - parseFloat(b.min_amount)
        );
        setDeliveryCharges(sortedCharges);
      }
    }, [shipping_charge]);

    useEffect(() => {
      if (deliveryCharges?.length > 0) {
        const charge = deliveryCharges.find(
          (charge) =>
            totalSum >= parseFloat(charge.min_amount) &&
            (charge.max_amount === null || charge.max_amount === "infinity" || totalSum < parseFloat(charge.max_amount))
        );
        
        setActiveCharge(charge ? parseFloat(charge.delivery_charge) : 0);
      }
    }, [totalSum, deliveryCharges]);

    // console.log(deliveryCharges)

    const getDeliveryCharge = (totalSum, deliveryCharges) => {
      const charge = deliveryCharges.find(
        (charge) =>
          totalSum >= parseFloat(charge.min_amount) &&
          (charge.max_amount === null || charge.max_amount === "infinity" || totalSum < parseFloat(charge.max_amount))
      );
      return charge ? parseFloat(charge.delivery_charge) : 0;
    };

    useEffect(() => {
      if (shipping_charge?.length > 0) {
        setDeliveryCharge(getDeliveryCharge(totalSum, shipping_charge));
      }
    }, [totalSum, shipping_charge]);
    const DeliveryCharge = deliveryCharge ? deliveryCharge : 0
    
    const [partialCodAmount, setPartialCodAmount] = useState(0);
    
    useEffect(() => {
      if (carts && carts.length > 0) {
        const initialQuantities = {};
        let highestPartialCod = 0;
    
        carts.forEach(item => { 
          initialQuantities[item.id] = item.quantity; // Initialize quantities from backend
    
          const subTotal = Number(item.sub_total);
          const partialPercentage = item.products.partial_cod_in_percentage
            ? (Number(item.products.partial_cod_in_percentage) / 100) * subTotal
            : 0;
          
          const partialTaka = item.products.partial_cod_in_taka
            ? Number(item.products.partial_cod_in_taka)
            : 0;
    
          const maxPartial = Math.max(partialPercentage, partialTaka);
          highestPartialCod = Math.max(highestPartialCod, maxPartial);
        });
    
        setQuantities(initialQuantities);
        setTotalSum(carts[0].total_price); // Assuming total price is correct for all checked items
    
        // If no product has a partial COD, set the delivery charge as the partial COD
        setPartialCodAmount(highestPartialCod > 0 ? highestPartialCod : 1);
      }
    }, [carts]);


    

    const [couponCode,setCouponCode] = useState('')

    const forcodorderconfirmation = partialCodAmount? partialCodAmount : 1
    const afterConfirmationTotal = partialCod === true ? (totalSum + DeliveryCharge - partialCodAmount) : 0;
    const { data: shipaddresses, error, isLoading, refetch: refetchShippingAddresses } = useFetchCustomerShippingAddressesQuery();

    const updateQuantity = async (itemId, newQuantity, minQty, maxQty) => {
      // Ensure the quantity stays within limits
      if (newQuantity < minQty) {
        newQuantity = minQty;
      }
      if (maxQty !== null && newQuantity > maxQty) {
        newQuantity = maxQty;
      }
      try {
        if (access_token) {
          const response = await axios.patch(
            `${process.env.REACT_APP_API_URL}dbd/api/checkout/`,
            { quantity: newQuantity, cartId: itemId },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
              }
            }
          );
          if (response.status === 200) {
            setQuantities(prevQuantities => ({
              ...prevQuantities,
              [itemId]: newQuantity
            }));
            
          }
          if (response.data) {
            cartItems()
          }
          
        } else {
          const response = await axios.patch(
            `${process.env.REACT_APP_API_URL}dbd/api/checkout/`,
            { quantity: newQuantity, cartId: itemId },
            {
              headers: {
                'Content-Type': 'application/json',
                'device': deviceCookie
              }
            }
          );
          if (response.status === 200) {
            setQuantities(prevQuantities => ({
              ...prevQuantities,
              [itemId]: newQuantity
            }));
            
          }
          if (response.data) {
            cartItems()
          }
        }
        
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    };
  
    const decrementQuantity = (itemId, minQty) => {
      const currentQuantity = quantities[itemId] || 1;
      if (currentQuantity > minQty) {
        updateQuantity(itemId, currentQuantity - 1, minQty, null);
      }
      else{
            toast.error("Sorry! You can't decrease this quantity..",{
              autoClose:1000
            })
          }
    };
  
    const incrementQuantity = (itemId, maxQty) => {
      const currentQuantity = quantities[itemId] || 1;
      if (maxQty === null || currentQuantity < maxQty) {
        updateQuantity(itemId, currentQuantity + 1, 1, maxQty);
      }
      else {
        toast.error('Sorry! This Product Out of Stock now..',{
          autoClose:1000,
        })
      }
    };

    // const handleDeleteItem = async (itemId) => {
    //   try {
    //     await axios.delete(
    //       process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/cartitem_delete/`,
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${access_token}` // Ensure access_token is correctly set
    //         }
    //       }
    //     );
    //     // cartRefetch();
    
    //     // Update the state to remove the deleted item
    //     // setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== itemId));
    
    //   } catch (error) {
    //     console.error('Error deleting cart item:', error);
    //   }
    // };     
     const [fullPayment,setFullPayment] = useState(true);
     const [newAdd, setNewAdd] = useState(false);
     const [otherShippAdd, setOtherShippAdd] = useState(false);
     const [selected, setSelected] = useState(0); // Track the selected address index
     const [shipping, setShipping] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      area: "",
      customization: "",
      country: "Bangladesh",
    });
     const [newAddtitles,setnewAddtitles] = useState(false)
     useEffect(() => {
      if (shipaddresses && shipaddresses.length > 0) {
        setShipping(shipaddresses[0]);
      }
    }, [shipaddresses]);
    const handleAddressClick = (address, index) => {
      setShipping(address);
      setOtherShippAdd(false);
      setSelected(index);
      setNewAdd(false);
      setnewAddtitles(false);
    };
  
    const handleAddNewClick = () => {
      setNewAdd(!newAdd);
      setShipping({
        name: "",
        email: "",
        phone: "",
        address: "",
        area: "",
        customization: "",
        country: "Bangladesh",
      });
      setOtherShippAdd(false);
    };
    const handleCouponInputChange = (e) => {
      setCouponCode(e.target.value);
    };
  
    const handleApplyCoupon = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
          'device': deviceCookie // Send deviceCookie in headers
        };
    
        // If access_token is not present, send the request without it
        if (!access_token) {
          delete headers['Authorization']; // Remove Authorization if not authenticated
        } else {
          delete headers['device']
        }
    
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}dbd/api/add-coupon-checkout/`,
          { coupon: couponCode },
          { headers }
        );
    
        toast.success('Coupon code added successfully', {
          autoClose: autoclose
        });
        setTotalSum(response.data.total_price);
      } catch (error) {
        console.error('Error applying coupon:', error);
        toast.error(error?.response?.data?.msg, {
          autoClose: autoclose
        });
      }
    };

    const handlePlaceOrder = async (orderData, accessToken) => {
      try {
        if (access_token) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}dbd/api/place-order/`,
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        console.log(response.data);
        if (response.data.paymentID && response.data.bkashURL) {
        // Redirect the user to bKash URL
        window.location.href = response.data.bkashURL;
        } else {
        console.error('Failed to retrieve paymentID or bkashURL.');
        }
        } else {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}dbd/api/place-order/`,
            orderData,
            {
              headers: {
                'Content-Type': 'application/json',
                'device': deviceCookie
              }
            }
        );
        console.log(response.data);
        if (response.data.error) {
          if (response.data.error === 'You are already registered user. Please ! Log in first.') {
            navigate(`/login?message=${encodeURIComponent(response.data.error)}`);
            return;
          } else {
            toast.error(response?.data?.error, {
              autoClose: autoclose
            });
          }
        }
        if (response.data.paymentID && response.data.bkashURL) {
        // Redirect the user to bKash URL
        window.location.href = response.data.bkashURL;
        } else {
        console.error('Failed to retrieve paymentID or bkashURL.');
        }
        }
          // toast.success('Order placed successfully');
          // handle the response data if needed
          
  
      } catch (error) {
          console.error('Error placing order:', error);
          toast.error(error?.response?.data?.error || 'Failed to place order',{
            autoClose:autoclose
          });
      }
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setShipping({ ...shipping, [name]: value });
  };
  // const handleSelectArea = (area) => {
  //   setShipping({ ...shipping, area: area });
  //   setShowDropdown(false);
  // };
  const handleSelectArea = (area) => {
    setShipping({ ...shipping, area });
    setSearchInput(area);
    setShowDropdown(false);
  };
  
    const handleSubmit = (FullPayment) => {
      const paymentMethod = FullPayment ? 'Full Payment' : 'Cash on Delivery';
      const orderData = {
          shipping_address_id: shipping.id, // or the shipping address data
          payment_method: paymentMethod,
          totalPrice: totalSum+DeliveryCharge,
          pcod: 0,
          orderConfirmation: FullPayment?totalSum:forcodorderconfirmation,
          afterRemainTotal: afterConfirmationTotal,
          shipping_address: shipping,
          // delivery_date: formattedDateTime,
      };
      handlePlaceOrder(orderData, access_token);
  };
  const navigate = useNavigate();
  return (
    <div className={`1350px:w-[81.5%] 1280px:w-[83%] w-[98%] mx-auto flex flex-col h-full
    1280px:flex-row 1280px:items-center items-start justify-center 
     gap-[10px] bg-[#f9f9f9] py-[10px] 1280px:p-[10px] 1350px:py-[10px] mt-[10px]`}>

      <div className="1280px:w-[50%] w-[100%] px-2  768px:w-[80%] 1024px:w-[75%] 768px:mx-auto 1280px:mx-0
      1280px:py-0  h-[100%] 1280px:mr-[50px] 1350px:mr-0 mr-0 ">
   
        <div className="w-full 1350px:w-[86%] 768px:p-[15px] p-[5px] mt-[50px] 300px:mt-[60px] 768px:mt-[70px] 1280px:mt-[5px] 
        1350px:mt-0 rounded-sm bg-white shadow-md shadow-[rgb(0,0,0,0.5)]">   

      <div className={`mt-[5px] overflow-hidden`}>
      <div className="flex items-center justify-between">
        <h1 className='text-[16px] 1350px:text-[18px]
          text-[#242424] ProxymaSemiBold px-[5px] capitalize'>shipping details</h1>

        <div className="relative">
      <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => { setOtherShippAdd(!otherShippAdd); if (newAdd) setnewAddtitles(!newAddtitles); }}>
        <h5 className='text-[13px] ProxymaSemiBold text-[#242424]'>
        
          {newAdd ? `Shipping address ${shipaddresses?.length ? shipaddresses?.length + 1 : 1}` : `Shipping address ${selected + 1}`}
        </h5>
        <FiChevronDown className={`text-[13px] ${otherShippAdd || newAddtitles ? "rotate-180" : "rotate-0"}`} />
      </div>
      {otherShippAdd && !newAdd && (
        <div className="absolute px-[5px] py-[3px] bg-[white] z-[9999] cursor-pointer shadow-sm shadow-[gray]">
          {shipaddresses && shipaddresses.map((address, index) => (
            index !== selected && (
              <h5 key={index} className='text-[13px] ProxymaSemiBold px-[2px] text-[#242424] hover:bg-[#23bb73] hover:text-white'
                onClick={() => handleAddressClick(address, index)}>
                Shipping address {index + 1}
              </h5>
            )
          ))}
          <div className="flex items-center gap-[5px]" onClick={handleAddNewClick}>
            <GoPlus className="text-[13px]" />
            <h5 className="text-[13px] ProxymaSemiBold">Add address</h5>
          </div>
        </div>
      )}
      {newAddtitles && (
        <div className="absolute px-[5px] py-[3px] bg-[white] z-[9999] cursor-pointer 
        shadow-sm shadow-[rgb(128,128,128,0.5)]">
          {shipaddresses && shipaddresses.map((address, index) => (
            <h5 key={index} className='text-[13px] ProxymaSemiBold px-[2px] text-[#242424] hover:bg-[#007bc4] hover:text-white'
              onClick={() => handleAddressClick(address, index)}>
              Shipping address {index + 1}
            </h5>
          ))}
        </div>
      )}
    </div>


      </div>
      {
        newAdd ? (
          <>
            {/* Form fields for adding a new address */}
            <div className="768px:w-[90%] w-[100%] mt-[20px]  768px:mx-auto ">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Name :</label>
              <input
                type="text"
                name='name'
                placeholder='Full name'
                className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                value={shipping.name}
                onChange={handleInputChange}
                required
              />
              </div>
            </div>

            <div className='768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto '>
              <div className="w-[90%] mx-auto flex items-center justify-between ">
              <div className=" w-[49%]">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Email :</label>
                <input
                  type="email"
                  name='email'
                  placeholder='Email address'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] Proxymaregular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className=" w-[49%]">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Phone :</label>
                <input
                  type="text"
                  name='phone'
                  placeholder='Phone number'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </div>
            </div>

            <div className='768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto'>
              <div className="w-[90%] mx-auto">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Address :</label>
                <input
                  type="text"
                  name='Address'
                  placeholder='Address'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* <div className="relative 768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto">
              <div className="w-[90%] mx-auto ">
              <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Areas :</label>
              <input
                  type="text"
                  name='area'
                  placeholder='Select an area'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.area}
                  readOnly
                  onClick={() => setShowDropdown(!showDropdown)}
                  required
                />

              </div>
              {showDropdown && (
            <ul className="absolute top-[90%] left-1/2 w-[90%] transform -translate-x-1/2 overflow-x-hidden bg-white border border-gray-300 
            shadow-md max-h-[150px] overflow-y-auto no-scrollbar z-10">
              {shippaddressArea?.map((area, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer ProxymaRegular text-[11px]"
                  onClick={() => handleSelectArea(area?.place)}
                >
                  {area?.place}
                </li>
              ))}
            </ul>
          )}
            </div> */}
            <div ref={dropdownRef} className="relative 768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto">
              <div className="w-[90%] mx-auto ">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Areas :</label>
                <input
                  type="text"
                  name="area"
                  placeholder="Select an area"
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.area}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  required
                />
              </div>

              {showDropdown && filteredDistricts.length > 0 && (
                <ul className="absolute top-[90%] left-1/2 w-[90%] transform -translate-x-1/2 overflow-x-hidden bg-white border border-gray-300 
                  shadow-md max-h-[150px] overflow-y-auto no-scrollbar z-10">
                  {filteredDistricts.map((district, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer ProxymaRegular text-[11px]"
                      onClick={() => handleSelectArea(district)}
                    >
                      {district}
                    </li>
                  ))}
                </ul>
              )}
            </div>




            <div className="768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Comments :</label>
              <textarea
                placeholder='Write your opinion'
                name='customization'
                rows={3}
                cols={10}
                className='text-[11px] ProxymaRegular border border-[rgb(128,128,128,0.6)] w-[100%] px-[10px] text-[#242424]'
                value={shipping.customization}
                onChange={handleInputChange}
              />
              </div>
            </div> 

            <div className="768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto hidden">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] font-normal text-[13px] text-[#242424]"> Country :</label>
              <textarea
                placeholder='***Enter your address'
                name='country'
                rows={3}
                cols={10}
                className='text-[10px] font-normal border border-[rgb(128,128,128,0.6)] w-[100%] px-[10px] text-[#242424]'
                value= 'Bangladesh'
              />
              </div>
            </div>

          </>
        ) : (
          <>
            {/* Form fields for editing existing address */}
            <div className="768px:w-[90%] w-[100%] mt-[20px]  768px:mx-auto ">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Name :</label>
              <input
                type="text"
                name='name'
                placeholder='Full name'
                className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                value={shipping.name}
                onChange={handleInputChange}
                required
              />
              </div>
            </div>

            <div className='768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto '>
              <div className="w-[90%] mx-auto flex items-center justify-between ">
              <div className=" w-[49%]">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Email :</label>
                <input
                  type="email"
                  name='email'
                  placeholder='Email address'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] Proxymaregular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className=" w-[49%]">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Phone :</label>
                <input
                  type="text"
                  name='phone'
                  placeholder='Phone number'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </div>
            </div>

            <div className='768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto'>
              <div className="w-[90%] mx-auto">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Address :</label>
                <input
                  type="text"
                  name='address'
                  placeholder='Address'
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div ref={dropdownRef} className="relative 768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto">
              <div className="w-[90%] mx-auto ">
                <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Areas :</label>
                <input
                  type="text"
                  name="area"
                  placeholder="Select an area"
                  className={`px-[10px] py-[8px] 1350px:py-[4px] text-[11px] ProxymaRegular
                  rounded-sm outline-none border border-[rgb(128,128,128,0.6)] !w-[100%] text-[#242424]`}
                  value={shipping.area}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  required
                />
              </div>

              {showDropdown && filteredDistricts.length > 0 && (
                <ul className="absolute top-[90%] left-1/2 w-[90%] transform -translate-x-1/2 overflow-x-hidden bg-white border border-gray-300 
                  shadow-md max-h-[150px] overflow-y-auto no-scrollbar z-10">
                  {filteredDistricts.map((district, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer ProxymaRegular text-[11px]"
                      onClick={() => handleSelectArea(district)}
                    >
                      {district}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] ProxymaSemiBold text-[13px] text-[#242424]"> Comments :</label>
              <textarea
                placeholder='Write your opinion'
                name='customization'
                rows={3}
                cols={10}
                className='text-[11px] ProxymaRegular border border-[rgb(128,128,128,0.6)] w-[100%] px-[10px] text-[#242424]'
                value={shipping.customization}
                onChange={handleInputChange}
              />
              </div>
            </div> 

            <div className="768px:w-[90%] w-[100%] mt-[10px] 1350px:mt-[5px] 768px:mx-auto hidden">
              <div className="w-[90%] mx-auto">
              <label className="block pb-2 1350px:pb-[3px] font-normal text-[13px] text-[#242424]"> Country :</label>
              <textarea
                placeholder='***Enter your address'
                name='country'
                rows={3}
                cols={10}
                className='text-[10px] font-normal border border-[rgb(128,128,128,0.6)] w-[100%] px-[10px] text-[#242424]'
                value= 'Bangladesh'
              />
              </div>
            </div>

          </>
        )
      }
    </div>
        </div>
      </div>

      <div className="h-[100%] px-2 1280px:w-[45%] 1350px:w-[35%] 768px:w-[80%] 1024px:w-[75%] w-[100%] mx-auto 1280px:mx-0">

            {/* Delivery Charge Display */}
        {
          shipping_charge?.length ? (
            <div className="relative flex justify-between items-center w-full bg-[whitesmoke] px-4 py-2 rounded-md shadow-lg mb-[10px]">
            {deliveryCharges?.map((charge, index) => (
              <div key={index} className="text-center relative">
                {/* Amount Range */}
                <p className="text-gray-700 text-[13px] ProxymaSemiBold">
                  {charge.max_amount === null || charge.max_amount === "infinity"
                    ? `${charge.min_amount}+ tk`
                    : `${charge.min_amount} - ${charge.max_amount} tk`}
                </p>
                {/* Delivery Charge Amount */}
                <p
                  className={` text-[8px] ProxymaRegular px-[20px] ${
                    parseFloat(charge.delivery_charge) === activeCharge && activeCharge >0
                      ? "text-[#007bc4] scale-110"
                      : "text-gray-500"
                  } transition-transform duration-300`}
                > delivery charge {" "}
                  {charge.delivery_charge} TK
                </p>
                {/* Active Indicator Dot */}
                <div
                  className={`w-[8px] h-[8px] z-10 rounded-full absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 ${
                    parseFloat(charge.delivery_charge) >= activeCharge && activeCharge >0
                      ? "bg-[#007bc4]"
                      : "bg-gray-400"
                  } transition-colors duration-300`}
                ></div>
              </div>
            ))}
          {/* Indicator Line */}
          <div className=" w-[63%] 768px:w-[76%] 1024px:w-[80%] 1280px:w-[65%] h-1 bg-gray-300 absolute bottom-[2px] left-1/2 transform -translate-x-1/2">
            <div
              className={`${activeCharge?'bg-[#007bc4]':'bg-gray-300'} h-1  transition-all duration-500`}
              style={{
                width: `${((deliveryCharges?.findIndex(
                  (c) => parseFloat(c.delivery_charge) === activeCharge
                ) + 1) / deliveryCharges?.length) * 100}%`,
              }}
            ></div>
          </div>
          </div>
          ) : ''
        }    




      <div className=" w-[100%] h-auto 768px:p-[6px]  px-[5px] py-[10px] rounded-sm 
      shadow shadow-[#007bc4] bg-[#f7f7f7] mt-[10px] 1280px:mt-[5px] 1350px:mt-[2px] mb-[10px] 768px:mb-0">
        <h5 className='text-[13px] ProxymaSemiBold text-[#242424]'>Discount and Payment</h5>

            <div className="px-[10px] py-[5px] border-b-[1px] border-[rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between cursor-pointer" onClick={()=>setCoupon(!coupon)}>
                <div className="flex items-center gap-[10px]">
                 <BiSolidDiscount className="text-[13px] "/>
                 <p className='text-[12px] ProxymaRegular text-[#242424]'>Coupon code</p>
                </div>
                <div className="flex items-center gap-[10px] ">
                  <p className="text-[11px] text-[#b3b3b3] ProxymaRegular">Enter Coupon code</p>
                   <IoIosArrowForward className="text-[13px]"/> 
                </div>
              </div>
              <div className={`${coupon?"openCoupon":"closeCoupon"} relative`}>
                <input type="text" className='w-full px-[10px] py-[3px] 
                text-[11px] ProxymaRegular outline-none border border-[rgba(0,0,0,0.2)]'
                value={couponCode} onChange={handleCouponInputChange}/>
                <p className='text-[13px] ProxymaSemiBold absolute right-7 top-1 text-[#007bc4] cursor-pointer' onClick={handleApplyCoupon}>| Confirm</p>
              </div>
            </div>

            <div className="w-full px-2 py-3 1280px:py-1 ">
              <h4 className='ProxymaSemiBold text-[13px] text-[#007bc4]'>Order Summary</h4>
            </div>
        <div className="w-full px-2 py-2 bg-white shadow shadow-[gray] mt-[10px] 1350px:mt-0">
            <div className="flex items-center justify-between pb-1 border-b border-[rgba(0,0,0,0.2)]">
                <h3 className='text-[13px] text-[#242424] ProxymaSemiBold 768px:pl-3 pl-1 uppercase'>product</h3>
                <h3 className='text-[13px] text-[#242424] ProxymaSemiBold 768px:pr-3 pr-0 uppercase'>subtotal</h3>
            </div>
            {carts?.length ? (
              <div className='h-auto '>
              {carts?.map((item)=>(
                   <div className="flex items-center justify-between py-1 1280px:py-1 border-b border-[rgba(0,0,0,0.2)] " key={item.id}>
                   <div className="flex items-center">
                   {/* <RxCross2  className='text-[#f51919] text-[14px] ' onClick={() => handleDeleteItem(item.id)}/> */}
                   <img src={process.env.REACT_APP_IMG_URL+item?.products?.product_imgs[0]?.images} alt="" className='w-[40px] h-[40px] object-cover cursor-pointer 
                   768px:mx-[5px] mx-[5px]'/>
                   <div className="flex flex-col justify-center">
                   <h5 className=' ProxymaSemiBold pr-[14px] 768px:pr-0 text-[11px] text-[#242424]'>{item?.products?.name.length>20?item?.products?.name.slice(0,20)+"...":item?.products?.name}</h5>
                   <div className="px-1 flex items-center gap-[10px] mt-[5px]">
                    <button className='w-[23px] h-[23px] 1280px:w-[18px] 1280px:h-[18px] bg-[#007bc4] text-white 
                    text-[11px] outline-none border-none rounded-[3px]'
                    onClick={() => decrementQuantity(item.id, parseInt(item.products.min_quantity) || 1)}>-</button>
                    <span className='text-[11px] ProxymaRegular'>{quantities[item.id]}</span>
                    <button className='w-[23px] h-[23px] 1280px:w-[18px] 1280px:h-[18px] bg-[#007bc4]
                     text-white text-[11px] outline-none border-none rounded-[3px]'
                    onClick={() => incrementQuantity(item.id, item.products.total_stock ? parseInt(item.products.total_stock) : null)}>+</button>
                   </div>
                   </div>
                   </div>
                   <span className=' text-[12px] ProxymaRegular 768px:pr-3 pr-1
                    text-[#007bc4]'>{Number(item?.sub_total).toFixed(2)}<strong className='text-[13px] font-Roboto'>৳</strong></span>
                </div>
              ))}
              </div>
            ) : (
              <div className="w-full text-center py-[10px] text-[12px] text-[#242424]">
                <p className='ProxymaRegular'>Sorry!! there are no products in your cart.</p>
                <p className='ProxymaRegular'>Return to shop. <span className='text-[12px] text-[#007bc4] underline ProxymaSemiBold'
                onClick={()=>navigate('/shop')}>Shop</span></p>
              </div>
            )}

            

            <div className=" 1280px:mt-0 py-3 1280px:py-2 flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <h5 className='text-[#242424] text-[12px] ProxymaSemiBold capitalize 768px:pl-4 pl-1'>subtotal :</h5>
              <span className='text-[12px] ProxymaRegular 768px:pr-3 pr-1
                text-[#242424]'>{Number(totalSum).toFixed(2)}<strong className='text-[12px] ProxymaRegular'>৳</strong></span>
            </div>
            <div className="mt-[10px] py-3 1280px:py-2 1280px:mt-0 flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <h5 className='text-[#242424] text-[12px] ProxymaSemiBold capitalize 768px:pl-4 pl-1'>
                 delivery charges :</h5>
              <span className='text-[12px] ProxymaRegular 768px:pr-3 pr-1
                text-[#242424]'>{DeliveryCharge.toFixed(2)}<strong className='text-[12px] ProxymaRegular'>৳</strong></span>
            </div>
             <div className="mt-[10px] py-3 1280px:py-2 1280px:mt-0 flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <h5 className='text-[#242424] text-[12px] ProxymaSemiBold capitalize 768px:pl-4 pl-1'>total order amount :</h5>
              <span className='text-[12px] ProxymaRegular 768px:pr-3 pr-1
                text-[#242424]'>{Number(totalSum+DeliveryCharge).toFixed(2)}<strong className='text-[12px] ProxymaRegular'>৳</strong></span>
            </div>
           
                  <div className={`${partialCod?"openPcod":"closePcod"} overflow-hidden`}>
                    <div className="mt-[10px] py-3 1280px:py-2 1350px:mt-0 flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <h5 className='text-[#242424] text-[12px] ProxymaSemiBold capitalize 768px:pl-4 pl-1'>Remaining Amount to Pay in COD :</h5>
              <span className='text-[12px] ProxymaRegular 768px:pr-3 pr-1
                text-[#242424]'>{Number(afterConfirmationTotal).toFixed(2)}<strong className='text-[12px] ProxymaRegular'>৳</strong></span>
            </div>
                  <div className="mt-[10px] py-3 1280px:py-2 1350px:mt-0 flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <h5 className='text-[#242424] text-[12px] ProxymaSemiBold capitalize 768px:pl-4 pl-1'>for order confirmation :</h5>
              <span className='text-[12px] ProxymaRegular 768px:pr-3 pr-1
                text-[#007bc4]'>{Number(forcodorderconfirmation).toFixed(2)}<strong className='text-[12px] ProxymaRegular'>৳</strong></span>
            </div></div>
            
              
            {/* <div className="mt-[10px] pt-3 1280px:pt-2 1280px:mt-0 flex items-center justify-between">
              <h5 className='text-[#242424] 768px:text-[18px] 1280px:text-[14px] 1350px:text-[11px] text-[17px] font-[500] capitalize 768px:pl-4 pl-1'>
                Estimated Delivery Date:  </h5>
              <span className='768px:text-[18px] text-[16px] 1280px:text-[14px] 1350px:text-[11px] font-[500] 768px:pr-3 pr-0
                text-[#f85606]'>December 23, 2023</span>
            </div> */}
        </div>
            { fullPayment && 
          <div className={`${fullPayment?"openFullPayment":"closeFullPayment"}`}>
          <div className="300px:mt-[5px] 768px:mt-[5px] flex items-center 300px:gap-[15px] gap-[5px] 1280px:mt-0 py-3 1280px:py-1 px-4 1350px:px-3">
  
          <div className="flex items-center ">
          <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
           outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px]' checked={paymentButton}
           onClick={()=>{setPaymentButton(!paymentButton);setPartialPaymentButton(false);setPartialCod(false)}}/>
          <img src={bkash} alt="" className='object-contain w-[40px]  1350px:w-[70px] 1350px:h-[20px] mt-[5px] 1280px:mt-0'/>
          </div>
          <div className="flex items-center ">
          <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
           outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' 
           onClick={()=>{}} disabled/>
          <img src={nogod} alt="" className='object-contain w-[40px]  1350px:w-[60px] 1350px:h-[15px] mt-[5px] 1280px:mt-0'/> 
          </div>
          <div className="flex items-center ">
          <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
           outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' 
           onClick={()=>{}} disabled/>
          <img src={rocket} alt="" className='object-contain w-[40px]  1350px:w-[50px] 1350px:h-[15px] mt-[5px] 1280px:mt-0'/> 
          </div>
          <div className="flex items-center">
          <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
           outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' 
           onClick={()=>{}} disabled/>
          <img src={credit} alt="" className='object-contain w-[40px] 1350px:w-[40px] 1350px:h-[25px] mt-[5px] 1280px:mt-0'/> 
          </div>
        </div>
          <div className={`${paymentButton?"openButton":"closeButton"} px-3 1350px:px-2 py-2 1280px:py-1 border-t border-[rgba(0,0,0,0.2)] 
          flex flex-col items-center overflow-hidden`}>
            {/* <p className='font-[400] text-[8px] text-[#242424] ml-[20px] mt-[10px] 1350px:mt-[5px]'>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p> */}
            <button type='submit' className='w-[60%] h-[35px] 1350px:h-[30px] 1280px:w-[50%] bg-[#e14877] border-[1px] border-[#e14877] text-[#fff] my-[15px] 1280px:my-[5px]
             ProxymaSemiBold rounded-sm capitalize text-[12px] text-center'
             onClick={()=>{handleSubmit(fullPayment)}}>pay now (<span className=' ProxymaSemiBold text-[12px]'>
              {Number(totalSum+DeliveryCharge).toFixed(2)}<strong className='text-[12px] ProxymaSemiBold'>৳</strong></span>)</button>
          </div></div>  
            }
        <div className=" 1280px:py-0 768px:px-4 1350px:px-3 px-2">

           <div className="300px:mt-[10px] 1350px:mt-0 768px:px-[2] px-0 1350px:pt-[10px] flex items-center">
           <input type="checkbox" className='w-[15px]  h-[15px] 1350px:h-[12px] 1350px:w-[12px] cursor-pointer 300px:mb-1 768px:mb-0 768px:pt-[5px] mr-[10px] 
           outline-none border border-[rgba(0,0,0,0.2)] 1350px:mb-[5px]' checked={partialPaymentButton}
           onClick={()=>{setPartialCod(!partialCod);setPartialPaymentButton(!partialPaymentButton);setPaymentButton(false);
            setFullPayment(fullPayment ? false : true); setPaymentButton(true)}}/>
           <label className='text-[11px] text-[#242424] ProxymaSemiBold '> CASH ON DELIVERY / PARTIAL COD {"  "}
           <span className='text-[11px] ProxymaRegular text-[#e14877]'>(*** for prevent fake order)</span></label>
           </div>
          
           {
            partialCod && (
              <div className="300px:mt-[10px] 1350px:mt-0 text-center border-[1px] border-[rgb(128,128,128,0.3)] p-[3px] rounded-[16px]">
                <span className='ProxymaBold text-[orangered] text-[12px]'>Notice :</span>
                <span className='ProxymaSemiBold text-[#242424] text-[10px] ml-[5px]'>{partialMessage[0]?.partial_cod_message_for_checkout}</span>
              </div>
            )
           }
           
        </div>

        <div className={`${partialPaymentButton?"openButton2":"closeButton2"} px-2 1350px:px-2 py-1 1350px:py-[2px] 
          flex flex-col items-center `}>
                      <div className="mt-[5px] flex items-center 300px:gap-[15px] 768px:gap-[5px] 1280px:mt-0 py-1 1280px:py-0 px-4 1350px:px-3 border-b border-[rgba(0,0,0,0.2)] ">
  
                <div className="flex items-center ">
                <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
                outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' checked={partialPaymentButton}
                onClick={()=>{setPaymentButton(!partialPaymentButton);setPartialPaymentButton(false);setPartialCod(false)}}/>
                <img src={bkash} alt="" className='object-contain w-[40px]  1350px:w-[70px] 1350px:h-[20px] mt-[5px] 1280px:mt-0'/>
                </div>
                <div className="flex items-center ">
                <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
                outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px]' 
                onClick={()=>{}} disabled/>
                <img src={nogod} alt="" className='object-contain w-[40px]  1350px:w-[60px] 1350px:h-[15px] mt-[5px] 1280px:mt-0'/> 
                </div>
                <div className="flex items-center ">
                <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
                outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' 
                onClick={()=>{}} disabled/>
                <img src={rocket} alt="" className='object-contain w-[30px]  1350px:w-[50px] 1350px:h-[15px] mt-[5px] 1280px:mt-0'/> 
                </div>
                <div className="flex items-center">
                <input type="radio" className='w-[18px] h-[18px] 1350px:w-[10px] 1350px:h-[10px] cursor-pointer pt-[5px] mt-[5px] 1280px:mt-0
                outline-none border border-[rgba(0,0,0,0.2)] 300px:mr-[5px] ' 
                onClick={()=>{}} disabled/>
                <img src={credit} alt="" className='object-contain w-[40px]  1350px:w-[40px] 1350px:h-[25px] mt-[5px] 1280px:mt-0'/> 
                </div>
              </div>
            {/* <p className='font-[400] text-[8px]  text-[#242424] ml-[20px] mt-[10px] 1350px:mt-[5px]'>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p> */}
            <button type='submit' className='w-[60%] h-[35px] 1350px:h-[30px] 1280px:w-[50%] bg-[#e14877] border-[1px] border-[#e14877] text-[#fff] my-[15px] 1280px:my-[5px]
             ProxymaSemiBold rounded-sm capitalize text-[12px] text-center'
             onClick={()=>{handleSubmit(fullPayment)}}>pay now (<span className=' ProxymaSemiBold text-[12px]'>
              {Number(forcodorderconfirmation).toFixed(2)}<strong className='text-[12px] ProxymaSemiBold'>৳</strong></span>)</button>
          </div> 

      </div>
      </div>
      </div>
  )
}

export default CheckOutPage

// Everything is fine in the above code, but if the shipping address is clicked on add address, fill up the form and place the order, then the user's previous address is updated but the new address is not created. How to solve this problem?