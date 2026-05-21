"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_vohqje2";
const TEMPLATE_ID = "template_eo0ziag";
const PUBLIC_KEY = "d-okM8LpO85d2U79B";

const socials = [
  { href: "mailto:abhinavmurugan848@gmail.com", Icon: Mail,     label: "Email"    },
  { href: "https://github.com/Abhinav-murugan1",          Icon: Github,   label: "GitHub"   },
  { href: "https://www.linkedin.com/in/abhinav-murugan/",        Icon: Linkedin, label: "LinkedIn" },
];

export function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [focus, setFocus]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    // PROOF OF STATE: Check your browser console when you click send!
    console.log("Data leaving React:", {
      name: form.name,
      email: form.email,
      message: form.message,
    });

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        PUBLIC_KEY,
      );
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 3500);
    } catch (err: any) {
      console.error("EmailJS error:", err);
      setError("Failed to send. Please try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen px-6 py-20 md:px-16 md:py-32 lg:px-24 overflow-hidden border-t border-white/5"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#a955ff]/6 blur-[140px]" />

      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-12 bg-gradient-to-r from-[#a955ff] to-transparent" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#a955ff]/80 font-semibold font-mono">Get In Touch</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Let's <span className="text-gradient-neon-purple">Connect</span>
          </h2>
          <p className="text-xs text-white/60 max-w-md leading-relaxed">
            Have a project in mind or just want to say hi? Drop a message — I'll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── LEFT: SOCIAL + INFO ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Info blocks */}
            {[
              { label: "Email", value: "abhinavmurugan848@gmail.com", href: "mailto:abhinavmurugan848@gmail.com" },
              { label: "Based in", value: "India" },
              { label: "Status", value: "Open to opportunities" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group"
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#a955ff] mb-1">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-base text-white/80 hover:text-[#C084FC] transition-colors duration-300 flex items-center gap-1.5"
                  >
                    {item.value}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ) : (
                  <p className="text-base text-white/80">{item.value}</p>
                )}
                <div className="mt-2 h-[1px] w-0 bg-gradient-to-r from-[#a955ff] to-transparent group-hover:w-full transition-all duration-500 ease-out" />
              </motion.div>
            ))}

            {/* Social links */}
            <div className="flex gap-3 mt-2">
              {socials.map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="group relative h-10 w-10 flex items-center justify-center border border-white/8 bg-white/[0.02] hover:border-[#a955ff]/40 hover:bg-[#a955ff]/8 transition-all duration-300"
                >
                  {/* Corner notches */}
                  <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#a955ff]/0 group-hover:border-[#a955ff]/60 transition-colors duration-300" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#a955ff]/0 group-hover:border-[#a955ff]/60 transition-colors duration-300" />
                  <Icon className="h-4 w-4 text-white/60 group-hover:text-[#C084FC] transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 flex flex-col gap-5"
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Name"
                name="name"
                value={form.name}
                onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
                placeholder="Your name"
                isFocused={focus === "name"}
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((prev) => ({ ...prev, email: v }))}
                placeholder="you@example.com"
                isFocused={focus === "email"}
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
              />
            </div>

            {/* Message */}
            <div className="relative group">
              <label className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#a955ff] mb-2 block">
                Message
              </label>
              <div className={`relative border transition-colors duration-300 ${focus === "message" ? "border-[#a955ff]/50" : "border-white/8"}`}>
                {/* Corner notches */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#a955ff]/0 group-focus-within:border-[#a955ff]/60 transition-colors duration-300 pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#a955ff]/0 group-focus-within:border-[#a955ff]/60 transition-colors duration-300 pointer-events-none" />
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  onFocus={() => setFocus("message")}
                  onBlur={() => setFocus(null)}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-xs placeholder:text-white/25 focus:outline-none focus:bg-white/[0.04] transition-all duration-300 resize-none font-mono"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-xs font-mono">{error}</p>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <motion.button
                type="submit"
                disabled={sending}
                whileHover="hover"
                className="group relative flex items-center gap-3 px-7 py-3 text-[13px] font-mono uppercase tracking-[0.25em] text-[#C084FC] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Corner notches */}
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#a955ff]/50 group-hover:border-[#a955ff] transition-colors duration-300" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#a955ff]/50 group-hover:border-[#a955ff] transition-colors duration-300" />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#a955ff]/50 group-hover:border-[#a955ff] transition-colors duration-300" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#a955ff]/50 group-hover:border-[#a955ff] transition-colors duration-300" />
                {/* Shimmer */}
                <span className="absolute inset-0 bg-[#a955ff]/0 group-hover:bg-[#a955ff]/6 transition-colors duration-500" />
                {/* Sweep line */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#a955ff] to-transparent group-hover:w-full transition-all duration-500 ease-out" />

                <span className="relative z-10">
                  {sending ? "Sending…" : sent ? "Message Sent ✦" : "Send Message"}
                </span>
                <motion.div
                  variants={{ hover: { x: 3, y: -3 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative z-10"
                >
                  {sending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </motion.form>

        </div>

      </div>
    </section>
  );
}

function FormField({
  label, name, value, onChange, placeholder, type = "text", isFocused, onFocus, onBlur,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div className="relative group">
      <label className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#a955ff] mb-2 block">
        {label}
      </label>
      <div className={`relative border transition-colors duration-300 ${isFocused ? "border-[#a955ff]/50" : "border-white/8"}`}>
        {/* Corner notches */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#a955ff]/0 group-focus-within:border-[#a955ff]/60 transition-colors duration-300 pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#a955ff]/0 group-focus-within:border-[#a955ff]/60 transition-colors duration-300 pointer-events-none" />
        <input
          required
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-xs placeholder:text-white/25 focus:outline-none focus:bg-white/[0.04] transition-all duration-300 font-mono"
        />
      </div>
    </div>
  );
}