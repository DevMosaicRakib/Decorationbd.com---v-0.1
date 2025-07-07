import React, { useEffect, useState } from "react";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import styles from "../../Styles/Styles"
import { Link, useLocation, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import { useLoginUserMutation} from "../../Redux/UserAndAuthServices/userAuthApi";
import { getToken, storeToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../Redux/AuthAndUserSlice/authSlice";
import axios from "axios";
// import GoogleLoginButton from "../../GoogleLogin/GoogleLoginButton";
// import { GoogleOAuthProvider } from "@react-oauth/google";
const initialUser = {email:"",password:""};
const Login = ({autoclose,setActive}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    const [user,setUser] = useState(initialUser)
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const [server_error, setServerError] = useState({})
    const dispatch = useDispatch();
    // const [email,setEmail] = useState("");
    // const [password,setPassword] = useState("");
    const[visible,setVisible] = useState(false);
    const handleInputChange = ({ target }) => {
      const { name, value } = target;
      setUser((currentUser) => ({
        ...currentUser,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const actualData = user;
      // console.log(actualData);
      const res = await loginUser(actualData)
      console.log(res);
      if (res.error) {
        // console.log(typeof (res.error.data.errors))
        // console.log(res.error.data.errors)
        if (res?.error?.data?.errors?.non_field_errors) {
          toast.error(res?.error?.data?.errors?.non_field_errors[0],{
            autoClose:autoclose
          })
        }
        setServerError(res?.error?.data?.errors)
      }
      if (res.data) {
        // console.log(typeof (res.data))
        // console.log(res.data)
        storeToken(res?.data?.token)
        setServerError({})
        toast.success(res?.data?.msg,{
          autoClose:autoclose
        })
        let { access_token } = getToken()
        // console.log(access_token);
        dispatch(setUserToken({ access_token: access_token }))
        setUser(initialUser);
        // storeToken(res.data.token)
 
        setTimeout(()=>{
          navigate('/');
          window.location.reload();
        },1000)
        
  
    }
      
      
    }

    let { access_token } = getToken()
    useEffect(() => {
      dispatch(setUserToken({ access_token: access_token }))
    }, [access_token, dispatch])



    // SignIn Function Google
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
        setTimeout(()=>{
          navigate('/');
        },1000)
      }
    };

    useEffect(() => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleSignUpWithGoogle,
      });

      window.google.accounts.id.renderButton(document.getElementById("signInDiv"),{
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
    1024px:justify-start mt-[30px] 1280px:mt-0 py-12 sm:px-6 lg:px-8 1280px:py-10 1350px:py-6 300px:mx-2 768px:mx-0">
    {message && <div className="text-center 
    sm:mx-auto sm:w-full sm:max-w-md 1350px:w-[100%] 1350px:max-w-[360px] 
    rounded-sm flex justify-center mx-auto bg-[#fef3f2] py-1">
       <p className="text-[14px] ProxymaBold text-[#f57224] flex-[0.2]">Notice : </p>
       <p className="text-[15px] ProxymaSemiBold text-gray-600 flex-[0.6]">{message}</p>  
    </div>}

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md 1350px:w-[100%] 1350px:max-w-[350px]
      rounded-sm shadow shadow-[#212121]">
        <div className="bg-white py-8 px-4 1350px:py-3 shadow sm:rounded-lg sm:px-10">
        <h2 className="mb-[20px] text-center text-[16px] 768px:text-[19px] ProxymaSemiBold
         text-gray-700">
          Login to Decorationbd
        </h2>
          <form className="space-y-5 1350px:space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
              >
                Email address :
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email***"
                  value={user.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 1350px:py-2 border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-400 ProxymaRegular
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[11px]"
                />
                {server_error.email ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.email[0]}</p>:""}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[13px] ProxymaSemiBold text-gray-700"
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
                  value={user.password}
                  onChange={handleInputChange}
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
                {server_error.password ? <p className='pt-[3px] ProxymaRegular text-[10px] text-[red]'>{server_error.password[0]}</p>:""}
              </div>
            </div>
            <div className={`${styles.normal_flex} justify-between`}>
                <div className={`${styles.normal_flex}`}>
                    <input type="checkbox" name="remember-me" id="remember-me"
                    className="h-4 w-4 1350px:h-3 1350px:w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-gray-800 text-[12px] ProxymaRegular">
                        Remember me
                    </label>
                </div>
                <div className="text-[12px]">
                    <Link to='/sendpasswordresetemail' className="ProxymaSemiBold text-[#007bc4] hover:text-[#007bc4] hover:underline">
                        Forgot your password?
                    </Link>
                    
                </div>
            </div>

            <div>
                    <button type="submit" className="group relative w-full h-[40px] 1350px:h-[32px] flex justify-center 
                    py-2 1350px:py-[6px] px-4 border border-transparent ProxymaSemiBold rounded-sm text-white text-[13px]
                    bg-[#f57224] hover:bg-[#f57124ea]  ">Login</button>
                </div>

                <div className='flex items-center justify-center 
                w-full ProxymaSemiBold text-[12px] text-[rgb(36,36,36,0.7)]'>or</div>

                {/* SignIn with Google */}

                <div id='signInDiv' className={`${styles.normal_flex} justify-center
                   w-[100%]`}>
                  </div>

                {/* End SignIn with google */}

                <div className={`${styles.normal_flex} w-full`}>
                    <h4 className="text-[12px] ProxymaRegular">Not have any acccount?</h4>
                    <Link to="/signUp" className="text-[#007bc4] pl-2 text-[12px] ProxymaSemiBold underline">
                        Sign Up
                    </Link>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
