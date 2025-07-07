import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSetPasswordMutation } from '../../Redux/UserAndAuthServices/userAuthApi'
import { toast } from 'react-toastify'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const SetPassword = ({autoclose}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userEmail = params.get('email'); // Extract email from query params
    const [server_error, setServerError] = useState({})
    // const [server_msg, setServerMsg] = useState({})
    const [visible,setVisible] = useState(false)
    const [visible1,setVisible1] = useState(false)
    const [setPassword] = useSetPasswordMutation()
    const { id, token } = useParams()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const actualData = {
        email: data.get('email'),
        password: data.get('password'),
        password2: data.get('password2'),
      }
      const res = await setPassword({ actualData, id, token })
      if (res?.error) {
        // setServerMsg({})
        setServerError(res?.error?.data?.errors)
        if(res?.error?.data?.errors?.non_field_errors){
          toast.error(res?.error?.data?.errors?.non_field_errors[0],{
            autoClose:autoclose
          })
        }
      }
      if (res?.data) {
        setServerError({})
        // setServerMsg(res.data)
        toast.success(res?.data?.msg,{
          autoClose:autoclose
        })
        document.getElementById('set-password-form').reset()
        setTimeout(() => {
          navigate("/setlogin")
        }, 3000)
      }
  
    }
    return (
        <div className="h-full 1280px:min-h-screen bg-gray-50 flex flex-col justify-center 
        1024px:justify-start mt-[30px] 1280px:mt-0 py-12 sm:px-6 lg:px-8 1280px:py-10 1350px:py-6 300px:mx-2 768px:mx-0">
    
          <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md 1350px:w-[100%] 1350px:max-w-[350px]
          rounded-sm shadow shadow-[#212121]">
            <div className="bg-white py-8 px-4 1350px:py-3 shadow sm:rounded-lg sm:px-10">
            <h2 className="mb-[20px] text-center text-[16px] 768px:text-[20px]
            font-[500] text-gray-700">
              Set Your Password
            </h2>
              <form className="space-y-5 1350px:space-y-4" id='set-password-form' onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-[12px] font-[400] text-gray-700"
                  >
                    Email :
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type='email'
                      name="email"
                      required
                      readOnly
                      value={userEmail}
                    //   onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                      shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[10px]"
                    />
                    {server_error.password ? <p className='pt-[3px] font-[400] text-[10px] text-[red]'>{server_error.password[0]}</p>:""}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[12px] font-[400] text-gray-700"
                  >
                    Password :
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible?"text":"password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password***"
                    //   value={user.password}
                    //   onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                      shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[10px]"
                    />
                    {visible? <AiOutlineEye 
                   
                    className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                    onClick={()=>setVisible(false)} 
                    />  : <AiOutlineEyeInvisible 
                    
                    className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                    onClick={()=>setVisible(true)} 
                    />}
                    {server_error.password ? <p className='pt-[3px] font-[400] text-[10px] text-[red]'>{server_error.password[0]}</p>:""}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[12px] font-[400] text-gray-700"
                  >
                    Confirm Password :
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible?"text":"password"}
                      name="password2"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password***"
                    //   value={user.password}
                    //   onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                      shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[10px]"
                    />
                    {visible? <AiOutlineEye 
                   
                    className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                    onClick={()=>setVisible(false)} 
                    />  : <AiOutlineEyeInvisible 
                    
                    className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                    onClick={()=>setVisible(true)} 
                    />}
                    {server_error.password2 ? <p className='pt-[3px] font-[400] text-[10px] text-[red]'>{server_error.password2[0]}</p>:""}
                  </div>
                </div>
                
                <div>
                        <button type="submit" className="group relative w-full h-[40px] 1350px:h-[32px] flex justify-center 
                        py-2 1350px:py-[6px] px-4 border border-[rgb(0,0,0,0.6)] font-[400] rounded-sm text-[#242424] text-[12px]
                        bg-transparent hover:bg-[rgb(128,128,128,0.3)]  ">Set Password</button>
                    </div>
    
      

    
                
              </form>
            </div>
          </div>
        </div>
    )
}

export default SetPassword