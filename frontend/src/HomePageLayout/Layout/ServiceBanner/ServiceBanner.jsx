import React from 'react'

import "./ServiceBanner.scss";
const ServiceBanner = ({bannerData}) => {
  return (
    <div className={`1350px:w-[81.5%] 1350px:mx-auto 1024px:w-[98%] 1280px:w-[83%] w-[97%] mx-auto 1280px:mx-auto  bannerContainer3`}>
    <div className="imgContainer3">
    <img src={process.env.REACT_APP_IMG_URL+bannerData?.banner_media?.[0]?.media_file} alt="" />
    </div>
  </div>
  )
}

export default ServiceBanner
