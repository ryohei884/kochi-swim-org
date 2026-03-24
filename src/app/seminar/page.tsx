"use client";

import SeminarList from "@/components/seminar/seminar-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { getFY } from "@/lib/utils";

export default function Page() {
  const dt = new Date();
  const thisYear = getFY(dt);

  return (
    <>
      <Header />
      <SeminarList year={thisYear} />
      <Footer />
    </>
  );
}
