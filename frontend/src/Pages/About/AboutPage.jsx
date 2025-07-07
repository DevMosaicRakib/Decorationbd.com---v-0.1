import React, { useState } from 'react'
// import Faqs from '../Faqs/Faqs'
import Faq from '../Faqs/Faq'
import {FaqData} from '../Faqs/FaqData'
import "./AboutPage.scss"
const AboutPage = () => {
  const [showAns, setShowAns] = useState(FaqData);
  const toggleFaq = (index) => {
      setShowAns(
        showAns.map((faq, i) => {
          if (i === index) {
            faq.open = !faq.open;
          } else {
            faq.open = false;
          }
          return faq;
        })
      );
    };
  return (
    <div className=''>


      <div className="faqSection w-[100%] 1024px:w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto">
    <div className="fullfaq">
      {/* <div className="headingPart">
        <h4>INFORMATION QUESTIONS</h4>
        <h1>FREQUENTLY ASKED QUESTIONS</h1>
      </div> */}
      <div className="text-center">
        <h1 className='underline-heading uppercase ProxymaSemiBold text-[16px] 768px:text-[20px] text-[#242424]'>About us</h1>
      </div>
      <div className="faqs">
        {showAns.map((faq, i) => (
          <Faq key={i} faq={faq} index={i} toggleFaq={toggleFaq} />
        ))}
      </div>
    </div>
  </div>

    </div>
  )
}

export default AboutPage
