"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Home() {
  const [pdfURL, setPdfURL] = useState<URL | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getURL = async () => {
    try {
      const fetchURL = await fetch("/record_pdf_url");
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

  return (
    <>
      <Header />
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            {pdfURL && isReady ? (
              <object
                className="mx-auto"
                title="PDF"
                data={pdfURL.toString()}
                type="application/pdf"
                width="100%"
                height="800"
              />
            ) : (
              "Loading ..."
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
