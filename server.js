const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const readline = require("readline");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Simple emotion analysis function using keywords
const analyzeEmotion = (text) => {
  const lowerText = text.toLowerCase();

  const emotionKeywords = {
    joy: ["happy", "joy", "excited", "delighted", "glad", "pleased"],
    anger: ["angry", "mad", "furious", "rage", "upset"],
    fear: ["scared", "fearful", "afraid", "terrified", "nervous"],
    confusion: ["confused", "lost", "uncertain", "puzzled", "baffled"],
    suspicion: ["suspicious", "mistrust", "doubtful", "skeptical", "uncertain"],
  };

  for (const emotion in emotionKeywords) {
    for (const keyword of emotionKeywords[emotion]) {
      if (lowerText.includes(keyword)) {
        return emotion;
      }
    }
  }

  return "neutral";
};

// Function to handle terminal output for each emotion
const handleEmotionResponse = (emotion, userInput) => {
  console.log(`User Input: "${userInput}"`);
  console.log(`Detected Emotion: ${emotion}`);

  let responseMessage = "";

  switch (emotion) {
    case "confusion":
      responseMessage =
        "This seems confusing. Let me explain that in more detail. Here are the steps or further information to help you understand.";
      break;
    case "joy":
      responseMessage =
        "Thank you for the wonderful feedback! We appreciate it, and we encourage you to share more of your experiences or suggest future collaborations.";
      break;
    case "suspicion":
      responseMessage =
        "We understand your concerns. Here is a transparent explanation along with reliable data. Feel free to ask more questions if needed.";
      break;
    case "anger":
      responseMessage =
        "We sincerely apologize for any inconvenience caused. Your feedback is important, and we will work on improving this. Could you suggest how we can make it better?";
      break;
    case "fear":
      responseMessage =
        "We understand your concerns and are here to support you. Let us provide further clarification or assistance.";
      break;
    default:
      responseMessage =
        "Thank you for your input. If you need any assistance or clarification, feel free to ask.";
  }

  console.log(`Natlang Response: '${responseMessage}'`);

  // Ask the developer for GPT response if needed
  console.log(
    "Developer: Please validate the detected emotion, then input GPT's response."
  );
};

// Create a function to get developer input
const getDeveloperInput = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Endpoint to analyze sentiment
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  // Analyze the emotion based on the input text
  const emotion = analyzeEmotion(text);

  // Log the emotion and user input to the terminal
  handleEmotionResponse(emotion, text);

  // Ask the developer if the emotion detection is correct
  const isCorrectEmotion = await getDeveloperInput(
    "Is the detected emotion correct? (yes/no): "
  );

  let finalEmotion = emotion;

  // If emotion is incorrect, ask for the correct emotion
  if (isCorrectEmotion.toLowerCase() === "no") {
    finalEmotion = await getDeveloperInput(
      "Please enter the correct emotion: "
    );
  }

  // Ask the developer for GPT's response
  const gptResponse = await getDeveloperInput(
    "Please enter the GPT response: "
  );

  // Send the GPT response and the final emotion back to the frontend
  res.status(200).send({ message: gptResponse, emotion: finalEmotion });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
