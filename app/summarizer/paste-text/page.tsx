"use client";
import React, { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/app/components";
import { useClientStore } from "@/store";
import AnimatedText from "@/app/components/AnimatedText/AnimatedText";
import Speaker from "@/app/ui/icons/Speaker";
import { speak } from "@/app/utils/TextToSpeech";

const PasteText = () => {
  const { data, setData } = useClientStore();
  const [summarizedText, setSummarizedText] = useState("");
  const [sentiments, setSentiments] = useState<string[]>([]);
  const [classifications, setClassifications] = useState<string[]>([]);
  const [paraphrase, setParaphrase] = useState("");
  const [requestPath, setRequestPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorLength, setErrorLength] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to summarize and analyze text
  const handleSummarize = async () => {
    if (data.length < 250) {
      setErrorLength(true);
      return;
    }
    setErrorLength(false);
    setLoading(true);

    try {
      const authToken = localStorage.getItem('authToken'); // Get token from localStorage
      const response = await fetch("https://ai-summarization-backend1.onrender.com/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`, // Include token in headers
        },
        body: JSON.stringify({ text: data }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummarizedText(result.summary || "");
        setSentiments(result.sentiments || []);
        setClassifications(result.classifications || []);
        setParaphrase(result.paraphrase || "");
        setRequestPath(result.requestpath || "");
        setErrorMessage("");
      } else {
        setErrorMessage(result.error || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("An error occurred while summarizing the text.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    try {
      speak(summarizedText);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setErrorMessage("Unable to perform text-to-speech.");
    }
  };

  return (
    <main>
      <section className="p-7 md:px-10 lg:px-14 bg-azure-blue md:bg-cotton-white">
        <NavBar />
      </section>

      <section className="flex items-center justify-center gap-5 pt-10 pb-5">
        <Link
          href="/summarizer"
          className="bg-azure-blue text-cotton-white px-4 py-3 rounded-md"
        >
          Summarize
        </Link>
        <Link href="/paraphraser">Paraphrase</Link>
      </section>

      {/* Main content of the page */}
      {summarizedText && (
        <div className="w-[90%] flex justify-end pb-5">
          <span
            onClick={handleSpeak}
            className="bg-azure-blue rounded-full p-2 hover:cursor-pointer"
          >
            <Speaker />
          </span>
        </div>
      )}

      <section className="flex flex-col md:flex-row justify-center h-80 gap-10">
        <textarea
          onChange={(e) => setData(e.target.value)}
          name="paste-text"
          id="paste-text"
          cols={30}
          rows={10}
          placeholder="Paste text"
          defaultValue={data}
          className="mx-auto md:mx-0 border-2 border-azure-blue border-dashed w-[90%] md:w-[40%] focus:outline-azure-blue p-2 rounded-md"
        ></textarea>

        <article className="overflow-y-scroll mx-auto md:mx-0 bg-azure-blue text-cotton-white w-[90%] md:w-[40%] h-96 md:h-full rounded-md p-2">
          {summarizedText ? (
            <AnimatedText text={summarizedText} delay={100} />
          ) : (
            "Summarized text"
          )}
        </article>
      </section>

      {errorLength && (
        <p className="text-red-500 text-sm text-center my-2">
          Text must be more than 250 characters!
        </p>
      )}

      {errorMessage && (
        <p className="text-red-500 text-sm text-center my-2">
          {errorMessage}
        </p>
      )}

      {sentiments.length > 0 && (
        <section className="my-5">
          <h3 className="text-xl font-bold mb-2">Sentiments</h3>
          <ul className="list-disc pl-5">
            {sentiments.map((sentiment, index) => (
              <li key={index}>{sentiment}</li>
            ))}
          </ul>
        </section>
      )}

      {classifications.length > 0 && (
        <section className="my-5">
          <h3 className="text-xl font-bold mb-2">Classifications</h3>
          <ul className="list-disc pl-5">
            {classifications.map((classification, index) => (
              <li key={index}>{classification}</li>
            ))}
          </ul>
        </section>
      )}

      {paraphrase && (
        <section className="my-5">
          <h3 className="text-xl font-bold mb-2">Paraphrase</h3>
          <p>{paraphrase}</p>
        </section>
      )}

      {requestPath && (
        <section className="my-5">
          <h3 className="text-xl font-bold mb-2">Request Path</h3>
          <p>{requestPath}</p>
        </section>
      )}

      {requestPath && (
        <div className="mt-5 flex justify-center">
          <a
            href={`https://ai-summarization-backend1.onrender.com/api/download-report?reportPath=${encodeURIComponent(requestPath)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-azure-blue text-cotton-white px-6 py-3 rounded-md hover:bg-opacity-80 transition-all"
          >
            Download Report
          </a>
        </div>
      )}

      <section className="flex justify-center my-5">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`${
            loading ? "opacity-50" : ""
          } bg-cotton-white md:bg-azure-blue text-azure-blue md:text-cotton-white hover:text-cotton-white md:hover:text-azure-blue px-6 py-3 rounded-md border border-azure-blue hover:bg-azure-blue md:hover:bg-transparent transition-all font-[550] mx-auto`}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </section>
    </main>
  );
};

export default PasteText;
