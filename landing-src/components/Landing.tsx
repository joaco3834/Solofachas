"use client";

import { useMedia } from "@/lib/hooks";
import Cursor from "./ui/Cursor";
import Header from "./Header";
import Experience from "./Experience";
import Marquee from "./Marquee";
import Manifesto from "./Manifesto";
import Featured from "./Featured";
import HowTo from "./HowTo";
import FinalCta from "./FinalCta";
import Footer from "./Footer";

export default function Landing() {
  const isMobile = useMedia("(max-width: 767px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  return (
    <>
      <Cursor />
      <Header />
      <main className="overflow-x-clip">
        <Experience isMobile={isMobile} reduced={reduced} />
        <Marquee />
        <Manifesto />
        <Featured />
        <HowTo />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
