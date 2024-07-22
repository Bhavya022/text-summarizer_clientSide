import axios from "axios";
import { useClientStore } from "@/store";
import { useState } from "react";

const SummarizeApi = () => {
  const { data } = useClientStore();
  const [errorLength, setErrorLength] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizedText, setSummarizedText] = useState("");
  const [sentiments, setSentiments] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [paraphrase, setParaphrase] = useState("");
  const [requestPath, setRequestPath] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiData = {
    text: data,
  };

  const summarizeText = async () => {
    setSummarizeLoading(true);

    if (apiData.text.length < 250) {
      setErrorLength(true);
      setSummarizeLoading(false);
      return;
    }

    setErrorLength(false);

    try {
      const response = await axios.post(
        "https://ai-summarization-backend1.onrender.com/api/summarize", // Update this URL if needed
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        setSummarizedText(result.summary);
        setSentiments(result.sentiments || []);
        setClassifications(result.classifications || []);
        setParaphrase(result.paraphrase || "");
        setRequestPath(result.requestpath || "");
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error making POST request:", error);
      setErrorMessage("An error occurred while summarizing the text.");
    } finally {
      setSummarizeLoading(false);
    }
  };

  return {
    summarizedText,
    sentiments,
    classifications,
    paraphrase,
    requestPath,
    summarizeLoading,
    errorLength,
    errorMessage,
  };
};

export default SummarizeApi;
