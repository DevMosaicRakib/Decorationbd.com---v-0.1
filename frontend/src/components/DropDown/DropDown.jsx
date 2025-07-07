import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Styles from "../../Styles/Styles";
import { IoIosArrowForward } from 'react-icons/io';
import { FaArrowRight } from "react-icons/fa6";
import { ImArrowRight } from "react-icons/im";

import "./DropDown.scss";
import useFetch from '../../customHooks/useFetch';

const DropDown = ({setDropDown}) => {
    const dropDownRef = useRef(null);
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

    useEffect(() => {
      // Function to close the dropdown if clicked outside
      const handleClickOutside = (event) => {
          if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setDropDown(false); // Close dropdown if click happens outside it
          }
        // Delay the execution to allow dropdown toggle first
      };
    
      // Add event listener to detect clicks outside
      document.addEventListener("mousedown", handleClickOutside);
    
      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropDownRef]);




  
    return (
      <div className='w-[300px] bg-[#f9f9f9] h-auto ml-[2px]' style={{
        border: "1px solid rgba(0,0,0,0.1)",
        borderTop: "none",
      }}>
        {categories?.map((item) => (
          <div key={item.id} className={`${Styles.normal_flex} relative hover:bg-[#ffff] catData`}
            onClick={() => {handleSubmit(item); setDropDown(false)}}
            onMouseEnter={() => setHoveredCategory(item)}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{
              color:"#242424"
            }}>
             <div className="flex items-center gap-[5px]">
             <ImArrowRight  className='ml-[15px] text-[18px] 1350px:text-[16px]'/>
            <h3 className='m-3 cursor-pointer select-none h-full ProxymaRegular 1280px:text-[13px]'>{item.catname}</h3>
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
                        <span  className='subCategory-item text-[12px] text-[#242424] 
                        text-start ProxymaRegular px-[10px] py-[5px]'
                           onClick={(e) => {
                            e.stopPropagation(); // Prevent parent onClick from triggering
                            handleSubCategorySubmit(item, subcat);
                            setDropDown(false);
                          }}>{subcat.subcatname}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
}

export default DropDown
