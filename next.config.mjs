/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['imgs.search.brave.com'],
  },
  env: {
    OCR_API_KEY: process.env.OCR_API_KEY || "K83747338588957",
    CLOUDINARY_PRESET_KEY: process.env.CLOUDINARY_PRESET_KEY || "yykpflgd",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "ds8bolg2f",
  },
   // Ensure static export
};

export default nextConfig;
