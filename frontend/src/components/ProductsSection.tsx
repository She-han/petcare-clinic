import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const products = [
  {
    name: "Healthy Kibble",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    desc: "Nutritious, vet-approved dry food for all breeds.",
    price: "$29.99",
    badge: "Best Seller",
    badgeClass: "bg-[#2ECC71]",
  },
  {
    name: "Cozy Pet Bed",
    img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
    desc: "Ultra-soft and washable, perfect for naps.",
    price: "$49.99",
    badge: "New",
    badgeClass: "bg-[#0074D9]",
  },
  {
    name: "Dental Chews",
    img: "https://images.unsplash.com/photo-1518715308788-30057509c1e2?auto=format&fit=crop&w=400&q=80",
    desc: "Cleans teeth and freshens breath.",
    price: "$9.99",
    badge: "",
    badgeClass: "",
  },
];

export default function ProductsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: "#EDFCFD" }}>
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          style={{ color: "#144E8C", fontFamily: "Montserrat, sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Featured Products
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-5xl mx-auto">
          {products.map((prod, idx) => (
            <motion.div
              key={prod.name}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="relative">
                <img src={prod.img} alt={prod.name} className="w-full h-48 object-cover" />
                {prod.badge && (
                  <span
                    className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full font-bold shadow ${prod.badgeClass}`}
                  >
                    {prod.badge}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#28283E", fontFamily: "Montserrat, sans-serif" }}
                >
                  {prod.name}
                </h3>
                <p
                  className="mb-4 flex-1"
                  style={{ color: "#28283E", opacity: 0.8, fontFamily: "Inter, sans-serif" }}
                >
                  {prod.desc}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#0074D9" }}
                  >
                    {prod.price}
                  </span>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white shadow transition-colors duration-200"
                    style={{
                      backgroundColor: "#0074D9",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#144E8C")}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0074D9")}
                  >
                    <ShoppingCartIcon fontSize="small" />
                    Buy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}