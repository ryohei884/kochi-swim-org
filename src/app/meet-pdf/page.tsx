"use client";

export default function Page() {
  return (
    <object
      className="w-svw h-svh"
      title="2026年度競技会日程表(2026年3月9日更新)"
      data={`/files/meetlist20260309.pdf`}
      type="application/pdf"
    />
  );
}
