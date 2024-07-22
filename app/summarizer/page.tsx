"use client";
import React , { MouseEvent }  from "react";
import Link from "next/link";
import { NavBar } from "../components";
import { useRouter } from 'next/navigation';
const Summarizer = () => {
  const router = useRouter();

  const handleNavigation = (e: MouseEvent<HTMLAnchorElement>, path: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      e.preventDefault();
      alert('Hey! You need to login first');
      router.push('/login');
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
          className="bg-azure-blue text-cotton-white px-4 py-3 rounded-md font-semibold transition-all hover:bg-dark-blue"
        >
          Summarize
        </Link>
        <Link
          href="/paraphraser"
          className="bg-cotton-white text-azure-blue px-4 py-3 rounded-md font-semibold transition-all hover:bg-azure-blue hover:text-cotton-white"
        >
          Paraphrase
        </Link>
      </section>

      <section className="mx-auto bg-cotton-white w-[90%] md:w-[70%] h-96 pt-10 flex flex-col justify-center items-center">
        <article className="flex flex-col items-center gap-5 h-full">
          <Link
            href="/summarizer/upload"
            onClick={(e) => handleNavigation(e, "/summarizer/upload")}
            className="w-fit border border-azure-blue bg-azure-blue text-cotton-white px-4 py-3 rounded-md font-semibold transition-all hover:bg-dark-blue"
          >
            Upload File
          </Link>
          <p className="text-center text-azure-blue font-medium">or</p>
          <Link
            href="/summarizer/paste-text"
            onClick={(e) => handleNavigation(e, "/summarizer/paste-text")}
            className="border border-azure-blue text-azure-blue bg-cotton-white px-4 py-3 rounded-md font-semibold transition-all hover:bg-azure-blue hover:text-cotton-white"
          >
            Paste Text
          </Link>
        </article>
      </section>
    </main>
  );
};

export default Summarizer;
