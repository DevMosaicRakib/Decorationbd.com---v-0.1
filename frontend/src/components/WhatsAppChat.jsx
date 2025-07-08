import React, { useState } from "react";
import icon from "../Assets/img/wapp.png";
const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "8801717381296";

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    const message = encodeURIComponent("Hello, Message from your website!");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div
        onClick={toggleChat}
        className="fixed bottom-5 right-5 z-50 cursor-pointer group"
        title="WhatsApp Chat"
        >
         {/* <div className="w-15 h-15 rounded-full bg-green-600 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-green-600 relative">
          
            <div className="absolute inset-0 rounded-full ring-2 ring-green-400 animate-pulse opacity-50"></div>

            
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="w-8 h-8 z-[99999]"
            >
            <path d="M20.52 3.48A11.81 11.81 0 0012 0C5.372 0 0 5.373 0 12a11.7 11.7 0 001.674 6.032L0 24l6.138-1.608A11.848 11.848 0 0012 24c6.627 0 12-5.373 12-12a11.81 11.81 0 00-3.48-8.52zm-7.404 16.14a9.793 9.793 0 01-5.098-1.422l-.365-.22-3.66.957.976-3.563-.238-.374a9.783 9.783 0 011.535-12.937 9.793 9.793 0 019.86-1.756 9.819 9.819 0 015.688 7.88 9.79 9.79 0 01-2.94 8.684 9.76 9.76 0 01-7.027 3.37zm5.38-7.784c-.292-.146-1.72-.848-1.988-.944-.268-.098-.463-.146-.658.146-.195.292-.754.945-.923 1.14-.17.195-.337.22-.63.073-.292-.146-1.23-.45-2.344-1.443-.867-.773-1.45-1.728-1.62-2.02-.17-.292-.018-.45.128-.595.13-.13.292-.337.438-.505.146-.17.195-.292.292-.487.098-.195.05-.366-.025-.512-.073-.146-.658-1.584-.9-2.17-.236-.568-.476-.49-.658-.5-.17-.007-.366-.007-.56-.007s-.512.073-.78.366c-.268.292-1.026 1.003-1.026 2.44 0 1.438 1.05 2.83 1.2 3.03.146.195 2.07 3.164 5.01 4.436.7.303 1.244.484 1.668.619.7.226 1.337.194 1.84.118.56-.085 1.72-.7 1.964-1.38.244-.68.244-1.263.17-1.38-.073-.117-.268-.195-.56-.34z" />
            </svg>
        </div>  */}
        <div className="fixed bottom-5 right-6 max-w-16 max-h-16 bg-[#fff] rounded-full overflow-hidden flex items-center justify-center shadow-lg">
          <img src={icon} alt="WhatsApp Icon" className="w-[55px] h-[55px] object-cover rounded-full" />
        </div>
        </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-72 bg-white rounded-lg shadow-xl p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg ProxymaSemiBold text-gray-800">WhatsApp Chat</h4>
            <button
              onClick={toggleChat}
              className="text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              aria-label="Close Chat"
            >
              &times;
            </button>
          </div>
          <p className="mb-4 ProxymaRegular text-gray-600">Would you like to message us on WhatsApp?</p>
          <button
            onClick={sendMessage}
            className="w-full ProxymaSemiBold bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md transition"
          >
            Chat Now
          </button>
        </div>
      )}
    </>
  );
};

export default WhatsAppChat;
