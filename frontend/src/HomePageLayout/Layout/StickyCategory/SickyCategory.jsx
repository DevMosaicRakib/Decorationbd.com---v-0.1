import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Styles from "../../../Styles/Styles";

import { IoIosArrowForward } from 'react-icons/io';
import { FaArrowRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom'
import "./DsubCat.scss";
import { ImArrowRight } from 'react-icons/im';
import useFetch from '../../../customHooks/useFetch';
import { CiShop } from 'react-icons/ci';
import { MdContactPhone } from 'react-icons/md';
import { FaInfoCircle } from "react-icons/fa";
import { AiFillSafetyCertificate } from 'react-icons/ai';
const StickyCategory = () => {
  const categories = useFetch('dbd/api/categories/');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (category) => {
    const encodedCategory = encodeURIComponent(category.catname);
    navigate(`/shop?category=${encodedCategory}`);
  };

  const handleSubCategorySubmit = (category, subcategory) => {
    const encodedCategory = encodeURIComponent(category.catname);
    navigate(`/shop?category=${encodedCategory}&subCategory=${subcategory.subcatname}`);
  };

  return (
    <div className=' w-[300px] mx-auto bg-[#f9f9f9] h-auto' style={{
      border: "1px solid rgba(0,0,0,0.1)",
      borderTop: "none",
    }}>
      {categories?.map((item) => (
        <div key={item.id} className={`${Styles.normal_flex} relative hover:bg-[#ffff] catData`}
          onClick={() => handleSubmit(item)}
          onMouseEnter={() => setHoveredCategory(item)}
          onMouseLeave={() => setHoveredCategory(null)}
          style={{
            color:"#242424"
          }}>
           <div className="flex items-center gap-[5px]">
           <ImArrowRight  className='ml-[15px] text-[18px] 1350px:text-[16px]'/>
          <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular 1280px:text-[14px]'>{item.catname}</h3>
           </div>
           <div className='absolute right-[5px] arrow'>
            <IoIosArrowForward />
          </div>

          <div>
            {hoveredCategory && hoveredCategory.id === item.id && (
              <div className={`subCategory`}>
                <div className='subCategoryItems'>
                  {item.sub_categories.map((subcat) => (
                    <div key={subcat.id} className='flex items-center'>
                      <FaArrowRight />
                      <span  className='subCategory-item text-[13px] text-[#242424] 
                      text-start ProxymaRegular px-[10px] py-[5px]'
                         onClick={(e) => {
                          e.stopPropagation(); // Prevent parent onClick from triggering
                          handleSubCategorySubmit(item, subcat);
                          setHoveredCategory(null)
                        }}>{subcat.subcatname}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Static Page Link */}
      <>
      <Link to='/shop' className="flex items-center gap-[5px] border border-t-[#e5e5e5] hover:bg-[#ffff]">
           <CiShop  className='ml-[15px] text-[18px] 1350px:text-[16px]'/>
          <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular 1280px:text-[14px]'>Shop</h3>
      </Link>
      <Link to='/privacy' className="flex items-center gap-[5px] border border-t-[#e5e5e5] hover:bg-[#ffff]">
           <AiFillSafetyCertificate  className='ml-[15px] text-[18px] 1350px:text-[16px] text-[#242424]'/>
          <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular 1280px:text-[14px]'>Privacy Policy</h3>
      </Link>
      {/* <Link to='/contact' className="flex items-center gap-[5px] border border-t-[#e5e5e5] hover:bg-[#ffff]">
           <MdContactPhone  className='ml-[15px] text-[18px] 1350px:text-[16px]'/>
          <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular 1280px:text-[14px]'>Contact</h3>
      </Link> */}
      

     
    </>
    </div>
  );
};

export default StickyCategory;
