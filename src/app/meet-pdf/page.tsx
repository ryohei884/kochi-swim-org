"use client";

export default function Page() {
  const pdfURL = "/files/meetlist20260309.pdf";

  return pdfURL ? (
    <object
      className="w-svw h-svh"
      title="2026年度競技会日程表(2026年3月9日更新)"
      data={pdfURL}
      type="application/pdf"
    />
  ) : (
    <div>Loading ...</div>
  );
}
