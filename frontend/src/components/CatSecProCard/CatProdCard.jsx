import React, { useEffect, useState } from 'react';
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GoDotFill } from "react-icons/go";
import { CiShoppingCart } from "react-icons/ci";
import "./CartSecProCard.scss";
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import label from '../../Assets/img/label.png'
import ProductPopupForCart from '../ProductPopupForCart/ProductPopupForCart';
const CatProdCard = ({data,open,setOpen,autoclose,deviceCookie,isModalOpen, setIsModalOpen,setSameDay,cardBgColor,cardProductTitleAndPriceColor}) => {
  // console.log(data)
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
  const [singlePopup, setSinglePopUp] = useState(false)
  const [selectedProduct,setSelectedProduct] = useState(null)
  const [imgLoad,setImageLoad] = useState(false);

  const [activeVariant, setActiveVariant] = useState({
    typeId: data?.variants[0]?.id || null,
    value: data?.variants[0]?.value || null,
    price: data?.variants[0]?.price || null,
    discountPrice: data?.variants[0]?.discount_price || null,
    image: data?.variants[0]?.images[0]?.images || null
  });

  useEffect(()=>{
    setActiveVariant({
      typeId: data?.variants[0]?.id || null,
      value: data?.variants[0]?.value || null,
      price: data?.variants[0]?.price || null,
      discountPrice: data?.variants[0]?.discount_price || null,
      image: data?.variants[0]?.images[0]?.images || null
    })
  },[data])
  // console.log(data.variants)

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

  const handleSinglePopup = async (productId) => {
    if (!productId) {
        console.error("Product ID is undefined");
        return;
    }
    console.log(productId)
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}dbd/api/QuickView/${productId}`);
        console.log(result);
        setSelectedProduct(result.data);
        setSinglePopUp(true)
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (!open) {
        setSelectedProduct(null); // Reset selected product when modal is closed
    }
  }, [open]);
  // console.log(data.product_imgs[0].images)
  useEffect(() => {
    const img = new Image();
    img.src = process.env.REACT_APP_IMG_URL + data.product_imgs[0].images;
    img.onload = () => setImageLoad(true);
  }, [data.product_imgs]);
  console.log(cardBgColor)
    // const product_name = d.replace(/\s+/g,"-");
  return (
    <div className={`300px:w-[100%] 300px:h-[250px] 768px:w-[170px] 768px:h-[250px] 1024px:w-[180px] 1024px:h-[255px] 1350px:h-[250px] 1350px:w-[170px] 1280px:w-[170px] 1280px:h-[250px]
     rounded-sm card-container3 shadow-[rgba(0,0,0,0.3)]
    shadow-sm relative cursor-pointer bg-[${cardBgColor || 'white'}]`}>
      <div className="absolute top-[-11px] left-[5.5px] z-[1]">
        <div className="relative">
          <img src={label} className='w-[45px] h-[85px] z-[9]' />
            <span className='absolute top-[14px] left-[8px] text-center flex flex-col items-center justify-start 
           text-[#fff] ProxymaExtrabold text-[10px]'><span>{Math.floor(
              (activeVariant.price - activeVariant.discountPrice)
            )} ৳</span> <span>OFF</span>  </span>
        </div>
      </div>
      <div className="flex justify-end">
        </div>
        
            <div className='imgContainer3 bg-white overflow-hidden'>
            <Link to={`/product/${d}`}>
            {imgLoad ? (
              <img
                src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images}
                alt=""
                className="img 300px:h-[170px] 1024px:h-[170px] 300px:w-[100%] 1280px:h-[170px] object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center 300px:h-[170px]">
                <div className="w-[15px] h-[15px] border-2 bg-[gray] border-[gray] rounded-full animate-pulse"></div>
              </div>
            )}
            
             </Link>
             <span className='quickView3'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
            {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />
                ) : null}

            {data?.stock === 'Out Of Stock' ? (
              <div className="stock3 flex items-center gap-[1px] absolute bottom-0 right-[10px]">
              <span className='text-[10px]'></span><GoDotFill className='text-[red] text-[10px]'/>
              <span className='capitalize ProxymaRegular text-[red] 
               text-[11px]'>{data.stock}</span>
            </div>
            ):(
              <div className="stock3 flex items-center gap-[1px] absolute bottom-0 right-[10px]">
            <span className='text-[10px]'></span><GoDotFill className='text-[#0375b8] text-[10px]'/>
            <span className='capitalize ProxymaBold  
             text-[12px] text-[#0375b8]'>{data.stock}</span>
          </div>
            )}
                
            </div>
       
    
        <Link to={`/product/${d}`}>
          <h4 className={`pb-[5px] ProxymaSemiBold 768px:pt-[3px] pt-[2px] 
          768px:ml-[10px] 1280px:ml-[5px] 1500px:ml-[10px] ml-[5px] text-[12.5px] text-[${cardProductTitleAndPriceColor || '#242424'}]`}>
            {data.name.length>40 ? data.name.slice(0,40) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex items-center justify-between
         stockAndPrice px-[5px]
         overflow-hidden w-full'>
        

          {/* <div className="flex items-center justify-between"> */}
          <div className={`price3 mr-[5px] 1280px:mr-[1px] 1500px:mr-[5px] mb-[10px] 768px:mb-0
            text-[${cardProductTitleAndPriceColor || 'gray'}]`}>

          <span className="lineThroughPrice line-through ProxymaSemiBold text-[12.3px] mr-[5px]">{Math.floor(activeVariant.price)}
          <strong className='text-[12.3px] ProxymaSemiBold'>৳</strong></span>

            <span className='text-[#0375b8] ProxymaBold 
             text-[13.5px]'>{Math.floor(activeVariant.discountPrice)}<strong 
            className='text-[13.5px] ProxymaBold'>৳</strong></span>


          </div>

          <div
          className={`${data?.stock === 'Out Of Stock' ? 'disabled' : 'bg-[#0375b8]'} btn3 flex items-center gap-[2px] rounded-[5px] px-[3px] py-[2px]`}
          onClick={() => {
            console.log('Stock status:', data?.stock); // Debug stock value
            if (data?.stock === 'Out Of Stock') {
              toast.error('Sorry! This product is out of stock now.', {
                autoClose: autoclose || 3000, // Fallback to 3000ms if autoclose is undefined
              });
            } else {
              handleSinglePopup(data.id);
            }
          }}
          
          
        >
          <CiShoppingCart className="text-[13px] text-white ProxymaSemiBold" />
          <div className="add-to-cart3 ProxymaSemiBold text-white text-[13px]">add</div>
        </div>
        </div>
        {
          singlePopup && selectedProduct ? (
            <ProductPopupForCart singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
          ) : null
        }
        
    </div>
  )
}

export default CatProdCard
