"use client";

import SeminarList from "@/components/seminar/seminar-list";
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
      <SeminarList year={thisYear} />
      <Footer />
    </>
  );
}
