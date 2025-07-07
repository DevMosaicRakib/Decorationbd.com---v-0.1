import React, { useEffect, useRef } from 'react'
import newsp from "../../Assets/img/news.png"
import { RxCross1 } from 'react-icons/rx'

const NewsPopUp = ({news,setActiveNews}) => {
    const NewsRef = useRef(null);
    useEffect(() => {
      // Function to close the shopSideBar if clicked outside
      const handleClickOutside = (event) => {
        if (NewsRef.current && !NewsRef.current.contains(event.target)) {
          setActiveNews([])
        }
      };
  
      // Add event listener to detect clicks outside
      document.addEventListener("mousedown", handleClickOutside);
  
      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [NewsRef,setActiveNews]);
    return (
      <div className='bg-[#fff]'>
          <div className="fixed w-full h-screen top-0 left-0 
          bg-[#0000008f] z-50 flex items-center
          justify-center">
              <div ref={NewsRef} className="relative w-[90%] 768px:w-[60%] 
              h-[50vh] 768px:h-[40vh] 1024px:h-[50vh] 1280px:h-[70vh] 1350px:h-[75vh] 
              bg-transparent rounded-md p-4">
                <RxCross1 size={20} className="absolute right-10 top-3 z-50 text-white cursor-pointer" 
                 onClick={()=>{setActiveNews([])}} />
                  <div className=' w-[70%] 1024px:w-[70%] mx-auto
                  absolute top-[8%] 768px:top-[12%] 1024px:top-[12%] 1280px:top-[20%] overflow-hidden
                  1350px:top-[25%] left-[15%] text-center'>
                    <h1 className='1024px:text-[16px] 768px:text-[14px] text-[13px] ProxymaBold mb-[5px] text-[#c72d2d]'>Notice :</h1>
                    <p className='1024px:text-[16px] 768px:text-[14px] text-[13px] text-[#2A2B2C] ProxymaSemiBold'>{news.popupSpeech}</p>
                    
                  </div>
                  <div className="w-[100%] flex justify-center">
                  <img src={newsp} alt="image" className='w-[650px]' />
                  </div>
  
              </div>
          </div>
      </div>
    )
}

export default NewsPopUp