"use client";

import NewsList from "@/components/news/news-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Page() {
  return (
    <>
      <Header />
      <NewsList page="1" />
      <Footer />
    </>
  );
}
