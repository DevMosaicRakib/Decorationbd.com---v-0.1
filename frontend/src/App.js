import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  HomePage,
  AboutPage,
  ContactPage,
  ShopPage,
  CartPage,
  ProductDetailsPage,
  ProfilePage,
  CheckOutPage,
  Faqs,
  DeliveryPolicyPage,
  ReturnPolicyPage,
  TermsAndConditionPage,
  PrivacyPolicyPage,
  CookiesPolicyPage,
  PaymentSuccessPage,
  PaymentFailurePage,
  ErrorPage
} from "./Routes.js";
import "./App.css";
import LayOut from "./Pages/LayOut/LayOut.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import SendResetPasswordEmail from "./components/ResetPassword/SendResetPasswordEmail.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import SetPassword from "./components/SetPassword/SetPassword.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import useFetch from '../src/customHooks/useFetch'
import SetLogin from "./Pages/SetLoginPage/SetLogin.jsx";
import Blog from "./Pages/Blog/Blog.jsx";
import CheckoutPopup from "./components/CheckoutPopup/CheckoutPopup.jsx";
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import wplogo from './Assets/img/Logo.png'
import MessengerCustomerChat from 'react-messenger-customer-chat';

const App = () => {
  const { access_token } = useSelector(state => state.auth)
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [dropDown,setDropDown] = useState(false);
  const [sameDay, setSameDay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoclose = 500;
  const decrementQuantity = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const incrementQuantity = () => {
    setCount(count + 1);
  };

  const shipping_charge = useFetch('dbd/api/deliverycharge/delivery_charge_list')
  
  function getCookie(name) {
    const cookieArr = document.cookie.split(";").map(c => c.trim());
    for (let cookie of cookieArr) {
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.split("=")[1]);
        }
    }
    return null;
   }

  function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  }
  // Check for existing device ID cookie
  let device = getCookie('device');
  if (!device) {
      device = uuidv4();
      // Set the device cookie with expiration and path
      document.cookie = `device=${device}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure`;
  }
  // Now retrieve the device cookie value
  const deviceCookie = getCookie('device');
  // console.log(deviceCookie);  // Should output the device ID



  return (
    <div className="scroll-smooth">
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LayOut dropDown={dropDown} setDropDown={setDropDown} deviceCookie={deviceCookie} isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen}
              setSameDay={setSameDay}/>}>
          <Route
            index
            element={
              <HomePage
                open={open}
                setOpen={setOpen}
                count={count}
                decrementQuantity={decrementQuantity}
                incrementQuantity={incrementQuantity}
                autoclose={autoclose}
                deviceCookie={deviceCookie}
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen}
              setSameDay={setSameDay}
              />
            }
          />
          <Route path="setlogin" element={!access_token ? <SetLogin autoclose={autoclose} setActive={setActive}/> : <Navigate to='/profile'/>} />
          <Route path="login" element={!access_token ? <LoginPage autoclose={autoclose} setActive={setActive}/> : <Navigate to='/profile'/>} />
          <Route path="signUp" element={!access_token ? <RegisterPage autoclose={autoclose}/> : <Navigate to='/profile'/>}/>
          <Route path="profile" element={access_token ? <ProfilePage autoclose={autoclose} active={active} setActive={setActive}/> : <Navigate to='/login'/>} />
          

          {/* Reset Password */}
           <Route path="sendpasswordresetemail" element={<SendResetPasswordEmail autoclose={autoclose}/>}/>
           <Route path="dbd/api/user/reset/:id/:token" element={<ResetPassword autoclose={autoclose} />} /> 

          {/* Set Password For Guest User */}
          <Route path="set-password/:id/:token" element={<SetPassword autoclose={autoclose} />} />
            
          {/* Static Pages */}
          <Route path="blog" element={<Blog />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="delivery-policy" element={<DeliveryPolicyPage />} />
          <Route path="return-policy" element={<ReturnPolicyPage />} />
          <Route path="terms" element={<TermsAndConditionPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="cookies" element={<CookiesPolicyPage />} />
            

          <Route
            path="shop"
            element={<ShopPage open={open} setOpen={setOpen} autoclose={autoclose} deviceCookie={deviceCookie} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />}
          />
          <Route
            path="product/:name"
            element={
              <ProductDetailsPage
                count={count}
                decrementQuantity={decrementQuantity}
                incrementQuantity={incrementQuantity}
                open ={open}
                setOpen = {setOpen}
                autoclose={autoclose}
                deviceCookie={deviceCookie}
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen}
                setSameDay={setSameDay}
              />
            }
          />

          <Route path="cart" element={<CartPage autoclose={autoclose} shipping_charge={shipping_charge} deviceCookie={deviceCookie} isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />} />
          <Route path="checkout" element={<CheckOutPage autoclose={autoclose} shipping_charge={shipping_charge} deviceCookie={deviceCookie}/>} />

          {/* Payment Status Page */}
          <Route path="success" element={<PaymentSuccessPage/>}/>
          <Route path="failure" element={<PaymentFailurePage/>}/>

          {/* Error Page */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      <ToastContainer/>
      {/* checkout popup */}
      {isModalOpen && (
              <CheckoutPopup 
              isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen} 
              sameDay={sameDay}
              />
            )}
      {/* <CheckoutPopup isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sameDay={sameDay} /> */}
      {/* Messenger Chat Plugin */}
      <MessengerCustomerChat
        pageId="463824586815253"
        appId="<APP_ID>"
      />,
        {/* WhatsAppChat Chat Plugin */}
        <FloatingWhatsApp 
          phoneNumber="+8801717381296"
          accountName="Decorationbd.com"
          avatar={wplogo}
          // statusMessage="Available 24/7"
          chatMessage="Hello, how can we help you?"
          notification
          notificationSound
          allowClickAway
          style={{ bottom: '80px', right: '20px' }}
        />
      </div>
  );
};

export default App;
