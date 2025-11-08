"use client";

import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  const dt = new Date();
  const thisYear = dt.getFullYear();
  return (
    <>
      <Header />
      <MeetList kind="swimming" year={thisYear} />
      <Footer />
    </>
  );
}
