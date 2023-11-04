import React from "react";
import SendSVG from '../svg/send-icon.svg'
const SearchBar=()=>{
    return (
        <div className="relative">
            <input 
            type="text" 
            placeholder="Type your question..."
            className="border border-black rounded-3xl w-full font-lg h-12 px-4 focus:outline-black "/>
            <div style={{transform: 'translateY(-50%)'}} className="w-8 rounded-3xl absolute top-1/2 right-3 bg-blue-200 p-2 cursor-pointer">
                <img className="" src={SendSVG} alt="Send Logo"/>
            </div>
        </div>
    )
}

export default SearchBar;