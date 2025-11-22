"use client";

import SeminarList from "@/components/seminar/seminar-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  return (
    <>
      <Header />
      <SeminarList year="2025" />
      <Footer />
    </>
  );
}
