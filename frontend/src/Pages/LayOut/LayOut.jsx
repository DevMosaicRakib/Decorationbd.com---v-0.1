import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"

const LayOut = ({dropDown,setDropDown,categories,deviceCookie,isModalOpen, setIsModalOpen,setSameDay}) => {
  
  return (
    <div>
      <Header dropDown={dropDown} setDropDown={setDropDown} categories={categories} deviceCookie={deviceCookie}               isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen} setSameDay={setSameDay} />  
      <Outlet setDropDown={setDropDown}/>
      <Footer/>
    </div>
  )
}

export default LayOut
