import React, { useEffect, useRef, useState } from 'react'
import "./BannerArea.scss"
// import useFetch from "../../../customHooks/useFetch"
const BannerAre = ({ bannerData }) => {
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!bannerData?.banner_media?.length) return;

    const observers = [];

    videoRefs.current.forEach((video) => {
      if (!video) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch((err) => console.log("Play error:", err));
          } else {
            video.pause();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(video);
      observers.push({ observer, video });
    });

    return () => {
      observers.forEach(({ observer, video }) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [bannerData]);

  const getMediaComponent = (media, index) => {
    const fileUrl = `${process.env.REACT_APP_IMG_URL}${media?.media_file}`;
    const fileExtension = media?.media_file?.split(".").pop()?.toLowerCase();

    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <video
          ref={(el) => (videoRefs.current[index] = el)}
          src={fileUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return <img src={fileUrl} alt="" className="w-full h-full object-cover" />;
    } else {
      return <p>Unsupported Format</p>;
    }
  };

  return (
    <div className="1350px:w-[81.5%] 1024px:w-[98%] 1280px:w-[83%] mx-auto w-[98%]">
      <div className="imageContainer grid grid-cols-1 md:grid-cols-3 ">
        <div className="firstImg">
          {getMediaComponent(bannerData?.banner_media[0], 0)}
        </div>
        <div className="midTwoimg grid grid-cols-1 grid-rows-2 ">
          <div className="midImg1">
            {getMediaComponent(bannerData?.banner_media[1], 1)}
          </div>
          <div className="midImg2">
            {getMediaComponent(bannerData?.banner_media[2], 2)}
          </div>
        </div>
        <div className="lastImg">
          {getMediaComponent(bannerData?.banner_media[3], 3)}
        </div>
      </div>
    </div>
  );
};


export default BannerAre
