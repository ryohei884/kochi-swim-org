"use client";

import Header from "@/components/top/header";
import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";

export default function Page() {
  return (
    <>
      <Header />
      <MeetList page="1" />
      <Footer />
    </>
  );
}
