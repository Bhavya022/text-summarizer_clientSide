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
