import React, { useEffect, useState } from 'react'
import Styles from "../../Styles/Styles"
// import { productData } from '../../Static/Data';
import ShopProduct from "../../components/ShopProduct/ShopProduct"
import CatProdCard from '../CatSecProCard/CatProdCard'
import useFetch from '../../customHooks/useFetch';
// import axios from 'axios';
const SuggestedProduct = ({data,open,setOpen,autoclose,deviceCookie,isModalOpen, setIsModalOpen ,setSameDay}) => {
    const allprodctData = useFetch('dbd/api/products/')
    // console.log(allprodctData);
    // console.log(data);
  
      
      const [products, setProducts] = useState(null);
    
      
      useEffect(() => {
        if (allprodctData) {
          const filteredData = allprodctData?.filter((i) => i?.Category?.catname === data?.Category?.catname);
          setProducts(filteredData);
        }
      }, [allprodctData, data.Category]);
    
      // rest of the component
  
  return (
    <>
    {
        data ? (
            <div className={` p-1 768px:px-[20px] 768px:py-[20px] 1024px:px-[10px] 1024px:py-[10px] 1350px:py-[15px] 1350px:px-[30px]
            w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto bg-[rgb(234,234,234,0.3)] mb-[50px]`}>
                <h2 className={`text-[16px] ProxymaSemiBold text-[orangered]
                   mt-[8px] 768px:ml-[15px] 1350px:ml-0`}>
                    Related Products
                </h2>
                <div className="w-[4%] h-[2px] bg-[#007bc4] mb-[10px] 768px:ml-[15px] 1350px:ml-0"></div>
                <div className="productsPart grid grid-cols-2 gap-[6px]
        md:grid-cols-4 md:gap[10px] lg:grid-cols-5 xl:grid-cols-6 1350px:gap-[14px]
         300px:w-[98%] w-[86%] 1350px:w-[100%] mx-auto mb-[10px]">
           {products && products.map((i,index)=>(
            <CatProdCard data={i} key={index} open={open} setOpen={setOpen} autoclose={autoclose} deviceCookie={deviceCookie} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />
           ))}
           
        </div>
          </div>
        ) : null
    }
    </>
  )
}

export default SuggestedProduct
