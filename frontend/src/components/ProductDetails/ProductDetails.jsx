import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Styles/Styles";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiBuyCard } from "react-icons/gi";
import d1 from "../../Assets/img/DeliveryImg/delivery1.jpg";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { toast } from "react-toastify";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import { useNavigate } from "react-router-dom";
// import d2 from "../../Assets/img/DeliveryImg/delivery2.jpeg";
import './ProductDetails.scss'
import axios from "axios";
const ProductDetails = ({
  data,
  autoclose,
  deviceCookie,isModalOpen, setIsModalOpen,setSameDay
}) => {

  const scrollRef = useRef(null);
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const minQty = data?.min_quantity ? parseInt(data?.min_quantity) : 1;
    const totalStock = data?.total_stock ? parseInt(data?.total_stock) : null;
  
    // Find the cart item that matches the product name
    const cartItem = cartItems?.find((item) => item.products.name === data?.name);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
  
    // Determine the initial count
    const initialCount =
      cartQuantity >= totalStock ? 0 : minQty > totalStock ? totalStock : cartQuantity && minQty>(totalStock-cartQuantity) ? (totalStock-cartQuantity) : minQty;
  
    const [count, setCount] = useState(initialCount);
  
    useEffect(() => {
      if (cartQuantity >= totalStock) {
        setCount(0);
      } else {
        setCount( minQty > totalStock ? totalStock : cartQuantity && minQty>(totalStock-cartQuantity) ? (totalStock-cartQuantity) : minQty);
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

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
        // Function to handle the wheel event
        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                scrollContainer.scrollLeft += e.deltaY; // Scroll horizontally
                e.preventDefault(); // Prevent default vertical scroll
            }
        };

        // Attach the event listener
        scrollContainer.addEventListener('wheel', onWheel);

        // Cleanup the event listener on component unmount
        return () => scrollContainer.removeEventListener('wheel', onWheel);
    }
  }, [data]);
  // console.log(data)
  // console.log(data)
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
  // console.log(data.variants[0].images[0].images)
  // console.log(data)



  
  const [addItemToCart] = useAddItemToCartMutation();
  const initialImage = data?.product_imgs?.[0]?.images ? process.env.REACT_APP_IMG_URL + data?.product_imgs?.[0]?.images : '';
  const [select, setSelect] = useState(initialImage);

  useEffect(() => {
    // Update the selected image when data is loaded or changes
    if (data?.product_imgs?.[0]?.images) {
      setSelect(process.env.REACT_APP_IMG_URL + data?.product_imgs[0]?.images);
    }
  }, [data]);

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
      //   setSelect(process.env.REACT_APP_IMG_URL + activeVariant?.image);
      // }
    }
  }, [data]);
  // console.log(select);
  const {access_token} = getToken();

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
      console.error('Error adding item to cart:', error);
    }
  };
  const navigate = useNavigate();
  const handleBuyNow = async () =>{
    try {
      if (count !== 0) {
        if (activeVariant) {
          if (access_token) {
            const response = await addItemToCart({ products_id: data.id, variant_id:activeVariant.id,quantity: count });
            if (response.data) {
              refetch();
              navigate(`/checkout`);
              // setIsModalOpen(true)
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
              refetch();
              navigate(`/checkout`);
              // setIsModalOpen(true)
              
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
    <div className="bg-white">
      {data ? (
        <div className={`w-[95%] 768px:w-[90%]  1024px:w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto
         mt-[60px] 768px:mt-[100px] lg:mt-[80px] xl:mt-0`}>
          <div className="w-full py-2 1350px:py-2">
            <div className="block w-full h-auto 1024px:flex justify-center
             shadow-sm shadow-[rgb(128,128,128,0.5)] gap-[50px] 300px:py-[20px] 1280px:py-[40px] 768px:p-[30px]">


          <div className="w-full 1024px:w-auto 1024px:mr-[30px]">
                {/* Main Product Image */}
                <div
                  id="imageZoom"
                  style={{
                    "--url": `url(${select})`,
                    "--zoom-x": "0%",
                    "--zoom-y": "0%",
                    "--display": "none",
                  }}
                  className="relative w-[300px] h-[300px] mx-auto md:mx-0 mb-[10px]"
                  onMouseMove={handleMouseMove}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <img
                    src={select}
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
                          setSelect(process.env.REACT_APP_IMG_URL + image.images)
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
                              setSelect(process.env.REACT_APP_IMG_URL + variantImage.images);
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


              <div className="w-[90%] mx-auto 768px:mx-0 768px:w-full 1024px:w-[600px] 768px:pt-0 1280px:pt-[20px] pt-[20px]">
                <h1 className={`text-[18px] text-[#242424] ProxymaSemiBold`}>{data?.name}</h1>

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
                              <h4 className="ProxymaSemiBold" style={{ marginBottom: "5px", fontSize: "13px"}}>{variant_type.typeName} :</h4>
                              <div style={{ display: "flex", gap: "10px" }}>
                                {values.map((v) => (
                                  <div
                                    key={v.id}
                                    className="ProxymaRegular"
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
                                        setSelect(process.env.REACT_APP_IMG_URL + v.images[0].images);
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


                

                <div className="flex pt-4 items-center">
                  <h4 className={` mr-[10px] ProxymaSemiBold text-[14px] line-through`}>
                    {activeVariant?.price}
                    <strong className="text-[14px] ProxymaSemiBold">৳</strong>
                  </h4>
                  <h4 className={`text-[14px] ProxymaBold text-[#007bc4]`}>
                    {activeVariant?.discountPrice}
                    <strong className="text-[14px] ProxymaBold">৳</strong>
                  </h4>
                </div>

                <div className={`${Styles.normal_flex} mt-4 1350px:mt-5 pr-3`}>
                  <button
                    className="py-[2px] rounded-[3px]
                             px-[10px] text-center text-white bg-[#007bc4] text-[13px] ProxymaBold"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13.3px] ProxymaRegular">{count}</span>
                  <button
                    className="py-[2px] rounded-[3px]
                             px-2 text-center text-white bg-[#007bc4] text-[13px] ProxymaBold"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>

                {/* Short Description Start */}
                <ul className="list-disc pl-5 text-[rgb(71,66,66)] mt-4 p-[5px] ProxymaRegular 
                 text-[13px] border border-[rgb(128,128,128,0.7)] rounded-[6px] w-full max-w-[82%] 768px:max-w-[50%]">
                    {data?.short_description?.split("\n").map((line, index) => (
                        <li key={index} className="break-words">
                            {line}
                        </li>
                    ))}
                </ul>

                



                {/* Add to Cart And Buy Now Buttons */}
                <div className="flex items-center mt-4 1350px:mt-5 gap-[30px]">
                  <div
                    className={`${data?.stock === 'Out Of Stock' ? 'disabled' : 'bg-[#007bc4] cursor-pointer'} flex items-center justify-center
                        w-[130px] h-[35px] 1350px:my-2 
                       rounded-sm`}
                       onClick={() => {
                        console.log('Stock status:', data?.stock); // Debug stock value
                        if (data?.stock === 'Out Of Stock') {
                          toast.error('Sorry! This product is out of stock now.', {
                            autoClose: autoclose || 3000, // Fallback to 3000ms if autoclose is undefined
                          });
                        } else {
                          handleAddToCart();
                        }
                      }}>
                    <span className="text-white ProxymaSemiBold flex items-center text-[13px]">
                      Add to cart <AiOutlineShoppingCart className="ml-2 text-[13px]" />
                    </span>
                  </div>
                  <div
                    className={`${data?.stock === 'Out Of Stock' ? 'disabled' : 'bg-[#e14877] cursor-pointer'} flex items-center justify-center
                        w-[130px] h-[35px] 
                      1350px:my-2 rounded-sm`}
                      onClick={() => {
                        console.log('Stock status:', data?.stock); // Debug stock value
                        if (data?.stock === 'Out Of Stock') {
                          toast.error('Sorry! This product is out of stock now.', {
                            autoClose: autoclose || 3000, // Fallback to 3000ms if autoclose is undefined
                          });
                        } else {
                          // if (data?.same_day_delivery) {
                          //   setSameDay(data?.same_day_delivery); 
                          // }
                          handleBuyNow();
                        }
                      }}
                  >
                    <span className="text-[#fff] ProxymaSemiBold flex items-center text-[13px]">
                      Buy now <GiBuyCard className="ml-2 text-[13px]" />
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <ProductDetailsInfo data={data} plainTextDescription={plainTextDescription}/>
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data,plainTextDescription }) => {
  const [active, setActive] = useState(1);
  const [imgData,setImageData] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}dbd/api/productshipimg/`)
        setImageData(res.data)
        console.log(imgData)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData();
  },[])
  return (
    <div className="bg-[rgb(245,246,251,0.7)] px-3 800px:px-10 py-2 1350px:px-[58px] 1350px:py-[30px] rounded  1350px:mt-[70px] 1350px:mb-[50px]">
      <div className="w-full flex justify-between border-b pt-5 pb-2">
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 
                    cursor-pointer text-[13px] ProxymaSemiBold"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
        {/* <div className="relative hidden 768px:inline">
          <h5
            className="text-[#242424] px-1 leading-5 ProxymaSemiBold 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(2)}
          >
            Additional Information
          </h5>
          {active === 2 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div> */}
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 ProxymaSemiBold
                    cursor-pointer text-[13px]"
            onClick={() => setActive(3)}
          >
            Shipping & Delivery
          </h5>
          {active === 3 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p
            className="py-2 1280px:w-[40%] w-[98%]
                    text-[12px] leading-4 pb-5 whitespace-pre-line ProxymaRegular text-[#242424]"
          >
            {plainTextDescription}
          </p>
         
        </>
      ) : null}
      {/* {active === 2 ? (
        <div className="w-full min-h-[30vh] flex items-center justify-around">
          <h4 className="ProxymaRegular  text-[#242424] text-[12px]">Weigth</h4>
          <p className="ProxymaRegular text-[#077bc4] text-[12px]">2.5kg</p>
        </div>
      ) : null} */}
      {active === 3 ? (
        <div className="w-full flex items-center justify-center">
          {imgData && (
            <div className="w-[95%] py-4 overflow-hidden">
              <img src={process.env.REACT_APP_IMG_URL+imgData[0]?.image} alt="" className="w-[100%] h-auto mx-auto object-contain" />
            </div>
          )}
          {/* <div className="768px:w-[40%] w-[90%]">
            <h1
              className="ProxymaSemiBold
                    text-[#242424] text-[16px] 768px:mt-[10px] mt-0 lg:mt-0"
            >
              Service Provider :
            </h1>
            <p className=" pt-1 ProxymaRegular text-[12px] text-[#242424] capitalize">
              We usually use <span className="text-[#077bc4]">Pathao</span> ,{" "}
              <span>
                Red<span className="italic ProxymaSemiBold text-[red] text-[13px]">X</span>
              </span>{" "}
              or Steadfast{" "}
              <span className="text-[orangered] ProxymaRegular">Courier Service</span> Provider
              to shipping our products.
            </p>
            <h3 className="pt-3 text-[16px] capitalize ProxymaSemiBold text-[#242424]">
              shipping time :
            </h3>
            <p className="capitalize ProxymaRegular text-[12px]  pt-1">
              <span className=" text-[red]">7</span>{" "}
              <span className="text-[red]">days</span> minimum
            </p>
          </div> */}
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
