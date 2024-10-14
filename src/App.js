import React, { useState } from "react";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // For displaying success or failure message
  const [emotion, setEmotion] = useState(""); // To store detected emotion
  const [gptResponse, setGptResponse] = useState(""); // To store GPT response

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        const data = await response.json();
        setGptResponse(data.message);
        setEmotion(data.emotion);
        console.log("Response and emotion have been analyzed.");
      } else {
        setStatusMessage("Error occurred while processing sentiment analysis.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Error occurred while connecting to the server.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "50px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Natlang Emotion Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: "300px", height: "100px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Analyze
        </button>
      </form>

      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          width: "400px",
        }}
      >
        <p>Detected Emotion: {emotion}</p>
        <p>{gptResponse}</p>
      </div>
    </div>
  );
};

export default App;
