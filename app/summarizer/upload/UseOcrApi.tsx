import { useClientStore } from "@/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

const UseOcrApi = () => {
  const { setData } = useClientStore();
  const router = useRouter();
  const apiKey = process.env.OCR_API_KEY ?? "";
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getText = async () => {
    if (!fileUrl) {
      console.error("No file URL provided.");
      return;
    }

    setIsLoading(true);

    // Create form data within the function to ensure it includes the latest fileUrl
    const formdata = new FormData();
    formdata.append("apikey", apiKey);
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "false");
    formdata.append("url", fileUrl);
    formdata.append("filetype", "pdf");
    formdata.append("iscreatesearchablepdf", "false");
    formdata.append("issearchablepdfhidetextlayer", "false");

    const requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://api.ocr.space/parse/image", requestOptions);
      const result = await response.text();
      const parsedData = JSON.parse(result);

      if (parsedData && parsedData.ParsedResults && parsedData.ParsedResults.length > 0) {
        setData(parsedData.ParsedResults[0].ParsedText);
        router.push("/summarizer/paste-text");
      } else {
        console.error("No parsed results found.");
      }
    } catch (error) {
      console.error("Error fetching OCR data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getText, setFileUrl, fileUrl, isLoading };
};

export default UseOcrApi;
