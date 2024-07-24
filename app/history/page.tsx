"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/app/components";

interface HistoryItem {
  summary: string;
  sentiments: {
    score: number;
    comparative: number;
    words: number;
    positive: number;
    negative: number;
  };
  classifications: string[];
  keyword: string[];
  paraphrase: string;
  dateTime: string; // Added field for date and time
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login"); // Redirect to login page if not authenticated
    } else {
      const savedHistory = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
      setHistory(savedHistory);
    }
  }, [router]);

  const handleToggleDetails = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <main>
      <section className="p-7 md:px-10 lg:px-14 bg-azure-blue md:bg-cotton-white">
        <NavBar />
      </section>
      <section className="mx-auto bg-cotton-white w-[90%] md:w-[70%] h-auto pt-10">
        <article className="w-full mx-auto flex flex-col justify-center gap-10 h-full">
          {history.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-2">Summary History:</h3>
              {history.map((item, index) => (
                <div key={index} className="mb-4 p-4 border border-azure-blue rounded-md bg-gray-50">
                  <h4 className="font-semibold mb-2">Date and Time:</h4>
                  <p>{new Date(item.dateTime).toLocaleString()}</p> {/* Format the date and time */}
                  <h4 className="font-semibold mt-4 mb-2">Summary:</h4>
                  <p>{item.summary}</p>
                  {expandedIndex === index && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Sentiments:</h4>
                      <ul className="list-disc pl-5">
                        <li>Score: {item.sentiments.score}</li>
                        <li>Comparative: {item.sentiments.comparative}</li>
                        <li>Words: {item.sentiments.words}</li>
                        <li>Positive: {item.sentiments.positive}</li>
                        <li>Negative: {item.sentiments.negative}</li>
                      </ul>
                      <h4 className="font-semibold mt-4 mb-2">Classifications:</h4>
                      <ul className="list-disc pl-5">
                        {item.classifications.map((classification, idx) => (
                          <li key={idx}>{classification}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold mt-4 mb-2">Keywords:</h4>
                      <ul className="list-disc pl-5">
                        {item.keyword.map((keyword, idx) => (
                          <li key={idx}>{keyword}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold mt-4 mb-2">Paraphrase:</h4>
                      <p>{item.paraphrase}</p>
                      <button
                        onClick={() => handleToggleDetails(index)}
                        className="mt-4 px-4 py-2 bg-azure-blue text-cotton-white rounded-md hover:bg-opacity-80 transition-all"
                      >
                        Back
                      </button>
                    </div>
                  )}
                  {expandedIndex !== index && (
                    <button
                      onClick={() => handleToggleDetails(index)}
                      className="mt-4 px-4 py-2 bg-azure-blue text-cotton-white rounded-md hover:bg-opacity-80 transition-all"
                    >
                      Show More
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No history available.</p>
          )}
        </article>
      </section>
    </main>
  );
};

export default History;
