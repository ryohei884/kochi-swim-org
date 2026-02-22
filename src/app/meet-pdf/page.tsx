"use client";

export default function Page() {
  const pdfURL =
    "https://nzprheefai1ubld0.public.blob.vercel-storage.com/files/meetlist-G0jXYEAdKbWLE4dMWEcl1jxGXKFO2Y.pdf";

  return pdfURL ? (
    <object
      className="w-svw h-svh"
      title="2026年度競技会日程表"
      data={pdfURL}
      type="application/pdf"
    />
  ) : (
    <div>Loading ...</div>
  );
}
