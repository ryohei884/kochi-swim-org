"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [pdfURL, setPdfURL] = useState<URL | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getURL = async () => {
    try {
      const fetchURL = await fetch("/meet_pdf_url");
      const recordPdfURL = await fetchURL.json();
      if (recordPdfURL !== false && recordPdfURL !== undefined) {
        setPdfURL(recordPdfURL);
      } else {
        setPdfURL(null);
      }
      setIsReady(true);
    } catch (error) {
      toast("エラーが発生しました。", {
        description: <div>{JSON.stringify(error, null, 2)}</div>,
        action: {
          label: "戻る",
          onClick: () => console.log(error),
        },
      });
      setPdfURL(null);
      setIsReady(true);
    }
  };

  useEffect(() => {
    setIsReady(false);
    getURL();
  }, []);

  return pdfURL && isReady ? (
    <object
      className="w-svw h-svh"
      title="2026年度競技会日程表(2026年3月9日更新)"
      data={pdfURL.toString()}
      type="application/pdf"
    />
  ) : (
    <div>Loading ...</div>
  );
}
