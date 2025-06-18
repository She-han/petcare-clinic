import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Emily R.",
    pet: "Bella the Cat",
    feedback:
      "The staff at Petcare Clinic are amazing! Bella always gets the best care and comes home happy.",
  },
  {
    name: "James T.",
    pet: "Max the Dog",
    feedback:
      "Modern facilities and such a welcoming atmosphere. I trust them completely with Max's health.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-light">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-heading font-bold text-center text-dark mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          What Our Clients Say
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto flex-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.2 }}
            >
              <p className="text-lg text-dark italic mb-4">"{t.feedback}"</p>
              <div className="text-primary font-bold">{t.name}</div>
              <div className="text-accent">{t.pet}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}