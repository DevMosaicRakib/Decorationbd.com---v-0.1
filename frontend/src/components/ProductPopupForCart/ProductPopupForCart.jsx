import React, { useEffect, useRef, useState } from 'react'
import {RxCross1} from "react-icons/rx";
import {AiOutlineShoppingCart} from "react-icons/ai"
import { GiBuyCard } from "react-icons/gi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';

const ProductPopupForCart = ({data,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const quickViewRef = useRef(null);
    useEffect(() => {
      // Function to close the shopSideBar if clicked outside
      const handleClickOutside = (event) => {
        if (quickViewRef.current && !quickViewRef.current.contains(event.target)) {
            setSinglePopUp(false);
        }
      };
  
      // Add event listener to detect clicks outside
      document.addEventListener("mousedown", handleClickOutside);
  
      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [quickViewRef, setSinglePopUp]);

    useEffect(() => {
      const scrollContainer = scrollRef.current;

      // Custom scroll handler for horizontal scrolling
      const onWheel = (e) => {
          if (e.deltaY !== 0) {
              scrollContainer.scrollLeft += e.deltaY; // Adjust for horizontal scrolling
              e.preventDefault(); // Prevent default vertical scroll
          }
      };

      // Attach the event listener
      scrollContainer.addEventListener('wheel', onWheel);

      // Cleanup the event listener on component unmount
      return () => scrollContainer.removeEventListener('wheel', onWheel);
    }, []);
    const [activeVariant, setActiveVariant] = useState(() => {
      const firstVariant = data?.variants[0];
      return firstVariant
        ? {
            id: firstVariant.id, // Use variant.id
            typeId: firstVariant.variant_type.id,
            value: firstVariant.value,
            price: firstVariant.price || null,
            discountPrice: firstVariant.discount_price || null,
            image: firstVariant.images[0]?.images || null,
          }
        : null;
    });
    
    // Function to handle clicking on a variant value
    const handleVariantClick = (typeId, value) => {
      const selectedVariant = data?.variants.find(
        (variant) => variant.variant_type.id === typeId && variant.value === value
      );
      console.log(selectedVariant);
      if (selectedVariant) {
        setActiveVariant({
          id: selectedVariant.id, // Use variant.id
          typeId,
          value,
          price: selectedVariant.price || null,
          discountPrice: selectedVariant.discount_price || null,
          image: selectedVariant.images[0]?.images || null,
        });
      }
    };
    useEffect(() => {
      if (data?.variants?.length > 0) {
        const firstVariant = data?.variants[0];
    
        // Set the active variant to the first variant
        setActiveVariant({
                id: firstVariant.id, // Use variant.id
                typeId: firstVariant.variant_type.id,
                value: firstVariant.value,
                price: firstVariant.price || null,
                discountPrice: firstVariant.discount_price || null,
                image: firstVariant.images[0]?.images || null,
              }
            )
    
        // Set the selected image if it exists
        // if (activeVariant?.image) {
        //   setSelectedImg(process.env.REACT_APP_IMG_URL + activeVariant?.image);
        // }
      }
    }, [data]);
    const {access_token} = getToken();
    const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    console.log(cartItems)

    const [selectedImg,setSelectedImg] = useState(process.env.REACT_APP_IMG_URL + data?.product_imgs[0]?.images);
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
    
    const [addItemToCart] = useAddItemToCartMutation();

    if (!singlePopup) return null;

    
    const handleAddToCart = async () => {
      try {
        if (count !== 0) {
          if (activeVariant) {
          
            if (access_token) {
              const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.id,quantity: count });
              console.log(response)
              if (response.data) {
                const productName = response.data.products.name;
                console.log('Product name:', productName);
            
                if (productName) {
                  toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`,{
                    autoClose:autoclose
                  });
                } else {
                  if (response.error) {
                    toast.error(response.error.data.error,{
                      autoClose:1000
                    })
                  }
                }
                refetch()
                navigate('/cart')
              } else {
                if (response.error) {
                  toast.error(response.error.data.error,{
                    autoClose:1000
                  })
                }
              }
            } else {
              const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.id, quantity: count ,device:deviceCookie});
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
                navigate('/cart')
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
        console.log("Error adding item to cart:", error);
      }
    };

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(data?.description || "", 'text/html');
    const plainTextDescription = parsedHtml.body.textContent || "";

    const handleMouseMove = (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
    
      document.getElementById("imageZoom").style.setProperty("--zoom-x", `${x}%`);
      document.getElementById("imageZoom").style.setProperty("--zoom-y", `${y}%`);
    };
    
    const handleMouseOver = () => {
      document.getElementById("imageZoom").style.setProperty("--display", "block");
    };
    
    const handleMouseOut = () => {
      document.getElementById("imageZoom").style.setProperty("--display", "none");
    };
  return (
    <div className='bg-[#fff]'>
      {data?(
        <div className="fixed w-full h-screen top-0 left-0 
        bg-[#0000008f] z-50 flex items-center
        justify-center">
            <div ref={quickViewRef} className="relative w-[90%] 768px:w-[90%] 1024px:w-[80%] 1280px:w-[60%] 
            h-[85vh] overflow-y-scroll no-scrollbar 768px:h-[50vh] 1024px:h-[40vh] 1280px:h-[75vh] 
            bg-white rounded-md shadow-md p-4">
                <RxCross1 size={20} className="absolute right-3 top-3 z-50" 
                onClick={()=>setSinglePopUp(false)}/>

                <div className=" w-full 768px:flex justify-center items-center mt-[30px]">
                    
                      <div className='w-full 768px:w-[50%]'>

                {/* Main Product Image */}
                <div
                  id="imageZoom"
                  style={{
                    "--url": `url(${selectedImg})`,
                    "--zoom-x": "0%",
                    "--zoom-y": "0%",
                    "--display": "none",
                  }}
                  className="relative w-[280px] h-[280px] 768px:w-[300px] 768px:h-[300px] mx-auto md:mx-0 mb-[10px]"
                  onMouseMove={handleMouseMove}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <img
                    src={selectedImg}
                    alt="Product Image"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Scrollable Thumbnails for Product and Variant Images */}
                <div
                  style={{ width: "300px", overflowX: "scroll" }}
                  ref={scrollRef}
                  className="no-scrollbar 300px:mx-auto 768px:mx-0"
                >
                  <div style={{ display: "flex", gap: "5px", width: "max-content" }}>
                    {/* Show Product Images */}
                    {data?.product_imgs?.map((image, i) => (
                      <img
                        key={i}
                        src={process.env.REACT_APP_IMG_URL + image.images}
                        alt=""
                        onClick={() =>
                          setSelectedImg(process.env.REACT_APP_IMG_URL + image.images)
                        }
                        style={{
                          width: "55px",
                          height: "55px",
                          cursor: "pointer",
                          objectFit: "cover",
                          border: "1px solid rgba(0,0,0,0.2)",
                        }}
                      />
                    ))}

                    {/* Show Variant Images */}
                    {data?.variants?.map((variant) => (
                      <div key={variant.id} style={{ display: "flex", gap: "5px" }}>
                        {variant?.images?.map((variantImage, index) => (
                          <img
                            key={index}
                            src={process.env.REACT_APP_IMG_URL + variantImage.images}
                            alt={`variant-${variant.id}-${index}`}
                            onClick={() => {
                              // handleVariantClick(variant.variant_type.id, variant.value);
                              setSelectedImg(process.env.REACT_APP_IMG_URL + variantImage.images);
                            }}
                            style={{
                              width: "55px",
                              height: "55px",
                              cursor: "pointer",
                              objectFit: "cover",
                              border: "1px solid rgba(0,0,0,0.2)",
                            }}
                          />
                        ))}
                      </div>
                    ))}

                  </div>
                </div>

                        </div>




                    <div className='w-full 768px:w-[42%]  pl-[5px] pr-[5px] '>
                        <h2 className={`text-[#242424] capitalize mb-2 text-[17px] ProxymaSemiBold`}>{data?.name}</h2>
                        {/* <p className='ProxymaRegular text-[gray] mt-[5px] text-[12.6px]'>{plainTextDescription?.length>100 ? plainTextDescription?.slice(0,100) + "..." : plainTextDescription}</p> */}

                        <div>
                          {Object.values(
                            data.variants.reduce((acc, variant) => {
                              const { variant_type } = variant;

                              // Group variants by variant_type.id
                              if (!acc[variant_type.id]) {
                                acc[variant_type.id] = {
                                  variant_type,
                                  values: [],
                                };
                              }

                              // Add the variant value to the corresponding group
                              acc[variant_type.id].values.push(variant);
                              return acc;
                            }, {})
                          ).map(({ variant_type, values }, index) => (
                            <div key={index} className="flex items-center gap-[10px] my-[10px]">
                              <h4 className='ProxymaSemiBold' style={{ marginBottom: "5px", fontSize: "13px" }}>{variant_type.typeName} :</h4>
                              <div style={{ display: "flex", gap: "10px" }}>
                                {values.map((v) => (
                                  <div
                                    key={v.id}
                                    className='ProxymaRegular'
                                    style={{
                                      fontSize: "12px",
                                      padding: "5px 10px",
                                      border: "1px solid #ddd",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                      backgroundColor:
                                        activeVariant?.id === v.id ? "#E6E6FA" : "#fff", // Check by variant id
                                    }}
                                    onClick={() => {
                                      handleVariantClick(v.variant_type.id, v.value);

                                      // Update the main image with the first image of the selected variant
                                      if (v.images?.length > 0) {
                                        setSelectedImg(process.env.REACT_APP_IMG_URL + v.images[0].images);
                                      }
                                    }}
                                  >
                                    {v.value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className='flex pt-3 mb-2'>
                        <h4 className={`line-through ProxymaRegular mr-3 text-[14px]`}>
                        <strong className='text-[14px] ProxymaRegular'>৳</strong> {activeVariant?.price}</h4>
                            <h4 className={`ProxymaBold text-[14px] text-[#007bc4]`}> <span className='ProxymaBold text-[14px]'>৳</span>  {activeVariant?.discountPrice}</h4>

                        </div>
                        {/* Short Description Start */}
                          <ul className="list-disc pl-5 text-[rgb(71,66,66)] mt-4 p-[5px] ProxymaRegular 
                          text-[13px] border border-[rgb(128,128,128,0.7)] rounded-[6px] w-full max-w-[82%] 1280px:max-w-[75%]">
                              {data?.short_description?.split("\n").map((line, index) => (
                                  <li key={index} className="break-words">
                                      {line}
                                  </li>
                              ))}
                          </ul>
                        <div className="flex items-center pt-4">
                            <button className='py-[2px]
                             px-[10px] text-center text-white bg-[#007bc4] text-[13px] ProxymaBold rounded-[3px]'
                             onClick={decrementQuantity}>-</button>
                            <span className='py-1 px-5 text-center ProxymaRegular text-[13px]'>{count}</span>
                            <button className='py-[2px]
                             px-[10px] text-center text-white bg-[#007bc4] text-[13px] ProxymaBold rounded-[3px]'
                             onClick={incrementQuantity}>+</button>
                        </div>
                        <div className="flex items-center mt-4 gap-[30px]">
                        <div className={`h-[35px] w-[120px] my-1 flex justify-center bg-transparent 
                           items-center border-[1px] border-[#007bc4] addCartp rounded-sm cursor-pointer`}
                           onClick={handleAddToCart}>
                            <span className='text-[#242424] ProxymaSemiBold flex items-center justify-center text-[13px] '>
                                Continue </span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ):null}
    </div>
  )
}

export default ProductPopupForCart