"use client";

import { useEffect, useRef, useState } from "react";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    description: "",
  });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form when closed
      setTimeout(() => {
        setForm({ name: "", email: "", mobile: "", description: "" });
        setFormState("idle");
        setErrorMsg("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const { name, email, mobile, description } = form;
    if (!name || !email || !mobile || !description) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setErrorMsg("");
    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`
          fixed inset-0 z-50 flex items-center justify-center px-4
          bg-black/80 backdrop-blur-sm
          transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ backdropFilter: "blur(8px)" }}
      >
        {/* Panel */}
        <div
          className={`
            relative w-full max-w-lg
            bg-[#0a0a0a] border border-white/10
            transition-all duration-300
            ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}
          `}
          style={{
            boxShadow:
              "0 0 0 1px rgba(220,20,60,0.15), 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top crimson accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #dc143c 30%, #c9a84c 70%, transparent)",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white transition-colors group"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="group-hover:rotate-90 transition-transform duration-200"
            >
              <line
                x1="1"
                y1="1"
                x2="13"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="13"
                y1="1"
                x2="1"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          <div className="p-8 lg:p-10">
            {formState === "success" ? (
              /* ── Success State ── */
              <div className="text-center py-8">
                <div
                  className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-crimson/40"
                  style={{ borderColor: "rgba(220,20,60,0.4)" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-crimson"
                    style={{ color: "#dc143c" }}
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div
                  className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: "#dc143c" }}
                >
                  Message Sent
                </div>
                <h3
                  className="text-3xl font-black uppercase tracking-tight text-white mb-3"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  We&apos;ll be in touch.
                </h3>
                <p className="text-gray-500 text-sm tracking-wide">
                  Praba&apos;s team will get back to you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase text-black transition-opacity hover:opacity-80"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                {/* Header */}
                <div className="mb-8">
                  <div
                    className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
                    style={{ color: "#dc143c", fontFamily: "'Oswald', sans-serif" }}
                  >
                    Booking &amp; Press
                  </div>
                  <h2
                    className="text-4xl font-black uppercase leading-none text-white"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    GET IN{" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      TOUCH
                    </span>
                  </h2>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  {/* Name + Mobile row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none placeholder:text-gray-700 focus:border-white/20 transition-colors"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                        disabled={formState === "loading"}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-2">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="+94 XX XXX XXXX"
                        className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none placeholder:text-gray-700 focus:border-white/20 transition-colors"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                        disabled={formState === "loading"}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none placeholder:text-gray-700 focus:border-white/20 transition-colors"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                      disabled={formState === "loading"}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gray-600 mb-2">
                      Message
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Tell us about your inquiry — booking, features, press, brand deals..."
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-3 outline-none placeholder:text-gray-700 focus:border-white/20 transition-colors resize-none"
                      style={{ fontFamily: "'Barlow', sans-serif" }}
                      disabled={formState === "loading"}
                    />
                  </div>
                </div>

                {/* Error */}
                {errorMsg && (
                  <p
                    className="mt-3 text-xs tracking-wide"
                    style={{ color: "#dc143c", fontFamily: "'Barlow', sans-serif" }}
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={formState === "loading"}
                  className="mt-6 w-full py-4 text-xs font-black tracking-[0.25em] uppercase text-black transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {formState === "loading" ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="mt-4 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-gray-700">
                  We typically respond within 24–48 hours
                </p>
              </>
            )}
          </div>

          {/* Bottom crimson accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent, #dc143c 50%, transparent)",
            }}
          />
        </div>
      </div>
    </>
  );
}