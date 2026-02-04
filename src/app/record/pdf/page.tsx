"use client";
import { PDFViewer } from "@react-pdf/renderer";
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
        <PDFViewer
          style={{
            position: "absolute",
            border: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <CreatePDF />
        </PDFViewer>
      )}
    </>
  );
}
