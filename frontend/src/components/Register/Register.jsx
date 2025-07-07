import React,{useEffect, useState} from 'react'
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {FaFacebookF} from "react-icons/fa";
import Styles from "../../Styles/Styles"
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from '../../Redux/UserAndAuthServices/userAuthApi';
import {toast} from "react-toastify";
import { getToken,storeToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import axios from 'axios'
// import { getToken, storeToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../Redux/AuthAndUserSlice/authSlice";

const initialUser = {username:"",email:"",password:"",password2:""}
const Register = ({autoclose}) => {
    const [user,setUser] = useState(initialUser)
    const dispatch = useDispatch();
    // const [email,setEmail] = useState("");
    // const [password,setPassword] = useState("");
    // const [password2,setPassword2] = useState("");
    const[visible,setVisible] = useState("");
    const[ConfirmPassvisible,setConfirmPassVisible]=useState(false);
    // const[username,setUsername] = useState("");

    const handleChange = ({target})=>{
      const {name,value} = target
      setUser((currentUser)=>({
        ...currentUser,
        [name] : value
      }))
    }

    const [server_error, setServerError] = useState({})
    const [registerUser] = useRegisterUserMutation();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      const actualData = user;
      console.log(actualData);
      const res = await registerUser(actualData)
      if (res.error) {
        // console.log(typeof (res.error.data.errors))
        // console.log(res.error.data.errors)
        if (res?.error?.data?.errors?.non_field_errors) {
          toast.error(res?.error?.data?.errors?.non_field_errors[0],{
            autoClose:autoclose
          })
        }
        setServerError(res.error.data.errors)
      }
      if (res.data) {
        // console.log(typeof (res.data))
        console.log(res.data)
        setServerError({})
        toast.success(res?.data?.msg,{
          autoClose:autoclose
        })
        setUser(initialUser);
        // storeToken(res.data.token)
        setTimeout(() => {
          navigate('/login');
        }, 2000);
    }

      
    }

    // Google SingUp functions

    const handleSignUpWithGoogle = async (response) => {
      // console.log("Google Sign-In successful:", response);
      const payload = response.credential
      const server_res = await axios.post(`${process.env.REACT_APP_API_URL}dbd/api/user/google/`,{"access_token":payload})
      // console.log(server_res)
      if (server_res.data) {
        // console.log(typeof (res.data))
        // console.log(res.data)
        storeToken(server_res?.data?.token)
        // setServerError({})
        toast.success('SignIn Successfully !',{
          autoClose:autoclose
        })
        let { access_token } = getToken()
        // console.log(access_token);
        dispatch(setUserToken({ access_token: access_token }))
        // setUser(initialUser);
        // storeToken(res.data.token)
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    };
    let { access_token } = getToken()
    useEffect(() => {
      dispatch(setUserToken({ access_token: access_token }))
    }, [access_token, dispatch])
  
    useEffect(() => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleSignUpWithGoogle,
      });

      window.google.accounts.id.renderButton(document.getElementById("signUpDiv"),{
        theme: "outline",
        size: "medium",
        text: "continue_with",
        shape: "circle", // Customize as needed
        locale: "en",
        width: 270,
      });
  
    }, []);
  return (
    <div className="h-full 1280px:min-h-screen bg-gray-50 flex flex-col justify-center 
    1024px:justify-start mt-[30px] 1280px:mt-0 py-12 sm:px-6 lg:px-8 1350px:py-1 1280px:py-0 300px:mx-2 768px:mx-0">

      <div className="mt-7 1350px:mt-[15px] sm:mx-auto sm:w-full sm:max-w-md 1350px:w-[100%] 1350px:max-w-[350px] 
      rounded-sm shadow shadow-[#212121]">
        <div className="bg-white py-8 1350px:py-3 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="mb-[20px] text-center text-[16px] 768px:text-[19px] ProxymaSemiBold text-gray-700">
          Register as a new user
        </h2>
          <form className="space-y-5 1280px:space-y-4 1350px:space-y-[6px]" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
              >
                Username :
              </label>
              <div className="mt-1 ">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="Enter a valid username***"
                  value={user.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 ProxymaRegular
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[11px]"
                />
                {server_error?.username ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.username[0]}</p>:""}
                
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
              >
                Email address :
              </label>
              <div className="mt-1 1350px:mt-[2px]">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email***"
                  value={user.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 ProxymaRegular
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[11px]"
                />
                {server_error?.email ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.email[0]}</p>:""}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
              >
                Password :
              </label>
              <div className="mt-1 1350px:mt-[2px] relative">
                <input
                  type={visible?"text":"password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password***"
                  value={user.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 ProxymaRegular
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[11px]"
                />
                {visible? <AiOutlineEye 
                
                className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                onClick={()=>setVisible(false)} 
                />  : <AiOutlineEyeInvisible 
               
                className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                onClick={()=>setVisible(true)} 
                />}
                {server_error?.password ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.password[0]}</p>:""}
              </div>
            </div>
            <div>
              <label
                htmlFor="password2"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
              >
                Confirm Password :
              </label>
              <div className="mt-1 1350px:mt-[2px] relative">
                <input
                  type={ConfirmPassvisible?"text":"password"}
                  name="password2"
                  autoComplete="current-password"
                  required
                  placeholder="Confirm your password***"
                  value={user.password2}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 ProxymaRegular
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[11px]"
                />
                {ConfirmPassvisible? <AiOutlineEye 
               
                className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                onClick={()=>setConfirmPassVisible(false)} 
                />  : <AiOutlineEyeInvisible 
                
                className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[18px] 1350px:text-[16px]"
                onClick={()=>setConfirmPassVisible(true)} 
                />}
                {server_error?.password2 ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.password2[0]}</p>:""}
              </div>
            </div>

            <div>
            <button type="submit" className="group relative w-full h-[40px] 1350px:h-[32px] flex justify-center 
                    py-2 1350px:py-[6px] px-4 border border-transparent ProxymaSemiBold rounded-sm text-white text-[13px]
                    bg-[#f57224] hover:bg-[#f57124ea]">Sign Up</button>
                </div>

                <div className='flex items-center justify-center 
                w-full ProxymaSemiBold text-[12px] text-[rgb(36,36,36,0.7)]'>or</div>

                {/* SignUp with google */}

                  {/* <div className={`${Styles.normal_flex} justify-center w-[100%] bg-[red]` }> */}
                  <div id='signUpDiv' className={`${Styles.normal_flex} justify-center
                   w-[100%]`}>
                  </div>
                  {/* <div className='w-[48%]'>
                  <button type="button" onClick={()=>{toast.error('Sorry !! This service is not available now.')}}
                      className=" relative w-full h-[40px] 1350px:h-[32px] flex
                      py-[10px] 1350px:py-[8px]  px-[5px] border border-[rgb(128,128,128,0.5)] text-[12px] font-[400] rounded-sm 1350px:text-[11px]
                      text-[#242424] bg-transparent hover:bg-[rgb(234,234,234)] ">Sign in with Facebook <span className="absolute 
                        1350px:right-0 right-[10px]
                      300px:top-3 1350px:top-2  items-center "><FaFacebookF 
                      className="text-[14px] text-[#077bc4]"/></span></button>
                  </div> */}
                {/* </div> */}

                {/* End SignUp with google */}

                <div className={`${Styles.normal_flex} w-full`}>
                    <h4 className='1350px:text-[12px] ProxymaRegular'>Already have an acccount?</h4>
                    <Link to="/login" className="text-[#007bc4] pl-2 1350px:text-[12px] underline ProxymaSemiBold">
                        Login
                    </Link>
                </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
