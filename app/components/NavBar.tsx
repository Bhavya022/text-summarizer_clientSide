"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import { links } from "../data/data";
import Hamburger from "../ui/icons/Hamburger";
import Cancel from "../ui/icons/Cancel";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [sideBar, setSideBar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Hide sidebar when clicking outside of the sidebar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSideBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle sidebar
  const handleSideBar = () => {
    setSideBar(prev => !prev);
  };

  // Check authentication
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!authToken);
    setUsername(storedUsername);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    router.push("/login");
  };

  // Handle keyboard events for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSideBar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="text-white md:text-black text-2xl md:text-4xl tracking-wide">
        ai-
        <span className="txt-white md:text-azure-blue font-semibold">
          summarizer
        </span>
      </Link>

      <article className="hidden md:flex items-center justify-between md:w-1/2 lg:w-1/4">
        {links.map((link, index) => (
          <Link key={index} className="hover:underline" href={link.link}>
            {link.title}
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            <span className="mr-2">{username}</span>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </article>

      <div className="hidden md:block">
        <Link href="/contact-us">
          <Button whiteBg={false} label="Contact Us" />
        </Link>
      </div>

      <div
        className="md:hidden"
        onClick={handleSideBar}
        aria-expanded={sideBar}
        aria-controls="sidebar"
      >
        <Hamburger />
      </div>

      {/* Mobile sidebar */}
      <article
        ref={sidebarRef}
        id="sidebar"
        className={`absolute top-0 ${sideBar ? "left-0" : "-left-full"} h-screen bg-cotton-white w-[80%] transition-all md:hidden z-10`}
      >
        <span
          onClick={() => setSideBar(false)}
          className="absolute right-5 top-5 cursor-pointer"
        >
          <Cancel />
        </span>

        <div className="relative top-32 flex flex-col gap-14 text-center text-2xl">
          {links.map((link, index) => (
            <Link
              onClick={() => setSideBar(false)}
              key={index}
              className="text-azure-blue hover:underline"
              href={link.link}
            >
              {link.title}
            </Link>
          ))}

          <Link onClick={() => setSideBar(false)} href="/contact-us">
            <button
              className="bg-azure-blue text-cotton-white hover:text-cotton-white px-6 py-3 rounded-md hover:bg-opacity-80 transition-all font-[550] mx-auto"
            >
              Contact Us
            </button>
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-azure-blue">{username}</span>
              <button onClick={handleLogout} className="text-azure-blue hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setSideBar(false)} href="/login" className="text-azure-blue hover:underline">Login</Link>
              <Link onClick={() => setSideBar(false)} href="/signup" className="text-azure-blue hover:underline">Signup</Link>
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default NavBar;
