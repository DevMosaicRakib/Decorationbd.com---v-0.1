import React, { useState } from 'react'
import { FaqData } from './FaqData';
import Faq from './Faq'
import './Faqs.scss'
const Faqs = () => {
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
    <div className="faqSection w-[100%] 1024px:w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto">
    <div className="fullfaq">
      <div className="headingPart">
        <h4>INFORMATION QUESTIONS</h4>
        <h1>FREQUENTLY ASKED QUESTIONS</h1>
      </div>
      <div className="faqs">
        {showAns.map((faq, i) => (
          <Faq key={i} faq={faq} index={i} toggleFaq={toggleFaq} />
        ))}
      </div>
    </div>
  </div>
  )
}

export default Faqs
