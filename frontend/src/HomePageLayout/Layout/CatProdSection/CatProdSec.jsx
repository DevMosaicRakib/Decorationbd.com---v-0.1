import React, { useEffect, useState } from 'react';
// import Styles from "../../../Styles/Styles.js";
// import { productData } from "../../../Static/Data.js";
import "./CartProdSec.scss";
// import HdProductCard from '../../../components/HomeDecProCard/HdProductCard.jsx';
import CatSecProdCard from "../../../components/CatSecProCard/CatProdCard.jsx"
import image from "../../../Assets/img/ProductNotFound/img4.png"
// import useFetch from '../../../customHooks/useFetch.js';
const CatProdSec = ({open,setOpen, product_section_data, allProductData,autoclose,deviceCookie,isModalOpen, setIsModalOpen ,setSameDay}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [lazyLoad,setLazyLoad] = useState(true)
  useEffect(()=>{
    setTimeout(()=>{
      setLazyLoad(false)
    },3000)
  },[])
  console.log(product_section_data)
  // Auto-select category or subcategory on component load
  useEffect(() => {
    if (allProductData?.length && product_section_data) {
      const productSection = product_section_data.product_section;
  
      // Check for categories first
      if (productSection?.category?.length > 0 && productSection?.show_categorywise_product) {
        handleCategoryClick(productSection.category[0]?.catname);
      } 
      // Fallback to subcategories if categories are not present or not shown
      else if (productSection?.sub_category?.length > 0 && productSection?.show_subcategorywise_product) {
        // Find the subcategory with the name 'Frozen (Homemade)'
        // const matchingSubcategory = productSection.sub_category.find(
        //   (subcat) => subcat.subcatname === 'Frozen (Homemade)'
        // );
        handleCategoryClick('All');
        
      }
    }
  }, [product_section_data, allProductData]);
  
  
  

  // Filter products based on clicked category or subcategory
  const handleCategoryClick = (name) => {
    setActiveCategory(name);
    let filtered = [];

    if (name === "All") {
        if (product_section_data?.product_section?.category?.length > 0) {
            const selectedCategory = product_section_data?.product_section?.category[0];
            const subCategories = selectedCategory?.sub_categories?.sort((a, b) => a.order - b.order) || [];
            
            // Filter products based on the category
            filtered = allProductData?.filter(
                (product) => product?.Category?.catname === selectedCategory.catname
            ) || [];

            // Sort filtered products by subcategory order
            filtered.sort((a, b) => {
                const subA = subCategories.findIndex(sub => sub.subcatname === a?.Sub_category?.subcatname);
                const subB = subCategories.findIndex(sub => sub.subcatname === b?.Sub_category?.subcatname);
                return subA - subB;
            });
        }
    } else {
        filtered = allProductData?.filter(
            (product) =>
                product?.Category?.catname === name ||
                product?.Sub_category?.subcatname === name
        );
    }

    const limitedProducts = filtered?.slice(0, Number(product_section_data?.product_section?.product_limitation) || filtered?.length);
    setFilteredProducts(limitedProducts || []);
    
  };
  // console.log(filteredProducts)


  return (
    <div className={`1350px:w-[81.5%] 1350px:mx-auto 1024px:w-[98%] 1280px:w-[83%] 
    w-[100%]   mx-auto catProdSection`}>
    <div
      className={`w-full h-full catProdContainer 
      bg-[${product_section_data?.product_section?.section_bg_color || "rgba(234,234,234,0.5)"}]`}>
      <div className={` text-start flex 300px:flex-col 300px:gap-[5px] 768px:flex-row 768px:gap-[30px] 1024px:gap-[40px]
      1350px:gap-[60px] 768px:items-center`}>
        <h1 className={`ProxymaBold 
          text-[${product_section_data?.product_section?.section_headingText_subText_color || "#242424"}]`}>{product_section_data?.product_section?.title}</h1>
        <div className="catsubCategories ProxymaSemiBold 300px:overflow-x-scroll whitespace-nowrap scroll scroll-smooth 768px:overflow-x-hidden">
            {/* "All" option for  subcategories */}
            {product_section_data?.product_section?.sub_category?.length > 0 && product_section_data?.product_section?.show_subcategorywise_product ? (
              <span
              onClick={() => handleCategoryClick("All")}
              className={`cursor-pointer ${
                activeCategory === "All" ? "text-[#0375b8]" : `text-[${product_section_data?.product_section?.section_headingText_subText_color || "#242424"}]`
              }`}
            >
              All
            </span>
            ) : ''}
            

            {product_section_data?.product_section?.category?.length > 0 && product_section_data?.product_section?.show_categorywise_product ? (
              product_section_data?.product_section?.category?.map((cat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(cat?.catname)}
                  className={`cursor-pointer ${
                    activeCategory === cat?.catname ? "text-[#0375b8]" : `text-[${product_section_data?.product_section?.section_headingText_subText_color || "#242424"}]`
                  }`}
                >
                  {cat?.catname}
                </span>
              ))
            ) : (
              product_section_data?.product_section?.sub_category.map((subcat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(subcat?.subcatname)}
                  className={`cursor-pointer ${
                    activeCategory === subcat?.subcatname ? "text-[#0375b8]" : `text-[${product_section_data?.product_section?.section_headingText_subText_color || "#242424"}]`
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
        {lazyLoad ? (
          <div className="flex flex-col justify-center items-center h-[300px]">
            <div className="w-[30px] h-[30px] border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-700 ProxymaSemiBold text-[13px]">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catSecProductCard">
            <img src={image} alt="" className="w-full 1024px:h-[220px] h-full 1024px:object-contain object-contain" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[6px] md:grid-cols-4 md:gap-[11px] 
          lg:grid-cols-5 lg:gap-[10px] xl:grid-cols-6 xl:gap-[11px] 1350px:gap-[13px] catSecProductCard">
            {filteredProducts.map((i, index) => (
              <CatSecProdCard 
                data={i} 
                key={index} 
                open={open} 
                setOpen={setOpen} 
                autoclose={autoclose} 
                deviceCookie={deviceCookie} 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                setSameDay={setSameDay} 
                cardBgColor={product_section_data?.product_section?.card_bg_color}
                cardProductTitleAndPriceColor={product_section_data?.product_section?.card_productTitle_price_color}
              />
            ))}
          </div>
        )}
      </div>


      </div>
    </div>
  </div>
  )
}

export default CatProdSec
