import React, { useState } from "react";
import axios from 'axios';
import "./Contact.scss";
import {toast} from 'react-toastify'
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}dbd/api/email/contact/`, formData);
      console.log(response)
      toast.success(response.data.message)
      if (response.data){
        setFormData({
          name: '',
          email: '',
          message: ''
        })
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-[100%] 1280px:w-[83%] 1350px:w-[81.5%] 
    mx-auto bg-[rgb(234,234,234,0.3)] mt-[80px] 1280px:mt-[20px] p-[20px]">
      <h1 className="heading uppercase text-[16px] 768px:text-[20px] ProxymaSemiBold w-[100%] 
        text-center">Contact us</h1>
        <div className="w-full flex flex-col 768px:flex-row 
        items-start justify-center gap-[30px] 768px:gap-[100px]">
      <div className="768px:w-[40%] w-full mx-auto 768px:mx-0 ">
        <p className="text-[12.3px] ProxymaRegular text-[rgb(36,36,36,0.9)] w-[98%] 
        768px:w-[100%]  mb-[10px]">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          voluptatum quia voluptates doloremque ipsam repellendus dolorum amet
          explicabo reprehenderit cum ducimus vitae porro exercitationem,
          cupiditate nulla alias consequuntur odio ratione debitis provident qui
          velit incidunt quisquam autem? Facilis esse et impedit eaque libero,
          facere eum autem similique molestias harum illo explicabo ullam
          accusamus officia dolore aperiam rerum nobis at consequuntur
          distinctio est quas! Qui, quis dolorem ullam dolore possimus modi quas
          distinctio. Eum incidunt tempore numquam impedit dolore! Ullam et
          officia magnam, delectus distinctio assumenda quia aliquid quod esse
          aperiam accusamus, laborum explicabo odio nemo vero nostrum. Ipsam
          accusamus dicta consequatur expedita officiis neque, deleniti eius
          quidem quia aperiam perspiciatis facilis ipsum provident aliquid vel
          explicabo quos, esse saepe, repudiandae repellendus dolorem? Nulla
          dolore id, laborum accusantium est ex, consequuntur delectus
          doloremque asperiores dignissimos fuga enim adipisci esse hic fugit
          quibusdam aliquid incidunt. Numquam similique nihil repellendus
          molestiae, unde inventore distinctio vitae aliquam hic mollitia natus
          vel optio assumenda omnis incidunt sapiente perferendis sed impedit
          molestiae, unde inventore distinctio vitae aliquam hic mollitia natus
          nobis quam vitae corporis officia! Neque facere itaque quod officiis
        </p>
      </div>

      <div className="768px:w-[30%] w-full mx-auto 768px:mx-0 bg-[rgb(128,128,128,0.1)] 
      shadow-sm shadow-[transparent] p-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-[10px]">
          <label className="text-[13px] ProxymaSemiBold block mb-[5px] text-[rgb(36,36,36,0.9)]">Name:</label>
           <input type="text" className="px-[10px] py-[5px] ProxymaRegular
           text-[11px] w-[90%] border-[1px] boreder-[gray] outline-0"
           name="name"
           value={formData.name}
           onChange={handleChange}
           required 
           placeholder="Enter your name..."/>
          </div>

          <div className="mb-[10px]">
          <label className="text-[13px] ProxymaSemiBold block mb-[5px] text-[rgb(36,36,36,0.9)]">Email:</label>
           <input type="email" className="px-[10px] py-[5px] ProxymaRegular
           text-[11px] w-[90%] border-[1px] boreder-[gray] outline-0"
           name="email" 
           value={formData.email}
           onChange={handleChange}
           required
           placeholder="Enter your email..."/>
          </div>

          <div className="mb-[10px]">
          <label className="text-[13px] ProxymaSemiBold block mb-[5px] text-[rgb(36,36,36,0.9)]">Message:</label>
           <textarea cols="20" rows="5" className="px-[10px] py-[5px] ProxymaRegular
           text-[11px] w-[90%] border-[1px] boreder-[gray] outline-0" 
           name="message"
           value={formData.message}
           onChange={handleChange}
           required
           placeholder="Enter your message..."></textarea>
          </div>
          <button type="submit" className="text-[13px] capitalize
           ProxymaSemiBold outline-none border-[1px] border-[rgb(128,128,128,0.6)] p-[5px] bg-[rgb(203,204,204,0.5)]">send message</button>
        </form>
      </div>

      </div>
    </div>
  );
};

export default ContactPage;
