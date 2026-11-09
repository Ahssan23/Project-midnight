
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Benefits from "../components/benefits";

import "../globals.css";


export default function Home() {
  return (
    <html>
        <body>
            
    <main className="min-h-screen bg-[#F8F7F4] text-[#181818]">
      <Navbar />
      <Hero />
      <Benefits />
    </main>
        </body>
    </html>
  );
}

