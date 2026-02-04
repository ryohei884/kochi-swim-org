"use client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

import CreatePDF from "@/components/record/create-pdf";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && (
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-svh">
            <PDFDownloadLink document={<CreatePDF />} fileName="record_all.pdf">
              Download
            </PDFDownloadLink>
            <PDFViewer height="100%" width="100%">
              <CreatePDF />
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  );
}
