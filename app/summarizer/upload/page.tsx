"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/app/components";
import { Input } from "@/components/ui/input";
import axios from "axios";

const Upload = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [sentiments, setSentiments] = useState<{score: number, comparative: number, words: string, positive: string, negative: string} | null>(null);
  const [classifications, setClassifications] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string[]>([]);
  const [paraphrase, setParaphrase] = useState<string | null>(null);
  const [reportPath, setReportPath] = useState<string | null>(null);
  const router = useRouter();

  const file_icon =
    "https://imgs.search.brave.com/PkNC4u9TBqgKPrkKztC8BMORU8gNafaa0E1jKCgBEYw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbi1pY29ucy5j/b20vaWNvbnMyLzg4/Ni9QTkcvNTEyL2Zp/bGVfSW1hZ2VfZG93/bmxvYWRfaWNvbi1p/Y29ucy5jb21fNjg5/NDIucG5n";

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [router]);

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFileLoading(true);
      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const token = localStorage.getItem('authToken'); // Get the token for the request
        const res = await axios.post(
          `https://ai-summarization-backend1.onrender.com/api/upload`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (res.status === 200) { 
          console.log(res);
          const data = res.data;
          setFileUrl(data.reportPath);
          setSummary(data.summary);
          setSentiments(data.sentiments);
          setClassifications(data.classifications);
          setKeyword(data.keyword);
          setParaphrase(data.paraphrase);
          setReportPath(data.reportPath);
          setErrorMessage(null);
        } else {
          setErrorMessage('Unexpected response from server.');
        }
      } catch (err) {
        console.error('Error:', err);
        setErrorMessage('Error uploading file. Please try again.');
      } finally {
        setFileLoading(false);
      }
    }
  };

  return (
    <main>
      <section className="p-7 md:px-10 lg:px-14 bg-azure-blue md:bg-cotton-white">
        <NavBar />
      </section>
      <section className="flex items-center justify-center gap-5 py-10">
        <Link
          href="/summarizer"
          className="bg-azure-blue text-cotton-white px-4 py-3 rounded-md"
        >
          Summarize
        </Link>
        <Link href="/paraphraser">Paraphrase</Link>
      </section>

      <section className="mx-auto bg-cotton-white w-[90%] md:w-[70%] h-auto pt-10">
        <article className="w-full mx-auto flex flex-col justify-center gap-10 h-full">
          {fileUrl && (
            <div className="flex justify-center mb-5">
              <Image
                src={file_icon}
                alt="File Icon"
                width={50}
                height={50}
              />
            </div>
          )}
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.html,.doc,.docx"
            className="border-azure-blue text-azure-blue"
          />
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
          {/* <button
            onClick={() => document.querySelector('input[type="file"]')?.click()}
            disabled={fileLoading}
            className={`${
              fileLoading ? "opacity-50" : ""
            } bg-cotton-white md:bg-azure-blue text-azure-blue md:text-cotton-white hover:text-cotton-white md:hover:text-azure-blue px-6 py-3 rounded-md border border-azure-blue hover:bg-azure-blue md:hover:bg-transparent transition-all font-[550] mx-auto`}
          >
            {fileLoading ? "Uploading..." : "Upload File"}
          </button> */}
          <button
  onClick={() => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    fileInput?.click();
  }}
  disabled={fileLoading}
  className={`${
    fileLoading ? "opacity-50" : ""
  } bg-cotton-white md:bg-azure-blue text-azure-blue md:text-cotton-white hover:text-cotton-white md:hover:text-azure-blue px-6 py-3 rounded-md border border-azure-blue hover:bg-azure-blue md:hover:bg-transparent transition-all font-[550] mx-auto`}
>
  {fileLoading ? "Uploading..." : "Upload File"}
</button>


          {/* Display summary */}
          {summary && (
            <div className="mt-5">
              <h3 className="text-xl font-bold mb-2">Summary:</h3>
              <div className="p-4 border border-azure-blue rounded-md bg-gray-50">
                <p>{summary}</p>
              </div>
            </div>
          )}

          {/* Display sentiments */}
          {sentiments && (
            <div className="mt-5">
              <h3 className="text-xl font-bold mb-2">Sentiments:</h3>
              <div className="p-4 border border-azure-blue rounded-md bg-gray-50">
                <p>Score: {sentiments.score}</p>
                <p>Comparative: {sentiments.comparative}</p>
                <p>Words: {sentiments.words}</p>
                <p>Positive: {sentiments.positive}</p>
                <p>Negative: {sentiments.negative}</p>
              </div>
            </div>
          )}

          {/* Display classifications */}
          {classifications.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xl font-bold mb-2">Classifications:</h3>
              <div className="p-4 border border-azure-blue rounded-md bg-gray-50">
                <ul className="list-disc pl-5">
                  {classifications.map((classification, index) => (
                    <li key={index}>{classification}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
         {/* Display keyword */}
         {keyword.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xl font-bold mb-2">Keyword:</h3>
              <div className="p-4 border border-azure-blue rounded-md bg-gray-50">
                <ul className="list-disc pl-5">
                  {keyword.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Display paraphrase */}
          {paraphrase && (
            <div className="mt-5">
              <h3 className="text-xl font-bold mb-2">Paraphrase:</h3>
              <div className="p-4 border border-azure-blue rounded-md bg-gray-50">
                <p>{paraphrase}</p>
              </div>
            </div>
          )}

          {/* Display download button */}
          {reportPath && (
            <div className="mt-5 flex justify-center">
              <a
                href={`https://ai-summarization-backend1.onrender.com/api/download-report?reportPath=${encodeURIComponent(reportPath)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-azure-blue text-cotton-white px-6 py-3 rounded-md hover:bg-opacity-80 transition-all"
              >
                Download Report
              </a>
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default Upload;
