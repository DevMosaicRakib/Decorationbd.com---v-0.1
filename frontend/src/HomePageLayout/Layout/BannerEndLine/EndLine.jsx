import React, { useState } from 'react'
import "./EndLine.scss"
// import Style from "../../../Styles/Styles";
const EndLine = () => {
    const [loadEndLine,setLoadEndLine] = useState(false)
  return (
    <div className={`h-[30px] 768px:h-[50px] 1350px:h-[40px] 1280px:w-[83%] 1350px:w-[81.5%]
      mx-auto w-[97%] 1280px:mx-auto
     mt-[20px] mb-[20px] 1280px:mb-[30px]  overflow-hidden`} >
      <div className={`h-full w-full p-[3px] bg-[#242424] ${loadEndLine?"":"sliding-line"} `}
      onLoad={()=>{setLoadEndLine(true)}}></div>
    </div>
  )
}

export default EndLine
