"use client";

import SeminarList from "@/components/seminar/seminar-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  return (
    <>
      <Header />
      <SeminarList page="1" />
      <Footer />
    </>
  );
}
