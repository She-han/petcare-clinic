import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import PetsIcon from "@mui/icons-material/Pets";

const services = [
  {
    title: "Wellness Exams",
    icon: <LocalHospitalIcon fontSize="large" className="text-primary" />,
    desc: "Comprehensive check-ups to keep your pet healthy and happy.",
  },
  {
    title: "Vaccinations",
    icon: <VaccinesIcon fontSize="large" className="text-accent" />,
    desc: "Protect your pets with the latest vaccines and boosters.",
  },
  {
    title: "Grooming & Care",
    icon: <PetsIcon fontSize="large" className="text-primary" />,
    desc: "Professional grooming and pampering for all breeds.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-heading font-bold text-center text-dark mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Our Services
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              className="bg-light shadow-lg rounded-2xl p-8 flex-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.2 }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-2xl font-heading font-semibold text-accent mb-2">{service.title}</h3>
              <p className="text-dark font-body text-center">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}