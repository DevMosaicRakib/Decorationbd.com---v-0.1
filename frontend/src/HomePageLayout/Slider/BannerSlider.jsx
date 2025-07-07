import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "./BannerSlider.scss";
import DropDown from "../Layout/StickyCategory/SickyCategory";
import useFetch from "../../customHooks/useFetch";

const BannerSlider = () => {
  const bData = useFetch("dbd/api/sliderImg/");
  const [currentSlider, setCurrentSlider] = useState(0);
  const videoRef = useRef(null);

  const nextSlider = () => {
    setCurrentSlider((prev) =>
      prev === bData?.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlider = () => {
    setCurrentSlider((prev) =>
      prev === 0 ? bData?.length - 1 : prev - 1
    );
  };

  // Slide timeout control based on media type
  useEffect(() => {
    if (!bData || bData.length === 0) return;

    const currentItem = bData[currentSlider];
    const fileExtension = currentItem?.media_file?.split(".").pop()?.toLowerCase();
    let timeout;

    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      const videoElement = videoRef.current;
      if (videoElement?.duration) {
        timeout = setTimeout(() => {
          nextSlider();
        }, videoElement.duration * 1000);
      } else {
        timeout = setTimeout(() => {
          nextSlider();
        }, 7000);
      }
    } else {
      timeout = setTimeout(() => {
        nextSlider();
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [currentSlider, bData]);

  // IntersectionObserver for pause/play logic
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play().catch((err) => console.log("Play error:", err));
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      if (videoElement) observer.unobserve(videoElement);
    };
  }, [currentSlider]);

  return (
    <div className="flex justify-between items-start mx-auto 1280px:w-[83%] 1350px:w-[81.5%]">
      <div className="category_dropdown w-[300px] hidden 1280px:block">
        <DropDown />
      </div>

      <div className="carousle mx-auto 1280px:mx-0">
        <div className="carousle_wrapper relative">
          {bData?.map((item, index) => {
            const fileUrl = `${process.env.REACT_APP_IMG_URL}${item?.media_file}`;
            const fileExtension = item?.media_file?.split(".").pop()?.toLowerCase();
            const isActive = index === currentSlider;

            return (
              <div
                key={index}
                className={
                  isActive
                    ? "carousle_card carousle_card-active"
                    : "carousle_card hidden"
                }
              >
                {["mp4", "webm", "ogg"].includes(fileExtension) ? (
                  <video
                    ref={isActive ? videoRef : null}
                    src={fileUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedMetadata={() => {
                      // duration will be available now
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : ["gif", "jpg", "jpeg", "png"].includes(fileExtension) ? (
                  <img src={fileUrl} alt={item.title} />
                ) : (
                  <p>Not supported</p>
                )}
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <div
            className="arrow_left absolute top-1/2 -translate-y-1/2 left-4 cursor-pointer"
            onClick={prevSlider}
          >
            <IoIosArrowBack />
          </div>
          <div
            className="arrow_right absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
            onClick={nextSlider}
          >
            <IoIosArrowForward />
          </div>

          {/* Pagination Dots */}
          <div className="pagination flex justify-center mt-4">
            {bData?.map((_, index) => (
              <div
                key={index}
                className={
                  index === currentSlider
                    ? "pagination_dot pagination_dot-active"
                    : "pagination_dot"
                }
                onClick={() => setCurrentSlider(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
