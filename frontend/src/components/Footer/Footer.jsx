import React from "react";
// import Style from "../../../Styles/Styles";
import logo from "../../Assets/img/footerlogo.png";
import lg from "../../Assets/img/pay.png";
import { FaEnvelope, FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa6";
// import { FaRegEnvelope } from "react-icons/fa";
import { FaMobile } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import github from '../../Assets/img/DevContactLinkImg/github.png';
import linkedin from '../../Assets/img/DevContactLinkImg/linkedin.png';
import whatsapp from '../../Assets/img/DevContactLinkImg/whatsapp.png';
import { FcAndroidOs } from "react-icons/fc";
import { IoIosApps } from "react-icons/io";
import "./Footer.scss";
import appicon from "../../Assets/img/googleplay.png"
import { Link } from "react-router-dom";
const Footer = () => {

  return (
    <div className={`footerSection`}>
      <div
        className="others flex 768px:items-center 300px:flex-col 300px:justify-center 
        768px:flex-row 768px:justify-around 300px:w-[100%] h-[100%] 1024px:w-[100%] 1024px:h-[100%]
        1280px:w-11/12 1350px:w-[90%] 1350px:h-[80%] mx-auto "
      >
        
        <div className="footerImg ">
          <div className=" ">
            <img src={logo} alt="" className="1280px:w-[160px] 1280px:h-[160px] 
            300px:w-[160px] 300px:h-[160px] 300px:mx-auto 768px:w-[160px] 768px:h-[160px] 768px:mx-0 object-contain "/>
          </div>    
        </div>

        <div className="category ">
          <div className="title">popular categories</div>
          <div className="items">
            <div><Link to='/'>Monitor Arms</Link></div>
            <div><Link to='/'>Home & Decor</Link></div>
            <div><Link to='/'>Furniture</Link></div>
            <div><Link to='/'>Kitchenware</Link></div>
          </div>
        </div>

        <div className="links ">
          <div className="title">Useful Links</div>
          <div className="items">
            <div><Link to='/about'>About Us</Link></div>
            <div><Link to='/faqs'>Faqs</Link></div>
            <div><Link to='/delivery-policy'>Delivery Policy</Link></div>
            <div><Link to='/return-policy'>Return & Refund Policy</Link></div>
          </div>
        </div>

        <div className="links ">
          <div className="title">Legal</div>
          <div className="items">
            <div><Link to='/terms'>Terms & conditions</Link></div>
            <div><Link to='/privacy'>Privacy policy</Link></div>
            <div><Link to='/cookies'>Cookies policy</Link></div>
            <div><Link to='/contact'>Contact</Link></div>
          </div>
        </div>

        <div className="contact 1350px:mb-[20px]">
          <div className="title">Contact Us</div>
          <div className="item">
            <FaMobile />
            <span>+8801717381296</span>
          </div>
          <div className="item">
            <FaEnvelope />
            <span> mnhodarajib@gmail.com</span>
          </div>
          <div className="item ">
      
          <a href="#" className="1350px:text-[14px] hover:text-[#007bc4]">
            <FaFacebookF />
          </a>
          <a href="#" className="1350px:text-[14px] hover:text-[#007bc4]">
            <FaInstagram />
          </a>
          <a href="#" className="1350px:text-[14px] hover:text-[#007bc4]">
            <FaTwitter />
          </a>
          <a href="#" className="1350px:text-[14px] hover:text-[#007bc4]">
            <FaYoutube />
          </a>
          <a href="#" className="1350px:text-[14px] hover:text-[#007bc4]">
            <FaPinterestP />
          </a>
        
          </div>
        </div>

      </div>
      
      {/* <div className="w-full bg-[#000000] h-[10%]">
        <div className="1350px:w-[81.5%] 1280px:w-[83%] 768px:w-[90%] w-[100%] bg-[#27292c] justify-center mx-auto rounded-sm
        text-[13px] h-[50px] text-[#d4d5d5] font-[400] flex items-center">all rights reserved © 2020 - 2024 decorationbd.com ​</div>
      </div> */}
        <div className="w-full bg-transparent h-[10%]">
          <div className="1350px:w-[81.5%] 1280px:w-[83%] 768px:w-[90%] w-[100%] bg-[#27292c] mx-auto rounded-sm 300px:py-[5px] 768px:py-0
          text-[13px] h-[65px] 768px:h-[50px] text-[#fff] ProxymaRegular flex 300px:flex-col 768px:flex-row items-center justify-center">
            <span className="text-[12.6px] text-[#fff] 
            flex-1 text-center 768px:ml-[170px] 1024px:ml-[200px]">all rights reserved © 2020 - 2025 Decorationbd.com</span>
            <div className="mr-[5px]">
              <span className="text-[12.3px] text-[#fff]">Developed by : Md. Rakib Hasan Khan</span>
              <span className="flex items-center justify-center gap-[10px]">
                <span className="text-[12.3px] text-[#fff]">Contact :</span>
                <a href="https://github.com/DevMosaicRakib"><img src={github} alt="github" className="w-[18px] h-[18px] overflow-hidden rounded-[50%] bg-[rgb(128,128,128,0.5)]"/></a>
                <a href="https://www.linkedin.com/in/md-rakib-hasan-khan-6593a1324/"><img src={linkedin} alt="linkedin" className="w-[18px] h-[18px] overflow-hidden rounded-[50%] bg-[rgb(128,128,128,0.5)]"/></a>
                <a href="https://wa.me/01747065190"><img src={whatsapp} alt="whatsapp" className="w-[18px] h-[18px] overflow-hidden rounded-[50%] bg-[rgb(128,128,128,0.5)]"/></a>
              </span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Footer;
