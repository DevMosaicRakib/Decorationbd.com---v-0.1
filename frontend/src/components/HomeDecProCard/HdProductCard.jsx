import React, { useEffect, useState } from 'react'
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./HdProCard.scss";
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import label from '../../Assets/img/label.png'
const HdProductCard = ({data,open,setOpen,autoclose,deviceCookie}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [selectedProduct,setSelectedProduct] = useState(null)
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
  const [activeVariant, setActiveVariant] = useState({
    typeId: data?.variants[0]?.variant_type.id || null,
    value: data?.variants[0]?.value || null,
    price: data?.variants[0]?.price || null,
    discountPrice: data?.variants[0]?.discount_price || null,
    image: data?.variants[0]?.images[0]?.images || null
  });

  useEffect(()=>{
    setActiveVariant({
      typeId: data?.variants[0]?.variant_type.id || null,
      value: data?.variants[0]?.value || null,
      price: data?.variants[0]?.price || null,
      discountPrice: data?.variants[0]?.discount_price || null,
      image: data?.variants[0]?.images[0]?.images || null
    })
  },[data])
  const {access_token} = getToken()
  const handleAddToCart = async () => {
    try {
      if (activeVariant) {
        
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.typeId,quantity: 1 });
          console.log(response)
          if (response.data) {
            const productName = response.data.products.name;
            console.log('Product name:', productName);
        
            if (productName) {
              toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`,{
                autoClose:autoclose
              });
            } else {
              console.error('Product name not found');
            }
            refetch()
            // navigate('/cart')
          } else {
            console.error('Failed to add item to cart');
          }
        } else {
          const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.typeId, quantity: 1 ,device:deviceCookie});
          // console.log(response)
          if (response.data) {
            const productName = response.data.products.name;
            console.log('Product name:', productName);
        
            if (productName) {
              toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`,{
                autoClose:autoclose
              });
            } else {
              console.error('Product name not found');
            }
            refetch()
            // navigate('/cart')
          } else {
            console.error('Failed to add item to cart');
          }
        }

      } else {
        toast.error('Please Select an Variant !',{
          autoClose:autoclose
        })
      }




    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const handleQuickView = async (productId) => {
    if (!productId) {
        console.error("Product ID is undefined");
        return;
    }
    console.log(productId)
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}dbd/api/QuickView/${productId}`);
        console.log(result);
        setSelectedProduct(result.data);
        setOpen(true);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (!open) {
        setSelectedProduct(null); // Reset selected product when modal is closed
    }
  }, [open]);
    // const product_name = d.replace(/\s+/g,"-");
  return (
    <div className='w-full 768px:h-[260px] 1280px:h-[260px] h-[420px]
    300px:h-[300px] bg-white rounded-sm card-container2
    shadow-sm  768px:p-[2px] 1024px:p-2 1280px:p-[2px]  p-[5px] relative cursor-pointer'>
      <div className="absolute top-[-12px] left-[2px] z-[1]">
        <div className="relative">
          <img src={label} className='w-[45px] h-[85px] z-[9]' />
            <span className='absolute top-[14px] left-[8px] text-center flex flex-col items-center justify-start 
            text-[#fff] font-[900] text-[10px]'><span>{Math.floor(
              (activeVariant.price - activeVariant.discountPrice)
            )} ৳</span> <span>OFF</span>  </span>
        </div>
      </div>
      <div className="flex justify-end">
        </div>
        
            <div className='imgContainer2 bg-white overflow-hidden '>
            <Link to={`/product/${d}`}>
            <img src={process.env.REACT_APP_IMG_URL+data.product_imgs[0].images} alt="" className='img w-[130px] h-[130px] 
            300px:w-[155px] 300px:h-[155px] 768px:w-[130px] 768px:h-[130px]
            mx-auto  object-cover'/>
            </Link>
            <span className='quickView2'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
             {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
                ) : null}
            </div>
      
    
        <Link to={`/product/${d}`}>
          <h4 className='pb-2 font-[400] text-[#242424] pt-1 768px:ml-[5px] ml-[2px] text-[11px]'>
            {data.name.length>50 ? data.name.slice(0,40) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex flex-col items-center ml-[2px] gap-1 mr-1 justify-between overflow-hidden w-full'>
        <div className="stock2 text-[gray] flex items-center
         justify-between gap-[1px] 768px:mr-[15px] 300px:mr-0 mr-[10px]">
            <span className='text-[8px]'>(</span><GiCheckMark className='text-[#1ebc75] text-[8px]'/>
            <span className='capitalize font-[400] text-[8px]'>{data.stock}</span><span className='text-[8px]'>)</span>
          </div>
          <div className="price2 text-[gray]  mr-[2px]">
          <span className="lineThroughPrice line-through text-[13.6px] font-[600] mr-[3px]">{activeVariant.price}
            <strong className='
             text-[13.6px] font-[600] font-Roboto'>৳</strong></span>

            <span className='text-[#1ebc75] font-[600] 
              text-[13.6px]'>{activeVariant.discountPrice}<strong 
            className=' text-[13.6px] font-[600] font-Roboto'>৳</strong></span>

          </div>
        </div>

        <div className="btn2 ">
          <div className="add-to-cart2 " onClick={handleAddToCart}>add to cart</div>
          {/* <div className="cart-icon2"><FaOpencart/></div> */}
        </div>
    </div>
  )
}

export default HdProductCard
