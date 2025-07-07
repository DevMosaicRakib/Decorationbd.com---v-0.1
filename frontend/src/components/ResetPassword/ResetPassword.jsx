import React, { useState } from 'react'
import { useResetPasswordMutation } from '../../Redux/UserAndAuthServices/userAuthApi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const ResetPassword = ({autoclose}) => {
  const [server_error, setServerError] = useState({})
  // const [server_msg, setServerMsg] = useState({})
  const [visible,setVisible] = useState(false)
  const [visible1,setVisible1] = useState(false)
  const [resetPassword] = useResetPasswordMutation()
  const { id, token } = useParams()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await resetPassword({ actualData, id, token })
    if (res.error) {
      // setServerMsg({})
      setServerError(res.error.data.errors)
      if(res.error.data.errors.non_field_errors){
        toast.error(res.error.data.errors.non_field_errors[0],{
          autoClose:autoclose
        })
      }
    }
    if (res.data) {
      setServerError({})
      // setServerMsg(res.data)
      toast.success(res.data.msg,{
        autoClose:autoclose
      })
      document.getElementById('password-reset-form').reset()
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }

  }
  return (
    <div className="w-full 300px:h-full  flex items-center !300px:justify-start 768px:justify-center">
    <div className='w-full  h-[200px] 300px:mt-[150px] 768px:mt-[100px] 300px:mb-[100px] 768px:mb-[50px]'>
      <div className="p-[20px] rounded-[3px] shadow-sm shadow-[#32ca00]  300px:w-[96%] 768px:w-[500px] mx-auto">
      <h1 className='font-[400] text-[16px] 768px:text-[20px] text-[#242424]'>Reset password</h1>
      <form onSubmit={handleSubmit} id='password-reset-form'>
        <label className='font-[400] text-[13px] text-[rgba(0,0,0,0.8)] my-[10px] block'>
          New Password :
        </label>
        <div className="relative">
        <input type={visible ? "text" : "password"} name="password"  className=' py-[10px] px-[30px] w-[95%] mx-auto 
        border-[1px] border-[rgba(0,0,0,0.5)] outline-none font-normal text-[10px] rounded-[5px]' placeholder='Enter password...'/>
        {server_error.password ? <p className='pt-[3px] font-[400] text-[10px] text-[red]'>{server_error.password[0]}</p>:""}
        {visible ? (
            <AiOutlineEye
              className="absolute right-8 top-[10px] 1350px:top-[10px] cursor-pointer text-[16px] text-gray-500"
              onClick={() => setVisible(false)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="absolute right-8 top-[10px] 1350px:top-[10px] text-[16px] cursor-pointer text-gray-500"
              onClick={() => setVisible(true)}
            />
          )}
          </div>
        <label className='font-[400] text-[13px] text-[rgba(0,0,0,0.8)] my-[10px] block'>
         Confirm Password :
        </label>
        <div className="relative">
        <input type={visible1 ? "text" : "password"} name="password2"  className=' py-[10px] px-[30px] w-[95%] mx-auto 
        border-[1px] border-[rgba(0,0,0,0.5)] outline-none font-normal text-[10px] rounded-[5px]' placeholder='Confirm password...'/>
        {server_error.password2 ? <p className='pt-[3px] font-[400] text-[10px] text-[red]'>{server_error.password2[0]}</p>:""}
        {visible1 ? (
              <AiOutlineEye
                className="absolute right-8 top-[10px] 1350px:top-[10px] cursor-pointer text-[16px] text-gray-500"
                onClick={() => setVisible1(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-8 top-[10px] 1350px:top-[10px] text-[16px] cursor-pointer text-gray-500"
                onClick={() => setVisible(true)}
              />
            )}
            </div>
        <button type="submit" className='border-none outline-none py-[5px] px-[10px]
        mt-[10px] w-[70px] text-[13px] text-center text-white font-[400] bg-[#32ca00] rounded-sm'>Save</button>
      </form>
      </div>
    </div>
    </div>
  )
}

export default ResetPassword
