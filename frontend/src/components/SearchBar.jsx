import React, { useState } from "react";
import axios from 'axios'
import SendSVG from '../svg/send-icon.svg'
const SearchBar=()=>{
    const onSubmitHandler=(prompt)=>{
        axios.post(`https://witty-smock-ant.cyclic.app/query/`,{
            params:prompt
        })
        .then((res)=>console.log(res))
        .catch((err)=> console.log(err))
      }

    const [prompt, setPrompt] = useState('')
    return (
        <div className="relative">
            <input 
            type="text" 
            placeholder="Type your question..."
            className="border border-black rounded-3xl w-full font-lg h-12 px-4 focus:outline-black "
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}/>
            <div style={{transform: 'translateY(-50%)'}} className="w-8 rounded-3xl absolute top-1/2 right-3 bg-blue-200 p-2 cursor-pointer"
            onClick={()=>{onSubmitHandler(prompt)}}>
                <img className="" src={SendSVG} alt="Send Logo"/>
            </div>
        </div>
    )
}

export default SearchBar;