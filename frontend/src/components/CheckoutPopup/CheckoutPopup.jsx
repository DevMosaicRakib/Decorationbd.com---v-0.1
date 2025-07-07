// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { RxCross1 } from "react-icons/rx";

// const CheckoutPopup = ({ isModalOpen, setIsModalOpen }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const navigate = useNavigate();
//     const checkOutPopupRef = useRef(null);
//     useEffect(() => {
//     // Function to close the shopSideBar if clicked outside
//     const handleClickOutside = (event) => {
//         if (checkOutPopupRef.current && !checkOutPopupRef.current.contains(event.target)) {
//             setIsModalOpen(false);
//         }
//     };

//     // Add event listener to detect clicks outside
//     document.addEventListener("mousedown", handleClickOutside);

//     // Cleanup event listener on component unmount
//     return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//     };
//     }, [checkOutPopupRef, setIsModalOpen]);

//   // Get current date without time
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Handle Checkout Today
//   const handleCheckoutToday = () => {
//     const currentDateTime = new Date().toISOString();
//     navigate(`/checkout?date=${currentDateTime}`);
//     setIsModalOpen(false);
//   };

//   // Handle Checkout Other Day (Show Date Picker)
//   const handleCheckoutOtherDay = () => {
//     setShowDatePicker(true);
//   };

//   // Proceed with Selected Date
//   const proceedWithSelectedDate = () => {
//     if (selectedDate) {
//       const formattedDate = selectedDate.toISOString();
//       navigate(`/checkout?date=${formattedDate}`);
//       setIsModalOpen(false);
//     }
//   };

//   return isModalOpen ? (
//     <div className="fixed top-0 left-0 w-full h-screen bg-[#0000008f] z-[99999] flex items-center justify-center">
//       <div ref={checkOutPopupRef} className="w-[90%] 768px:w-[60%] 1350px:w-[40%] h-auto bg-white rounded-md shadow-md p-4 relative">
//         <h2 className="text-lg ProxymaSemiBold mb-4 text-center">
//           Please choose your delivery option
//         </h2>

//         <h4 className="w-[90%] 768px:w-[60%] mx-auto mb-4 border-[1px] border-[rgb(128,128,128,0.3)] p-1 rounded-[6px] text-center">
//             <span className="text-[14px] ProxymaSemiBold text-[orangered]">Notice :</span>
//             <span className="ml-[5px] text-[13px] ProxymaRegular text-[#242424]">This is checkout popup message This is checkout popup message</span>
//         </h4>

//         {/* Checkout Buttons */}
//         <div className="flex items-center justify-center gap-2">
//           <button
//             className="bg-[#e14877] text-white ProxymaSemiBold py-2 px-4 rounded-sm text-[14px]"
//             onClick={handleCheckoutToday}
//           >
//             Same Day Delivery
//           </button>
//           <button
//             className="bg-gray-500 text-white ProxymaSemiBold py-2 px-4 rounded-sm text-[14px]"
//             onClick={handleCheckoutOtherDay}
//           >
//             Other Day Delivery
//           </button>
//         </div>

//         {/* Date Picker */}
//         {showDatePicker && (
//           <div className="mt-4 w-[60%] mx-auto flex flex-col items-center">
//             <DatePicker
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               minDate={new Date(today.getTime() + 86400000)} // Disable today
//               showTimeSelect
//               dateFormat="yyyy-MM-dd h:mm aa"
//               className="border p-2 w-[100%] mx-auto ProxymaRegular outline-none text-center text-[13px]"
//             />
//             <button
//               className="mt-3 bg-[#298A60] text-white py-2 rounded-sm w-full ProxymaSemiBold text-[14px]"
//               onClick={proceedWithSelectedDate}
//               disabled={!selectedDate}
//             >
//               Continue
//             </button>
//           </div>
//         )}

//         {/* Close Button */}
//         <button
//           className=" text-gray-700"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <RxCross1 size={16} className="absolute right-[6px] top-[6px] z-50" 
//         />
//         </button>
//       </div>
//     </div>
//   ) : null;
// };

// export default CheckoutPopup;


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutPopup = ({ isModalOpen, setIsModalOpen, sameDay }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timePreference, setTimePreference] = useState("before");
  const [notice,setNotice] = useState('')
  const navigate = useNavigate();
  const checkOutPopupRef = useRef(null);
  const [checkOutPopupMessage,setcheckOutPopupMessage] = useState('')
  const checkOutPopupMessageData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}dbd/api/checkoutpopupmessage/`
      );
      setcheckOutPopupMessage(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    checkOutPopupMessageData();
  },[])
  console.log(checkOutPopupMessage)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkOutPopupRef.current && !checkOutPopupRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [checkOutPopupRef, setIsModalOpen]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleCheckoutToday = () => {
    if (sameDay === true) {
      const currentDateTime = new Date().toISOString();
      navigate(`/checkout?date=${currentDateTime}`);
      setIsModalOpen(false);
    } else{
      setNotice('This product is not available for same day delivery .')
    }
  };

  const handleCheckoutOtherDay = () => {
    setShowDatePicker(true);
  };

  const proceedWithSelectedDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString();
      navigate(`/checkout?date=${formattedDate}&timePreference=${timePreference}`);
      setIsModalOpen(false);
    }
  };
  const date = new Date(selectedDate);

  // Formatting date separately
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  
  // Formatting time separately
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  
  console.log(formattedDate); // Output: 05-02-2025
  console.log(formattedTime); // Output: 5:00 PM
  


  return isModalOpen ? (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000008f] z-[99999] flex items-center justify-center">
      <div ref={checkOutPopupRef} className="w-[90%] 768px:w-[60%] 1350px:w-[40%] h-auto bg-white rounded-md shadow-md p-4 relative">
        <h2 className="text-lg ProxymaSemiBold mb-4 text-center">
          Please choose your delivery date & time
        </h2>

        {notice && (
                  <h4 className="w-[90%] 768px:w-[60%] mx-auto mb-4 border-[1px] border-[rgb(128,128,128,0.3)] p-1 rounded-[6px] text-center">
                  <span className="text-[14px] ProxymaSemiBold text-[orangered]">Notice :</span>
                  <span className="ml-[5px] text-[13px] ProxymaRegular text-[#242424]">{notice}</span>
                </h4>
        )}

        <div className="flex items-center justify-center gap-2">
          <button className={`${!sameDay ? 'disabled':'bg-[#e14877] cursor-pointer'} text-white ProxymaSemiBold py-2 px-4 rounded-sm text-[14px]`} onClick={handleCheckoutToday}>
            Same Day Delivery
          </button>
          <button className="bg-gray-500 text-white ProxymaSemiBold py-2 px-4 rounded-sm text-[14px]" onClick={handleCheckoutOtherDay}>
            Other Day Delivery
          </button>
        </div>

        {showDatePicker && (
          <div className="mt-4 w-[96%] 768px:w-[65%] 1024px:w-[60%] mx-auto flex flex-col items-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date(today.getTime() + 86400000)}
              placeholderText="select date & time"
              showTimeSelect
              dateFormat="dd-MM-yyyy h:mm aa"
              className="border p-2 w-[100%] mx-auto ProxymaRegular outline-none text-center text-[13px]"
            />
            {selectedDate && (
                 <div className="w-full  mt-2">
                    <p className="ProxymaSemiBold text-[11px] text-[#242424] px-2 text-center">
                      Your order will be delivered on {formattedDate} {timePreference} {formattedTime}
                    </p>
                 </div>
            )}
           
            <button
              className="mt-3 bg-[#298A60] text-white py-2 rounded-sm w-full ProxymaSemiBold text-[14px]"
              onClick={proceedWithSelectedDate}
              disabled={!selectedDate}
            >
              Continue
            </button>
          </div>
        )}

        <button className="text-gray-700" onClick={() => setIsModalOpen(false)}>
          <RxCross1 size={16} className="absolute right-[6px] top-[6px] z-50" />
        </button>
      </div>
    </div>
  ) : null;
};

export default CheckoutPopup;