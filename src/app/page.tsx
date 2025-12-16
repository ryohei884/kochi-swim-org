"use client";
import { useEffect, useState } from "react";

import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import Hero from "@/components/top/hero";
import News from "@/components/top/news";

// import Sponsor from "@/components/top/sponsor";

export default function Page() {
  const [randomNumber, setRandomNumber] = useState<number | undefined>(
    undefined,
  );
  const pictureURL = (randomNumber: number | undefined) => {
    switch (randomNumber) {
      case 0:
        return "/swimming_top.jpg";
      case 1:
        return "/as_top.jpg";
      case 2:
        return "/waterpolo_top.jpg";
      default:
        return "/swimming_top.jpg";
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomNumber(Math.floor(Math.random() * 3));
  }, []);

  return (
    <>
      <Header />
      <Hero
        pictureURL={
          randomNumber !== undefined ? pictureURL(randomNumber) : undefined
        }
      />
      <News />
      {/* <Sponsor /> */}
      <Footer />
    </>
  );
}
