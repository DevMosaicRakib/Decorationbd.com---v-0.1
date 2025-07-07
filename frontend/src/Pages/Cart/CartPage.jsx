import React, { useEffect, useState } from 'react'
import Styles from "../../Styles/Styles"
import "./CartPage.scss";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TiShoppingCart } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { MdLocalOffer } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import { toast } from 'react-toastify';
import { BsCartX } from 'react-icons/bs';


const CartPage = ({autoclose,shipping_charge,deviceCookie,isModalOpen, setIsModalOpen,setSameDay}) => {
  // console.log(shipping_charge)
  const { access_token } = getToken();
  const [quantities, setQuantities] = useState({});
  const [couponCode, setCouponCode] = useState('')
  const dispatch = useDispatch();
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  console.log(cartItems);
  const totalCartItems = cartItems?.[0]?.total_cartitems;
  // const totalPrice = cartItems[0]?.total_price;

  const [checkedItems, setCheckedItems] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const initialCheckedState = {};
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialCheckedState[item.id] = item.is_checked; 
        initialQuantities[item.id] = item.quantity; // Initialize quantities from backend
      });
      setCheckedItems(initialCheckedState);
      setQuantities(initialQuantities);
  
      const initialTotal = cartItems[0]?.total_price;
      setTotalSum(initialTotal);
    }
  }, [cartItems]);

  const handleCheckboxChange = async (itemId, subTotal) => {
    const updatedCheckedItems = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updatedCheckedItems);
  
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
  
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}dbd/api/cartitems/${itemId}/update_is_checked/`,
        { is_checked: updatedCheckedItems[itemId] },
        { headers }
      );
  
      const updatedCartItem = response.data.data;
  
      refetch();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  
    // Recalculate the total sum based on checked items
    const newTotalSum = Object.keys(updatedCheckedItems).reduce((sum, key) => {
      if (updatedCheckedItems[key]) {
        const item = cartItems.find(item => item.id === parseInt(key));
        return sum + item.sub_total;
      }
      return sum;
    }, 0);
  
    setTotalSum(newTotalSum);
  };

  const allUnchecked = Object.keys(checkedItems).length === 0 || Object.values(checkedItems).every(checked => !checked);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
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

  const handleDeleteItem = async (itemId) => {
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

      await axios.delete(
        process.env.REACT_APP_API_URL + `dbd/api/cartitems/${itemId}/cartitem_delete/`,
        { headers }
      );
  
      refetch(); // Re-fetch the cart items after deletion
    
      // Update the state to remove the deleted item
      // setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== itemId));
    
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
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
        `${process.env.REACT_APP_API_URL}dbd/api/cartitems/add_coupon/`,
        { coupon: couponCode },
        { headers }
      );
  
      setTotalSum(response.data.total_price);
      toast.success('Coupon code added successfully', {
        autoClose: autoclose
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error?.response?.data?.msg, {
        autoClose: autoclose
      });
    }
  };

  const updateQuantity = async (itemId, newQuantity, minQty, maxQty) => {
    // Ensure the quantity stays within limits
    if (newQuantity < minQty) {
      newQuantity = minQty;
    }
    if (maxQty !== null && newQuantity > maxQty) {
      newQuantity = maxQty;
    }
  
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : undefined,
        'device': deviceCookie
      };
  
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device'];
      }
  
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}dbd/api/cartitems/${itemId}/update_item/`,
        { quantity: newQuantity },
        { headers }
      );
  
      if (response.status === 200) {
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          [itemId]: newQuantity
        }));
      }
  
      refetch();
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

  // useEffect(() => {
  //   // Check if any product in the cart has same_day_delivery set to true
  //   const hasSameDayDelivery = cartItems.some(item => item?.products?.same_day_delivery);
  //   setSameDay(hasSameDayDelivery);
  // }, [cartItems]);
  const navigate = useNavigate();
  const[ischecked,setIsChecked] = useState(true);
  return (
    <div className={` 1350px:w-[88%] 1280px:w-[95%] 1024px:w-[94%] w-[99%] mx-auto`}>
      <div className="flex items-center flex-col 1280px:flex-row 1280px:items-start w-full 1280px:mt-[50px] 1350px:mt-[30px] 1280px:justify-center
       mt-[100px] gap-[20px]">
      <div className={`${cartItems?.length ? "1280px:h-[calc(100vh-170px)] h-[300px]":"h-full"} 1500px:w-[56%] 1280px:w-[60%] 768px:w-[80%] w-[98%] overflow-y-scroll overflow-x-hidden
      scroll-smooth  no-scrollbar `}>

       
        <div className="mt-0">
          <h1 className='capitalize font-[500] 768px:text-[20px] text-[16px] text-[#242424] mb-[30px] 768px:mb-[40px]'>
            <TiShoppingCart  className='inline  text-[30px] ProxymaSemiBold'/> shopping cart</h1>
              <div className='hidden 768px:block'>
              {!cartItems?.length ? (
              <div className="empty-cart ">
               <BsCartX/>
               <span className='ProxymaRegular text-[13px]'>No Products in the cart.</span>
               <button className="return-cta ProxymaSemiBold" onClick={()=>navigate('/shop')}>return to shop</button>
              </div>
            ):(
              <table className='w-full mt-[20px] hidden 768px:block'>
              <thead className='w-full'>
                <tr className='w-full border-b border-[rgba(0,0,0,0.2)]'>
                  <th className='1500px:w-[50%] 1280px:w-[30%] 768px:w-[40%] w-[30%] 
                  text-center ProxymaSemiBold text-[13px] 1500px:px-[150px] 1280px:px-[90px]
                  768px:px-[40px] px-[30px] pb-[10px]'>PRODUCT</th>
                  {/* <th className='w-[10%] text-center ProxymaSemiBold text-[13px] px-[20px] pb-[10px]'>VARIANT</th> */}
                  <th className='w-[10%] text-center ProxymaSemiBold text-[13px] px-[20px] pb-[10px]'>PRICE</th>
                  <th className='w-[20%] 1350px:w-[4%] text-center ProxymaSemiBold text-[13px] px-[20px] 1350px:px-[10px] pb-[10px]'>QUANTITY</th>
                  <th className='w-[10%] text-center ProxymaSemiBold text-[13px] px-[10px] pb-[10px]'>SUBTOTAL</th>
                </tr>
              </thead>

              {cartItems?.map((item) => {
                        // Find the matching variant based on the item's variant
                        const matchingVariant = item?.products?.variants?.find(
                          (variant) => variant.value === item.variant
                        );
                        // console.log(matchingVariant)
                        return (
                          <tbody key={item.id}>
                            <tr className='w-full border-b border-[rgba(0,0,0,0.2)]'>
                              <td className='flex items-center 768px:py-3 py-1'>
                                <input
                                  type="checkbox"
                                  className='h-[12px] w-[12px] mr-[5px] cursor-pointer'
                                  checked={!!checkedItems[item.id]}
                                  required
                                  onChange={() => handleCheckboxChange(item.id, item.sub_total)}
                                />
                                <img
                                  src={
                                    process.env.REACT_APP_IMG_URL +
                                    item?.products?.product_imgs[0]?.images
                                  }
                                  alt=""
                                  className='w-[50px] h-[50px] object-cover'
                                />
                                <h4 className='ProxymaSemiBold text-[12px] text-[#242424] 768px:px-[6px] px-[1px]'>
                                  {/* {item?.products?.name.length > 50
                                    ? item?.products?.name.slice(0, 50) + "..."
                                    : item?.products?.name} */}
                                    {item?.products?.name ? `${item.products.name} - (${matchingVariant?.value})` : ''}

                                </h4>
                              </td>
                              {/* <td className='text-center 1500px:px-[10px] 1280px:px-[5px] px-[5px] ProxymaRegular text-[13px] text-[#242424] py-3'>
                                {item.variant || 'N/A'}
                              </td> */}
                              <td className='text-center mx-[15px] ProxymaRegular text-[13px] text-[#242424] py-3'>
                                {matchingVariant
                                  ? Number(matchingVariant.discount_price).toFixed(2)
                                  : 'N/A'}{" "}
                                <strong className='text-[13px] font-Roboto'>৳</strong>
                              </td>
                              <td className='text-center px-[45px] 1280px:px-[35px] 1500px:px-[45px] 1350px:px-[50px] font-normal text-[13px] text-[#242424] py-3'>
                                <div className='flex items-center 1280px:gap-[15px] gap-[10px]'>
                                  <button
                                    className='h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px] bg-[#007bc4] text-white text-center border-none outline-none rounded-[3px]'
                                    onClick={() => decrementQuantity(item.id, parseInt(item.products.min_quantity) || 1)}
                                  >
                                    -
                                  </button>
                                  <span className='text-[13px] ProxymaRegular'>{quantities[item.id]}</span>
                                  <button
                                    className='h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px] bg-[#007bc4] text-white text-center border-none outline-none rounded-[3px]'
                                    onClick={() => incrementQuantity(item.id, item.products.total_stock ? parseInt(item.products.total_stock) : null)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className=' text-center px-[10px] 1280px:px-[5px] 1500px:px-[10px] ProxymaRegular text-[13px] text-[#242424] py-3'>
                                {Number(item?.sub_total).toFixed(2)}{" "}
                                <strong className='text-[13px] ProxymaRegular'>৳</strong>
                              </td>
                              <td className='text-center px-[50px] pb-[5px]'>
                                <RxCross2
                                  className='text-[red] ProxymaBold ml-[5px] text-[14px] cursor-pointer'
                                  onClick={() => handleDeleteItem(item.id)}
                                />
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}


            </table>
            )}
              </div>

            <div className='block 768px:hidden'>
            {!cartItems?.length ? (
              <div className="empty-cart">
              <BsCartX/>
              <span className='ProxymaRegular text-[13px]'>No Products in the cart.</span>
              <button className="return-cta ProxymaSemiBold" onClick={()=>navigate('/shop')}>return to shop</button>
             </div>
            ):(
              <>
                {cartItems?.map((item) => {
                  // Find the matching variant based on the item's variant
                  const matchingVariant = item?.products?.variants?.find(
                    (variant) => variant.value === item.variant
                  );
                  console.log(matchingVariant)
                  return(
                <div className='flex items-center gap-[5px] 768px:hidden w-full relative
                shadow shadow-[rgb(128,128,128,0.6)] py-[2px] rounded-sm mb-[10px]' key={item.id}>
                  <div className='absolute top-1 left-1'>
                  <input type="checkbox" className='h-[14px] w-[14px]' checked={!!checkedItems[item.id]}  required
                   onChange={() => handleCheckboxChange(item.id, item.sub_total)}/>
                  </div>
                <div className="w-[30%] overflow-hidden">
                  <img src={
                                    process.env.REACT_APP_IMG_URL +
                                    item?.products?.product_imgs[0]?.images
                                  } alt="" className='h-[100px] w-[100px] object-cover'/> 
                </div>
                <div className="w-[68%]">
                  <div className="flex flex-col gap-[5px] justify-center pr-[3px]">
                    <div className="flex  justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='w-[90%] text-[13.4px] text-[#242424] ProxymaSemiBold capitalize px-[2px]'>{item?.products?.name ? `${item.products.name} - (${matchingVariant?.value})` : ''}
                      </h5>
                      <RxCross2 className='inline-block text-[16px] text-[orangered]'/>
                    </div>
                    {/* <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='text-[12.8px] text-[#242424] uppercase ProxymaSemiBold'>{matchingVariant?.variant_type?.typeName}</h5>
                      <p className='uppercase ProxymaRegular text-[13px] text-[#242424]'>{item.variant || 'n/a'}</p>
                    </div> */}
                    <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='uppercase ProxymaSemiBold text-[12.7px] text-[#242424] '>price</h5>
                      <p className='ProxymaRegular text-[13px] text-[#242424] pr-[3px]'>{matchingVariant
                                  ? Number(matchingVariant.discount_price).toFixed(2)
                                  : 'N/A'}{" "} <strong className='text-[13px] ProxymaRegular'>৳</strong></p> 
                    </div>
                    <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='ProxymaSemiBold text-[12.7px] text-[#242424] uppercase'>quantity</h5>
                      <div className='flex items-center gap-[10px]'>
                    <button className='h-[25px] w-[25px] bg-[#007bc4] text-white text-center border-none outline-none rounded-[3px]'
                    onClick={() => decrementQuantity(item.id, parseInt(item.products.min_quantity) || 1)}
                    >-</button>
                      <span className='text-[13px] ProxymaRegular'>{quantities[item.id]}</span>
                      <button className='h-[25px] w-[25px] bg-[#007bc4] text-white text-center border-none outline-none rounded-[3px]'
                      onClick={() => incrementQuantity(item.id, item.products.total_stock ? parseInt(item.products.total_stock) : null)}>+</button>
                    </div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <h5 className='ProxymaSemiBold text-[12.7px] text-[#242424] uppercase'>subtotal</h5>
                      <p className='text-[13px]  ProxymaRegular pr-[3px] text-[#242424]'>
                      {Number(item?.sub_total).toFixed(2)} <strong className='text-[13px] ProxymaRegular'>৳</strong></p>
                    </div>
                  </div>
                </div>
              </div>)
               })}
              </>
            )}
            </div>


        </div>
      </div>


      <div className="1280px:w-[35%] 1350px:w-[28%] 768px:w-[80%] w-[98%] border-[2px] 
      mt-0 1280px:mt-11 shadow 
      768px:py-[10px] 1350px:py-[4px] py-[6px] shadow-[rgb(128,128,128,0.6)] relative
      border-[rgba(0,0,0,0.2)] outline-none 1280px:ml-[50px] mb-[50px] 768px:mb-0">
        <div className="w-full 768px:p-3 1350px:p-1 p-1 sticky top-0">
          <h1 className=' 1350px:text-[20px] text-[16px] text-[#007bc4] 
          ProxymaSemiBold capitalize px-3 768px:py-3 py-2 768px:my-[8px] my-[5px]'>cart summary</h1>
         <div className="border-b border-[rgba(0,0,0,0.2)] my-[10px] py-[10px]">
         <div className="flex items-center justify-between 768px:px-3 px-1">
            <h5 className='capitalize text-[13px] ProxymaSemiBold text-[#242424]'>subtotal :</h5>
           {checkedItems != null?(
             <span className='text-[13px] ProxymaRegular text-[#242424]
             '>{Number(totalSum).toFixed(2)}<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
           ):(
            <span className='text-[13px] ProxymaRegular text-[#242424]
            '>0.00<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
           )}
          </div>
          <div className="flex items-center justify-between 768px:px-3 px-1 py-[4px]">
            <h5 className='capitalize text-[13px] ProxymaSemiBold text-[#242424]'>delivery charges :</h5>
            {!allUnchecked ? (
              <>
              {DeliveryCharge ? (
                <span className='text-[13px] ProxymaRegular text-[#242424]
                '>{DeliveryCharge}<strong className='text-[13px] font-Roboto'>৳</strong></span>
              ):(
                <span className='text-[13px] ProxymaRegular text-[#242424]
              '>0.00<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
              )}
              </>
            ):(
              <span className='text-[13px] Proxymaregular text-[#242424]
              '>0.00<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
            )}
          </div>
          <div className="flex items-center justify-between 768px:px-3 px-1 py-[4px]">
           <input type="text" placeholder='Enter coupon code' value={couponCode} onChange={handleCouponInputChange}
           className='text-[10.6px] py-1 1350px:py-[3px] ProxymaRegular
           px-[10px] w-[52%] outline-none border border-[rgba(0,0,0,0.2)]'/>
           <button className='text-[12px] ProxymaSemiBold
           1350px:py-[3px] py-1 text-white uppercase w-[22%] 1350px:h-[24px] 300px:h-[30px] 
           text-center bg-[#007bc4]' onClick={handleApplyCoupon}>Apply</button>
          </div>
          {/* <div className="flex items-center justify-between 768px:px-3 px-1 py-[2px]">
            <h5 className='capitalize 768px:text-[18px] text-[16px] 1350px:text-[13px] font-[500] text-[#242424]'>Estimated Delivery Date :</h5>
            <span className='768px:text-[18px] text-[16px] 1350px:text-[12px] font-[500] text-[orangered]
            '>December 21, 2023</span>
          </div> */}
         </div>
         <div className="flex items-center justify-between 768px:px-3 px-1">
            <h3 className='capitalize text-[13px] ProxymaSemiBold text-[#242424]'>Total :</h3>
              {
                !allUnchecked?(
                  <>
              {DeliveryCharge ? (
                <span className='text-[13px] ProxymaRegular text-[#242424]
                '>{(Number(totalSum)+Number(DeliveryCharge)).toFixed(2)}<strong className='text-[13px] font-Roboto'>৳</strong></span>
              ):(
                <span className='text-[13px] ProxymaRegular text-[#242424]
                  '>{(Number(totalSum) + 0).toFixed(2)}<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
              )}
              </>
                ):(
                  <span className='text-[13px] ProxymaRegular text-[#242424]
                  '>0.00<strong className='text-[13px] ProxymaRegular'>৳</strong></span>
                )
              }
          </div>
          <div className="w-full 768px:px-4 px-1 text-center mb-[10px] mt-[50px]">
            <div onClick={()=>{navigate('/checkout')}}>
              <button className='768px:w-[50%] 1280px:w-[65%] 1350px:w-[70%] w-[70%] px-[10px] py-[6px] text-[12px]
              uppercase outline-none  rounded-sm ProxymaSemiBold
              bg-[#e14877] border-[1px] border-[#e14877] text-[#fff] font-[400]'>
                Checkout ({checkedItems&&cartItems?.length?(totalCartItems):0})
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
};


export default CartPage