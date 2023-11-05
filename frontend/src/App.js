
import SearchBar from "./components/SearchBar";
import QuestionBox from "./components/AnswerBox";
import NavBar from "./components/NavBar"
import DownloadDialog from "./components/DownloadDialog"
import { useEffect, useState } from "react";
const instruction = "To receive a personalized answer from us, please start by uploading your document using the 'Upload' button provided. Once your file is successfully uploaded, a field will appear where you can type in your answer or relevant thoughts related to the document's content. Be as specific as possible to ensure the accuracy of the customized answer we generate for you. After submitting your information, hit the send button. Our system will then process your input and create a response tailored to the information you've shared. Please wait a moment for your customized answer to appear on the screen."

function App() {
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [answer, setAnswer] = useState([]);
    return (
      <>
        <NavBar toggleTabHandler={()=>{setIsDownloadOpen(!isDownloadOpen)}}/>
        <DownloadDialog 
        isDownloadOpen={isDownloadOpen} 
        closeTabHandler={()=>{setIsDownloadOpen(false)}}
        />
      <div className="px-10 mt-3 text-sm">
        <SearchBar
        setAnswer={setAnswer}
        answer={answer}
        />
        <QuestionBox 
        instruction={instruction} 
        type={true}
        answer={answer}
        />
        {/* <QuestionBox instruction={instruction} type={false}/> */}
      </div>
      </>
    )

}

export default App;
