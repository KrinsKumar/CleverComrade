import React, { useState } from "react";
const map = new Map([
    [0, "https://1drv.ms/t/s!AOvy9PwIa7H_aw"],

  ]);

const QuestionBox = ({ instruction, type, answer }) => {
  const [count, setCount] = useState(0);
  console.log(answer);
  if (!answer) return <div></div>;
  const reversed_answer = answer.toReversed();
  
  return (
    <div>
      {reversed_answer.map((ans, index) => (
        <div className="lg:mx-16" key={index}>
          <p className={"text-lg my-4 p-3 rounded-md " + (index % 2 === 0 ? "bg-blue-100" : "bg-blue-100")}>
            {ans?.map((a, i) => {
              if (a.score <= 0.65) return <div key={i}></div>;
              return (
                <span key={i}>
                  {a.text}
                  <a target="_blank"className="bg-white inline-block w-6 rounded mx-1 text-center cursor-pointer hover:text-blue-500" href={map.get(a.documentIndex)}>
                    {a.documentIndex}
                  </a>
                </span>
              );
            })}
            {ans.every((a) => a.score <= 0.65) && count < 1 ? "We don't have information to answer your question..." : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuestionBox;