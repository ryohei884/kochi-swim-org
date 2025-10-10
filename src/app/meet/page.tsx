"use client";

import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  return (
    <>
      <Header />
      <MeetList page="1" />
      <Footer />
    </>
  );
}
