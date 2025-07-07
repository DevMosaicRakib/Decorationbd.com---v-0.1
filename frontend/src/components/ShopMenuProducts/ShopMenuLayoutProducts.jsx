import { Link } from "react-router-dom";
import Styles from "../../Styles/Styles"
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { FaOpencart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import "./ShopMenu.scss";
import QuickView from "../QuickView/QuickView";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import label from '../../Assets/img/label.png'
import { CiShoppingCart } from "react-icons/ci";

const ShopMenuLayoutProducts = ({data,open,setOpen,autoclose,deviceCookie,isModalOpen,setIsModalOpen,setSameDay}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const [selectedProduct,setSelectedProduct] = useState(null)
    const minQty = data?.min_quantity ? parseInt(data?.min_quantity) : 1;
    const totalStock = data?.total_stock ? parseInt(data?.total_stock) : null;
  
    // Find the cart item that matches the product name
    const cartItem = cartItems?.find((item) => item.products.name === data?.name);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
  
    // Determine the initial count
    const initialCount =
      cartQuantity >= totalStock ? 0 : minQty > totalStock ? totalStock : cartQuantity && minQty>(totalStock-cartQuantity)? (totalStock-cartQuantity) : minQty;
  
    const [count, setCount] = useState(initialCount);
  
    useEffect(() => {
      if (cartQuantity >= totalStock) {
        setCount(0);
      } else {
        setCount( minQty > totalStock ? totalStock : cartQuantity && minQty>(totalStock-cartQuantity)? (totalStock-cartQuantity) : minQty);
      }
    }, [data, cartQuantity, totalStock]);
  
    const decrementQuantity = () => {
      if (count > minQty && count > 0) {
        setCount(count - 1);
      }
      else{
        toast.error("Sorry! You can't add to cart below this quantity..",{
          autoClose:1000
        })
      }
    };
  
    const incrementQuantity = () => {
      if (cartQuantity >= totalStock || count >= (totalStock-cartQuantity)) {
        toast.error("Sorry! This Product is Out of Stock now..", {
          autoClose: 1000,
        });
      } else if (totalStock === null || count < totalStock) {
        setCount(count + 1);
      }
    };
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
    const [addItemToCart] = useAddItemToCartMutation();
    const {access_token} = getToken()
    const handleAddToCart = async () => {
      try {
        if (count !== 0) {
          if (activeVariant) {
          
            if (access_token) {
              const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.typeId,quantity: count });
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
                if (response.error) {
                  toast.error(response.error.data.error,{
                    autoClose:1000
                  })
                }
              }
            } else {
              const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.typeId, quantity: count ,device:deviceCookie});
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
                if (response.error) {
                  toast.error(response.error.data.error,{
                    autoClose:1000
                  })
                }
              }
            }
    
          } else {
            toast.error('Please Select an Variant !',{
              autoClose:autoclose
            })
          }
        }
        else{
          toast.error("Sorry! This Product is Out of Stock now..", {
            autoClose: 1000,
          });
        }
  
  
  
  
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    };
  
    useEffect(() => {
      if (!open) {
          setSelectedProduct(null); // Reset selected product when modal is closed
      }
    }, [open]);
    // const product_name = d.replace(/\s+/g,"-");
    return(
      <div className="flex items-center gap-[30px] w-[100%] rounded-sm shadow-sm shadow-[gray] relative">
        <div className="absolute top-[-14px] left-0 z-[1]">
        <div className="relative">
          <img src={label} className='w-[45px] h-[85px] z-[9]' />
            <span className='absolute top-[14px] left-[8px] text-center flex flex-col items-center justify-start 
            text-[#fff] ProxymaBold text-[10px]'><span>{Math.floor(
              (activeVariant.price - activeVariant.discountPrice)
            )} ৳</span> <span>OFF</span>  </span>
        </div>
      </div>
         <div>
        
        <div className=" 1280px:h-[140px] 1280px:w-[140px] overflow-hidden  relative group">
        <Link to={`/product/${d}`}>
          <img src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images} alt="" className='w-full h-full 1280px:p-[1px] object-cover 
          group-hover:scale-[1.1] transition-all duration-[0.8s] delay-0 ease-in'/>
          </Link>
          <span className='quickView5 absolute  hidden 
           1350px:group-hover:block'title='Quick View'
           onClick={()=>{handleQuickView(data.id)}}><IoIosSearch size={18}/></span>
           {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />
                ) : null}
        </div>
   
        </div>
        <div className="flex flex-col  gap-[10px]">
          <div className="pb-[5px] pl-2">
          <Link to={`/product/${d}`}>
          <h3 className='ProxymaSemiBold text-[13px] text-[#242424]'>{data.name}</h3>
          </Link>
          </div>
           <div className="flex  pl-2 items-center gap-[60px]">
      
            {data?.stock === 'Out Of Stock' ? (
                          <div className="flex items-center gap-[1px]">
                          <span className='text-[10px]'></span><GoDotFill className='text-[red] text-[10px]'/>
                          <span className='capitalize ProxymaRegular text-[red] 
                           text-[11px]'>{data.stock}</span>
                        </div>
                        ):(
                          <div className="flex items-center gap-[1px]">
                        <span className='text-[10px]'></span><GoDotFill className='text-[#007bc4] text-[10px]'/>
                        <span className='capitalize ProxymaSemiBold  
                         text-[12px] text-[#007bc4]'>{data.stock}</span>
                      </div>
                        )}
            <div className="flex  items-center">
                  <h4 className={` mr-[10px] text-[13px] ProxymaSemiBold text-[gray] line-through`}>
                    {activeVariant.price}
                    <strong className="text-[13px] ProxymaSemiBold">৳</strong>
                  </h4>
                  <h4 className={`text-[13.5px] ProxymaBold text-[#007bc4]`}>
                    {activeVariant.discountPrice}
                    <strong className="text-[13.5px] ProxymaBold">৳</strong>
                  </h4>
                </div>
           </div>
           <div className="flex items-center gap-[50px]">
           <div className={`${Styles.normal_flex} mt-3 pl-2 pr-3`}>
                  <button
                    className="py-[2px] rounded-[5px]
                             px-[10px] text-center text-white bg-[#007bc4] text-[13px]"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13.5px] ProxymaRegular">{count}</span>
                  <button
                    className="py-[2px] rounded-[5px]
                             px-[10px] text-center text-white bg-[#007bc4] text-[13px]"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>   

           <div className="pt-[10px]">
              <button className={`${data?.stock === 'Out Of Stock' ? 'disabled' : 'bg-[#242424] cursor-pointer'} w-[80px] flex items-center justify-center rounded-[5px]  gap-[10px] 
               text-white my-1 h-[40px] 1350px:w-[80px] 1350px:h-[32px]`} onClick={() => {
                          //  console.log('Stock status:', data?.stock); // Debug stock value
                           if (data?.stock === 'Out Of Stock') {
                             toast.error('Sorry! This product is out of stock now.', {
                               autoClose: autoclose || 3000, // Fallback to 3000ms if autoclose is undefined
                             });
                           } else {
                             handleAddToCart(count);
                           }
                         }}>
                <span className="ProxymaBold"><CiShoppingCart className='text-[15px] text-white font-[600]'/></span>
                <span className="ProxymaSemiBold text-[13px]">add</span> 
                </button>
           </div>
           </div>
     
        </div>
      </div>
    )
  }
  export default ShopMenuLayoutProducts;

  