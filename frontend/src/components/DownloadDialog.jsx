import React, { useRef, useState } from "react";
import axios from 'axios';
function DownloadDialog({isDownloadOpen, closeTabHandler}) {
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const [droppedFiles, setDroppedFiles] = useState([]);
  console.log(droppedFiles);
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const onSubmitHander = ()=>{
    const data = new FormData()
    data.append('file', droppedFiles[0],  droppedFiles[0].name)
    // data.append('filename', droppedFiles[0].name)

    axios.post("http://localhost:8080/upload", data
        // onUploadProgress: ProgressEvent => {
        //   this.setState({
        //     loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
        //   })
        // },
      )
      .then(res => {
        console.log(res)
      })
      .catch(err=>console.log(err))
  }

  const handleDrop = (e) => {
    e.preventDefault();

    // const files = Array.from(e.dataTransfer.files);
    // // console.log(files)
    // console.log(e.dataTransfer)
    // if (files.length > 0) {
    //   // Handle the dropped files here, e.g., upload or process them.
    //   console.log("Dropped files:", files);

    //   // Update the state with the dropped files' names
    //   setDroppedFiles([...droppedFiles, ...files.map((file) => file.name)]);
    // }
  };

  const handleBrowseClick = () => {
    // Trigger a click event on the hidden file input element
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0) {
      // Update the state with the selected file names
      setDroppedFiles([...droppedFiles, ...selectedFiles]);
    }
  };

  return (
    <div className={isDownloadOpen?'':"invisible" +" duration-300 ease-in-out"}>
      <div
        className="absolute bg-black w-screen h-screen z-10 bg-opacity-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={dropZoneRef}
      >
        <div
          style={{ transform: "translate(-50%, -50%)" }}
          className="p-5 w-2/3 h-96 bg-white max-w-xl absolute top-1/3 left-1/2 rounded-xl"
        >
          <h2>Upload Your File</h2>
          <div className="border-2 border-dotted border-black w-full h-2/3 mt-6 overflow-scroll bg-gray-200">
            {droppedFiles.length > 0 && (
              <div className="">
                <ul>
                  {droppedFiles.map((filename, index) => (
                    <li
                      className={"leading-loose px-2 " + (index % 2 === 0 ? "bg-gray-100" : "bg-gray-200")}
                      key={index}
                    >
                      {filename.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mx-auto w-full text-center mt-3">
            Drag your file here or{" "}
            <button
              className="text-blue-500 italic underline cursor-pointer"
              onClick={handleBrowseClick}
            >
              browse
            </button>
          </p>
          {/* Hidden file input element */}
          <input
            type="file"
            accept="*/*"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <div className="mx-auto w-full flex justify-between px-20">
        <button onClick={()=>{onSubmitHander()}}className="hover:bg-blue-400 bg-blue-200 p-2 transform rounded px-4">Submit</button>
        <button className="hover:bg-blue-400 bg-blue-200 p-2 transform rounded px-4" onClick={closeTabHandler}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadDialog;

