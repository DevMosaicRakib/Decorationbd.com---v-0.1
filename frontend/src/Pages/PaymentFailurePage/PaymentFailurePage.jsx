import React from 'react'
import './PaymentFailurePage.scss';
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from 'react-router-dom';
const PaymentFailurePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const setCredentialsLink = params.get('set_credentials_link');
  const email = params.get('email');
  return (
    <div className='w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto h-full 768px:h-[100vh] 1280px:h-full'>
      <div className="payment-failure-container h-[250px] 300px:my-[100px] 768px:mt-[100px]">
      <div className="icon-failure">
        <div className="circle">
        <div className="cross">
          <RxCross1 className='line1 font-[900] font-Roboto text-[20px] text-[#d9534f]'/>
        </div>
        </div>

      </div>
      <h2 className='h2 ProxymaBold text-[22px]'><span className='text-[#d9534f]'>Oops !</span> Payment Failed</h2>
      <p className='p ProxymaSemiBold text-[16px]'>Please try again.</p>
      <Link to={`${setCredentialsLink}?email=${email}`} className='button text-[14px] text-white bg-[#d9534f] border-none ProxymaSemiBold
        outline-none py-[6px] px-2 w-[150px] h-[35px] mt-[10px]'
        >Set Your Password</Link>
    </div>
    </div>
  )
}

export default PaymentFailurePage
