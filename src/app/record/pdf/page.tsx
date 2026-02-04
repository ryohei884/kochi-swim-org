"use client";
// import { PDFViewer } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

import CreatePDF from "@/components/record/create-pdf";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function Page() {
  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setLoaded(true);
  // }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="w-full h-svh">
          <PDFViewer height="100%" width="100%">
            <CreatePDF />
          </PDFViewer>
        </div>
      </div>
    </>
  );
}
