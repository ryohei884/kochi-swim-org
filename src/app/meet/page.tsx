"use client";

import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  const dt = new Date();
  const thisYear =
    dt.getMonth() <= 3 && dt.getDate() <= 31
      ? dt.getFullYear() - 1
      : dt.getFullYear();
  return (
    <>
      <Header />
      <MeetList kind="swimming" year={thisYear} />
      <Footer />
    </>
  );
}
