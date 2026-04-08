import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Music from "./components/Music";
import Shows from "./components/Shows";
import About from "./components/About";
import Blog from "./components/Blog";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Ticker />
      <Music />
      <div className="section-divider" />
      <Shows />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Blog />
      <Footer />
    </main>
  );
}