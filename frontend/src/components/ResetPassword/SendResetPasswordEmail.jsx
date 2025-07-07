import React, { useState } from 'react'
import { useSendPasswordResetEmailMutation } from '../../Redux/UserAndAuthServices/userAuthApi'
import { toast } from 'react-toastify'

const SendResetPasswordEmail = ({autoclose}) => {
  const [server_error, setServerError] = useState({})
  // const [server_msg, setServerMsg] = useState({})
  const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
    }
    const res = await sendPasswordResetEmail(actualData)
    if (res.error) {
      console.log(typeof (res.error.data.errors))
      console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
      if(res.error.data.errors.non_field_errors){
        toast.error(res.error.data.errors.non_field_errors[0],{
          autoClose:autoclose
        })
      }
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      setServerError({})
      // setServerMsg(res.data)
      toast.success(res.data.msg,{
        autoClose:autoclose
      })
      document.getElementById('password-reset-email-form').reset()
    }
  }
  return (
    <div className="w-full 300px:h-full  flex items-center !300px:justify-start 768px:justify-center">
    <div className='w-full  h-[200px] 300px:mt-[150px] 768px:mt-[100px] 300px:mb-[100px] 768px:mb-0'>
      <div className="p-[20px] rounded-[3px] shadow-sm shadow-[rgb(128,128,128,0.5)]  300px:w-[96%] 768px:w-[500px] mx-auto">
      <h1 className='ProxymaSemiBold text-[16px] 768PX:text-[20px] text-[#242424]'>Reset your password</h1>
      <form onSubmit={handleSubmit} id='password-reset-email-form'>
        <label className='ProxymaSemiBold text-[13px] text-[rgba(0,0,0,0.8)] my-[10px] block'>
          Email :
        </label>
        <input type="email" name="email"  className='py-[10px] px-[30px] w-[95%] mx-auto 
        border-[1px] border-[rgba(0,0,0,0.5)] outline-none ProxymaRegular text-[11px] rounded-[5px]' placeholder='Enter your email...'/>
        {server_error.email ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.email[0]}</p>:""}
        <button type="submit" className='border-none outline-none py-[5px] px-[10px]
        mt-[10px] w-[70px] text-[13px] text-center text-white ProxymaSemiBold bg-[#32ca00] rounded-sm'>Send</button>
      </form>
      </div>
    </div>
    </div>
  )
}

export default SendResetPasswordEmail
