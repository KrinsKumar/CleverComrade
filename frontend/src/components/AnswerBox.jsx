import React from "react";
const QuestionBox = ({instruction, type}) => {
    return (
        <div>
            <p className={"text-lg border border-black my-4 p-3 rounded-md "+ (type?"bg-blue-100":"bg-orange-100")}>{instruction}</p>
        </div>
    )
}

export default QuestionBox;