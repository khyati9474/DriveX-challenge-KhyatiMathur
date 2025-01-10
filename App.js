import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [file, setFile] = useState(null);
    const [content, setContent] = useState(""); 
    const [question, setQuestion] = useState(""); 
    const [answer, setAnswer] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 

    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    
    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          setIsLoading(true);
          console.log("Uploading file:", file); 
          const response = await axios.post("http://127.0.0.1:5000/upload", formData);
          console.log("Upload response:", response.data); 
          setContent(JSON.stringify(response.data.content, null, 2));
          setIsLoading(false);
      } catch (error) {
          console.error("Error uploading file:", error.response || error.message); 
          alert("Error uploading file. Please try again.");
          setIsLoading(false);
      }
  };

    
    const handleAskQuestion = async () => {
        if (!content) {
            alert("Please upload a file first.");
            return;
        }
        if (!question) {
            alert("Please enter a question.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post("http://127.0.0.1:5000/ask", {
                document: content,
                question: question,
            });
            setAnswer(response.data.answer);
            setIsLoading(false);
        } catch (error) {
            console.error("Error asking question:", error);
            alert("Error fetching the answer. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>DriveX-Document Q&A App</h1>
            <h2>Developed by- Khyati Mathur</h2>
            <div>
                <h2>Upload Document</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload} style={{ marginLeft: "10px" }}>
                    Upload
                </button>
            </div>
            {isLoading && <p>Loading...</p>}
            <div>
                <h2>Processed Document Content</h2>
                <pre
                    style={{
                        background: "#f4f4f4",
                        padding: "10px",
                        borderRadius: "5px",
                        maxHeight: "200px",
                        overflow: "auto",
                    }}
                >
                    {content || "No document uploaded yet."}
                </pre>
            </div>
            <div>
                <h2>Ask a Question</h2>
                <input
                    type="text"
                    placeholder="Enter your question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{ width: "70%", padding: "10px", marginRight: "10px" }}
                />
                <button onClick={handleAskQuestion}>Ask</button>
            </div>
            <div>
                <h2>Answer</h2>
                <p
                    style={{
                        background: "#e6ffe6",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                >
                    {answer || "No answer yet."}
                </p>
            </div>
        </div>
    );
};

export default App;
