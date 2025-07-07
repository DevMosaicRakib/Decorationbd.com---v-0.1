import {makeRequest} from "../makerequest";
import  { useEffect, useState } from 'react'

const useFetch = (endpoint) => {
    const [data,setData] = useState(null);
    

    useEffect(()=>{
        makeApiCall()
    },[endpoint])

    const makeApiCall = async () => {
        const res = await makeRequest(endpoint)
        setData(res)
        // console.log(res);
    }
  return data
}

export default useFetch


