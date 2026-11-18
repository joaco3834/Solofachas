"use client";

import Cursor from "./ui/Cursor";
import Header from "./Header";
import Hero from "./Hero";
import WatchPick from "./WatchPick";
import CartButton from "./CartButton";
import Marquee from "./Marquee";
import Manifesto from "./Manifesto";
import Featured from "./Featured";
import HowTo from "./HowTo";
import FinalCta from "./FinalCta";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";

export default function Landing() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <Manifesto />
        <WatchPick />
        <Featured />
        <HowTo />
        <FinalCta />
      </main>
      <Footer />
      <CartButton />
    </>
  );
}
