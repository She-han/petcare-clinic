import { Button } from "@mui/material";
import { motion } from "framer-motion";

export default function FooterCTA() {
  return (
    <footer className="bg-dark py-16 mt-16">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-bold text-white mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Ready to give your pet the care they deserve?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              backgroundColor: "#2ECC71",
              color: "#fff",
              borderRadius: "2rem",
              fontWeight: 700,
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              boxShadow: "0 4px 24px 0 rgba(46, 204, 113, 0.2)"
            }}
            href="#"
          >
            Book Now
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}