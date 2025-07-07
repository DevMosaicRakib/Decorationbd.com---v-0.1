import React, { useEffect, useState } from 'react'
import Style from "../../../Styles/Styles";
import "./HomeDecor.scss";
import { productData } from '../../../Static/Data';
import FeaturedProduct from "../FeaturedProduct/FeaturedProduct.jsx"
// import ProductCard from '../../../components/ProductCard/ProductCard.jsx';
import HdProductCard from "../../../components/HomeDecProCard/HdProductCard.jsx"
import image from "../../../Assets/img/ProductNotFound/img4.png";
import pic from '../../../Assets/img/dummy.png';
import useFetch from '../../../customHooks/useFetch.js';
const HomeDecor = ({
  open,
  setOpen,
  product_section_data,
  allProductData,
  autoclose,
  deviceCookie
}) => {
  // const hAndDAllData = useFetch('api/HomeDecorAll/');
  // console.log(hAndDAllData);
  const featuredData = useFetch('dbd/api/featuredproducts/')
  // console.log(featuredData)


  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  // console.log(product_section_data)
  // Auto-select category or subcategory on component load
  useEffect(() => {
    if (allProductData?.length && product_section_data) {
      // Check for categories first
      if (product_section_data?.category?.length > 0 && product_section_data?.show_categorywise_product) {
        handleCategoryClick(product_section_data?.category[0]?.catname);
      } 
      // Fallback to subcategories if categories are not present or not shown
      else if (product_section_data?.sub_category?.length > 0 && product_section_data?.show_subcategorywise_product) {
        handleCategoryClick("All");
      }
    }
  }, [product_section_data, allProductData]);
  

  // Filter products based on clicked category or subcategory
  const handleCategoryClick = (name) => {
    setActiveCategory(name);
    let filtered;

    if (name === "All") {
      // Show all products if "All" is selected
      if (product_section_data?.category?.length > 0) {
        // Filter by the first category in product_section_data
        filtered = allProductData?.filter(
          (product) =>
            product?.Category?.catname === product_section_data.category[0].catname
        );
      }
    } else {
      filtered = allProductData?.filter(
        (product) =>
          product?.Category?.catname === name ||
          product?.Sub_category?.subcatname === name
      );
    }

    const limitedProducts = filtered?.slice(0, Number(product_section_data?.product_limitation) || filtered?.length);
    setFilteredProducts(limitedProducts || []);
  };
  return (
    <div className={`1350px:w-[81.5%] 1350px:mx-auto 1024px:w-[98%] 1280px:w-[83%] 768px:mx-auto 
     ml-0 homeDecorContainer  1024px:p-[5px] p-[2px]`}>
      <div className="bannerAndFeatureSection ml-[10px] grid grid-cols-1">
        <div className="bannerPart">
            <img src={pic} alt="" />
            <h1 className='font-Roboto font-bold'>Fresh <br /> & Organic Food</h1>
            <button>Read more</button>
        </div>
        <div className="featuredPart">
          <h1 className='shadow-sm shadow-slate-500 font-[400]' >{featuredData?.[0]?.title}</h1>
          {featuredData?.length !== 0 ? (
            <div className="grid grid-cols-1 pb-[20px] 1500px:w-[90%] w-[92%] mx-auto">
              {featuredData?.[0]?.product && featuredData?.[0]?.product?.map((i,index)=>(
                <FeaturedProduct data={i} key={index} />
              ))}            
           </div>
          ):(
            <div className="text-[12px] text-[#242424] text-center">
              No products found !
            </div>
          )}
          
        </div>
      </div>
      <div className="homeDecorProductSection">
          <div className="headingSbcategory font-[500]">
              <h1>{product_section_data?.title}</h1>
          <div className="subCategories 300px:overflow-x-scroll whitespace-nowrap no-scrollbar scroll-smooth 768px:overflow-x-hidden">
            {/* "All" option for  subcategories */}
            {product_section_data?.sub_category?.length > 0 && product_section_data?.show_subcategorywise_product ? (
              <span
              onClick={() => handleCategoryClick("All")}
              className={`cursor-pointer ${
                activeCategory === "All" ? "text-[#1ebc75]" : "text-[#242424]"
              }`}
            >
              All
            </span>
            ) : ''}
            

            {product_section_data?.category?.length > 0 && product_section_data?.show_categorywise_product ? (
              product_section_data?.category.map((cat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(cat?.catname)}
                  className={`cursor-pointer ${
                    activeCategory === cat?.catname ? "text-[#1ebc75]" : "text-[#242424]"
                  }`}
                >
                  {cat?.catname}
                </span>
              ))
            ) : (
              product_section_data?.sub_category.map((subcat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(subcat?.subcatname)}
                  className={`cursor-pointer ${
                    activeCategory === subcat?.subcatname ? "text-[#1ebc75]" : "text-[#242424]"
                  }`}
                >
                  {subcat?.subcatname}
                </span>
              ))
            )}
          </div> 
          </div>


           <div>

               <div>
               {filteredProducts && filteredProducts?.length===0?(
                         <div
                         className={`homeDecorProductCard`}
                       >
                         <img src={image} alt="" className='1024px:w-[1000px] w-full 1024px:h-[500px] h-full 
                         1024px:object-cover object-contain'/>
                       </div> 
                 ): (
                   <div className={`grid grid-cols-2 gap-[5px] md:grid-cols-5 md:gap-[3px] lg:grid-cols-6 
                   lg:gap-[10px] xl:grid-cols-5 xl:gap-[5px] 1350px:gap-[6px] homeDecorProductCard`}>
                     {filteredProducts?.map((item,index)=>(
                       <HdProductCard
                       data={item}
                       key={index}
                       open={open}
                       setOpen={setOpen}
                       autoclose={autoclose}
                       deviceCookie={deviceCookie}
                     />
                     ))}
                    </div>)}
                </div>
           </div>
      </div>
    </div>
  )
}

export default HomeDecor
