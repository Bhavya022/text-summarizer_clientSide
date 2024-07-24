import axios from "axios";
import { useClientStore } from "@/store";
import { useState } from "react";

const ParaphraseApi = () => {
  const { data } = useClientStore();
  const [paraphraseLoading, setParaphraseLoading] = useState(false);
  const [paraphrasedText, setParaphrasedText] = useState("");
  const apiData = {
    text: data,
  };

  const paraphraseText = () => {
    setParaphraseLoading(true);
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
    };

    // Make the POST request
    axios
      .post(
        "https://ai-summarization-backend1.onrender.com/api/paraphrase",
        apiData, // No need to stringify apiData as axios handles it automatically
        { headers }
      )
      .then((response) => {
        // Handle the response
        console.log(response.data.paraphrase)
        setParaphrasedText(response.data.paraphrase);
        setParaphraseLoading(false);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error making POST request:", error);
        setParaphraseLoading(false);
      });
  };

  return {
    paraphraseText,
    paraphrasedText,
    setParaphrasedText,
    paraphraseLoading,
  };
};

export default ParaphraseApi;
