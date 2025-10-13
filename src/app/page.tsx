"use client";

import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import Hero from "@/components/top/hero";
import News from "@/components/top/news";
// import Sponsor from "@/components/top/sponsor";

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <News />
      {/* <Sponsor /> */}
      <Footer />
    </>
  );
}
