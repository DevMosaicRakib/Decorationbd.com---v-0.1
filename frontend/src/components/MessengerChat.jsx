import { useEffect } from "react";

const MessengerChat = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v19.0",
      });
    };


    const chatDiv = document.createElement("div");
    chatDiv.id = "fb-customer-chat";
    chatDiv.className = "fb-customerchat";
    chatDiv.setAttribute("page_id", "463824586815253"); 
    chatDiv.setAttribute("attribution", "biz_inbox");
    document.body.appendChild(chatDiv);
  }, []);

  return (
    <>
      <div id="fb-root"></div>

      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"
      ></script>
    </>
  );
};

export default MessengerChat;
