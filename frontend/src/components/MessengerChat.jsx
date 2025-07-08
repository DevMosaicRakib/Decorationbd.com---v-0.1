import { useEffect } from "react";

const MessengerChat = () => {
  useEffect(() => {
   
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v19.0",
      });
    };

    
    if (!document.getElementById("fb-root")) {
      const fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }

    
    if (!document.getElementById("fb-customer-chat")) {
      const chatDiv = document.createElement("div");
      chatDiv.id = "fb-customer-chat";
      chatDiv.className = "fb-customerchat";
      chatDiv.setAttribute("page_id", "463824586815253");
      chatDiv.setAttribute("attribution", "biz_inbox");
      document.body.appendChild(chatDiv);
    }

    
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, []);

  return null; 
};

export default MessengerChat;
