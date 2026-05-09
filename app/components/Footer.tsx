"use client";

import { useState } from "react";
import ContactPopup from "@/app/components/popups/ContactPopup";

export default function Footer() {
  const [popupOpen, setPopupOpen] = useState(false);

  const socials = [
    { name: "Instagram", handle: "@lilromepraba", url: "https://www.instagram.com/dushan_prabashana_?igsh=aW42ZTU3aGtydXZ5&utm_source=qr" },
    { name: "Spotify", handle: "Lil Rome Praba", url: "https://open.spotify.com/artist/2cu0S0ZpulMgq8xMJTBVDx?si=US-ErMjRQVW1ZrclX8Z2GA" },
    { name: "YouTube", handle: "LilRomePrabaTV", url: "https://youtube.com/@lilromepraba?si=9_7l_imQMATBaJRN" },
    { name: "TikTok", handle: "@lilromepraba", url: "https://www.tiktok.com/@_lil_rome_praba" },
    { name: "Facebook", handle: "@lilromepraba", url: "https://www.facebook.com/share/18cJ64Kr8G/?mibextid=wwXIfr" },
  ];

  return (
    <>
      {/* ── Contact Popup ── */}
      <ContactPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />

      <footer className="bg-black border-t border-white/5">
        {/* CTA strip */}
        <div id="contact" className="border-b border-white/5 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <div className="font-oswald text-xs tracking-[0.3em] uppercase text-crimson mb-4">Booking & Press</div>
            <h2 className="font-display text-5xl lg:text-8xl text-white mb-6 leading-none">
              WORK WITH<br />
              <span className="gold-gradient">PRABA</span>
            </h2>
            <p className="font-barlow text-gray-500 text-lg uppercase tracking-wide max-w-lg mx-auto mb-10">
              For booking, features, brand deals, and press inquiries
            </p>
            {/* ── Changed: onClick opens popup instead of mailto ── */}
            <button
              onClick={() => setPopupOpen(true)}
              className="btn-primary inline-block px-12 py-4 text-sm font-bold"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Logo & tagline */}
            <div>
              <div className="font-display text-4xl text-white mb-3">
                PRABA<span className="text-crimson">.</span>
              </div>
              <p className="font-barlow text-gray-600 text-sm uppercase tracking-wide max-w-xs">
                Sri Lanka&apos;s hardest. Every bar a statement.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <div className="font-oswald text-xs tracking-[0.25em] uppercase text-gray-700 mb-5">Navigate</div>
              <div className="grid grid-cols-2 gap-y-3">
                {["Music", "Shows","About", "Blog", "Contact"].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="font-oswald text-xs tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div>
              <div className="font-oswald text-xs tracking-[0.25em] uppercase text-gray-700 mb-5">Socials</div>
              <div className="space-y-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <span className="font-oswald text-xs tracking-widest uppercase text-gray-600 group-hover:text-white transition-colors">
                      {s.name}
                    </span>
                    <span className="font-barlow text-xs text-gray-700 group-hover:text-crimson transition-colors">
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="section-divider mt-10 mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-oswald text-xs tracking-widest text-gray-700 uppercase">
              © 2026 LIL ROME PRABA Official. All rights reserved.
            </p>
            <p className="font-oswald text-xs tracking-widest text-gray-800 uppercase">
              Developed by Tharaka Nuwan Athuluwage
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}