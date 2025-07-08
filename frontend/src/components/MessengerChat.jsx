import { useEffect } from "react";

const MessengerChat = () => {
  useEffect(() => {
    const loadMessenger = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          xfbml: true,
          version: "v19.0",
        });
      };

      const chatDiv = document.createElement("div");
      chatDiv.id = "fb-customer-chat";
      chatDiv.className = "fb-customerchat";
      chatDiv.setAttribute("page_id", "463824586815253"); // আপনার Page ID
      chatDiv.setAttribute("attribution", "biz_inbox");
      document.body.appendChild(chatDiv);

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.nonce = "abc";
      document.body.appendChild(script);
    };

    loadMessenger();
  }, []);

  return <div id="fb-root"></div>;
};

export default MessengerChat;
