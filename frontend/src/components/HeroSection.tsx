import { motion } from "framer-motion";
import React from "react";

const images = [
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518715308788-30057509c1e2?auto=format&fit=crop&w=800&q=80",
];

export default function HeroSection() {
  // Simple image slider with fade effect
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="relative w-full flex items-center min-h-[70vh] md:min-h-[80vh] overflow-hidden" style={{backgroundColor: "#EDFCFD"}}>
      {/* Sliding Background Images */}
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === i ? 1 : 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            opacity: idx === i ? 1 : 0,
            transition: 'opacity 1.2s',
          }}
          aria-hidden={idx !== i}
        />
      ))}
      {/* Overlay for color effect */}
      <div className="absolute inset-0 z-10" style={{
        background: "linear-gradient(135deg, #144E8Cbb 0%, #0074D9cc 100%)",
        mixBlendMode: "multiply"
      }} />

    {/* Modern Decorative Shapes */}{/*}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full z-20"
        style={{ background: "radial-gradient(circle at 30% 30%, #2ECC7190 0%, transparent 80%)" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-28 w-80 h-80 rounded-full z-20"
        style={{ background: "radial-gradient(circle at 65% 70%, #EDFCFD90 0%, transparent 75%)" }}
        animate={{ scale: [1, 1.07, 1], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-32 h-16 rounded-b-full z-30"
        style={{ background: "#2ECC71", opacity: 0.6, filter: "blur(18px)" }}
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />*/}

      {/* Content */}
      <div className="relative z-40 w-full flex flex-col items-center text-center px-4 py-16 md:py-36">
        <motion.h1
          className="font-bold text-4xl md:text-6xl leading-tight mb-4"
          style={{ color: "#EDFCFD", textShadow: "0 6px 32px #144E8C, 0 1px 0px #28283E" }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          Compassionate Modern Petcare
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg md:text-2xl mb-10"
          style={{ color: "#2ECC71", fontWeight: 600, textShadow: "0 2px 14px #144E8Cdd" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Veterinary expertise, heartfelt care. Your pet’s health and happiness, always our top priority.
        </motion.p>

        <motion.a
          href="/appointments"
          className="inline-block rounded-full px-8 py-4 text-lg font-bold shadow-lg"
          style={{
            background: "#2ECC71",
            color: "#EDFCFD",
            letterSpacing: 1.2,
            boxShadow: "0 4px 32px 0 #0074D980"
          }}
          whileHover={{ scale: 1.06, y: -2, boxShadow: "0 8px 32px 0 #2ECC7190" }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
        >
          Book an Appointment
        </motion.a>
      </div>

      {/* Responsive: fade for mobile overlays */}
      <div className="absolute inset-0 bg-[#144E8C] opacity-40 md:opacity-0 z-20 pointer-events-none" />
    </section>
  );
}