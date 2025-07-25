import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { FaArrowRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom'
import Styles from "../../Styles/Styles"
// import { categoriesData } from '../../Static/Data';
import "./ShopStickyCat.scss"
import { ImArrowRight } from 'react-icons/im';
import useFetch from '../../customHooks/useFetch';


const ShopStickyCategory = () => {
    const categories = useFetch('dbd/api/categories/');
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = (i)=>{
        const encodedCategory = encodeURIComponent(i.catname);
        navigate(`/shop?category=${encodedCategory}`);
   
    }
    const handleSubCategorySubmit = (category, subcategory) => {
      const encodedCategory = encodeURIComponent(category.catname);
      navigate(`/shop?category=${encodedCategory}&subCategory=${subcategory.subcatname}`);
    };
  return (
    <>
    <div className='1280px:w-[173px] 1350px:w-[205px] bg-[#fff] h-auto'style={{
      border:" 1px solid rgba(0,0,0,0.1)",
      borderTop:"none",
    }}>
      {
        categories?.map((item)=>(
            <div key={item.id} className={`${Styles.normal_flex} relative hover:bg-[#eaeaea] catData1`}
            onClick={()=>handleSubmit(item)} style={{
              fontSize:"13px",
              padding:"2px",
              color:"#242424"
            }} onMouseEnter={() => setHoveredCategory(item)}
            onMouseLeave={() => setHoveredCategory(null)}>
             <div className="flex items-center gap-[5px]">
             <ImArrowRight  className='ml-[10px] text-[14px]'/>
            <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular
            text-[13px]'>{item.catname}</h3>
             </div>
                <div className='absolute right-[5px] arrow'>
                  <IoIosArrowForward/>
                </div>
                <div>
                {hoveredCategory && hoveredCategory.id === item.id && (
                   <div className={`subCategory1 bg-[#eaeaea]`}>
                   <div className='subCategoryItems1'>
                     {item.sub_categories.map((subcat)=>(
                      <div key={subcat.id}><FaArrowRight/>
                     <span  className='subCategory-item1 ProxymaRegular text-[12px]'
                         onClick={(e) => {
                          e.stopPropagation(); // Prevent parent onClick from triggering
                          handleSubCategorySubmit(item, subcat);
                          setHoveredCategory(null);
                        }}>{subcat.subcatname}</span></div>
                     ))}
                   </div>
                </div>
                )}
                </div>
            </div>
      ))
    }
    </div>
    </>
  )
}

export default ShopStickyCategory
