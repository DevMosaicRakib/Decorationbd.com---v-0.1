import React from 'react'

const ReturnPolicyPage = () => {
  return (
    <div className='w-[98%] 1280px:w-[83%] 1350px:w-[81.5%]
    mt-[80px] 1280px:mt-[30px] mx-auto bg-[rgb(234,234,234,0.3)] p-[20px] 768px:p-[50px] 1280px:p-[30px]'>
      <div className="mb-[10px]">
        <h1 className='text-[16px] 768px:text-[20px] font-[500]'>Return & Refund Policy</h1>
        <div className="w-[8%] 768px:w-[3%] h-[2px] bg-[#23bb73] mb-[5px]"></div>
        <h6 className='text-[13px] font-normal'>Last updated august 17, 2024</h6>  
      </div>

      <div className="mb-[10px]">
        <p className='text-[12px] font-normal'>Please carefully review our <span className='capitalize'>shipping & delivery policy</span> when purchasing our products.
        This policy will apply to any order place with us.</p>  
      </div>

      <div className="mb-[10px]">
        <h3 className='text-[13px] font-[500]'>What are my shipping & delivery options?</h3>
        <p className='text-[12px] font-normal'>Shipping fees</p>
        <p className='text-[12px] font-normal'>All times and dates given for delivery of the products are given in good faith but are estimates only.</p>  
      </div>  

      <div className="mb-[10px]">
        <h3 className='text-[13px] font-[500]'>Do you deliver internationally?</h3>
        <p className='text-[12px] font-normal'>we do not offer international shipping</p>
      </div>

      <div className="mb-[10px]">
        <h3 className='text-[13px] font-[500]'>What happens if our order is delayed?</h3>
        <p className='text-[12px] font-normal'>If delivery is delayed for any reason we will let you know as soon as possible and will advise you 
          of a revised estimated date for delivery.
        </p>
      </div>

      <div className="mb-[10px]">
        <h3 className='text-[13px] font-[500]'>How can you contact us about this policy?</h3>
        <p className='text-[12px] font-normal'>if you have any further questions or comments, you may contact us by :</p>
        <div className="ml-[10px] mt-[5px]">
          <div className="flex items-center gap-[10px]">
           <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
           <p className='text-[12px] font-normal'>Email : mnhodarajib@gmail.com</p>
          </div>
          <div className="flex items-center gap-[10px]">
           <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
           <p className='text-[12px] font-normal'>Go to our contact us page and send message.</p>
          </div>
          <div className="flex items-center gap-[10px]">
           <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
           <p className='text-[12px] font-normal'>Phone : 01717381296</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage
