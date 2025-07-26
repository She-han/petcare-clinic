import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import ProductDetailsModal from '../components/ProductDetailsModal';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionType, setActionType] = useState('');
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sortBy: 'latest',
    categories: [],
    searchTerm: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!sliderPaused && latestProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(latestProducts.length / 4));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderPaused, latestProducts]);

  // Filter products effect
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getAll();
      const productsData = response.data || [];
      setProducts(productsData);
      
      // Get latest products for slider (last 10 products)
      const latest = productsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setLatestProducts(latest);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setActionType('cart');
      setSelectedProduct(product);
      setShowAuthModal(true);
      return;
    }

    try {
      await apiService.cart.addItem({
        productId: product.id,
        quantity: 1,
        unitPrice: product.price
      });
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      setActionType('buy');
      setSelectedProduct(product);
      setShowAuthModal(true);
      return;
    }

    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (actionType === 'cart' && selectedProduct) {
      handleAddToCart(selectedProduct);
    } else if (actionType === 'buy' && selectedProduct) {
      setShowProductModal(true);
    }
  };

  const handleSliderNavigation = (direction) => {
    const maxSlides = Math.ceil(latestProducts.length / 4);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    } else {
      setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    }
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'FOOD': return 'bg-green-500 text-white';
      case 'TOYS': return 'bg-blue-500 text-white';
      case 'MEDICINE': return 'bg-red-500 text-white';
      case 'ACCESSORIES': return 'bg-indigo-600 text-white';
      case 'GROOMING': return 'bg-purple-600 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const categories = ['FOOD', 'TOYS', 'MEDICINE', 'ACCESSORIES', 'GROOMING'];
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="px-6 py-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section with Latest Products Slider */}
      <section className="relative py-10 text-gray-800 bg-gradient-to-r from-green-600/15 to-blue-600/15">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-10 text-2xl font-bold md:text-4xl">
              Latest Products
            </h1>
          
          </motion.div>

          {/* Image Slider */}
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              className="overflow-hidden rounded-2xl"
              onMouseEnter={() => setSliderPaused(true)}
              onMouseLeave={() => setSliderPaused(false)}
            >
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {Array.from({ length: Math.ceil(latestProducts.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="flex-shrink-0 w-full">
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                      {latestProducts.slice(slideIndex * 4, (slideIndex + 1) * 4).map((product) => (
                        <motion.div
                          key={product.id}
                          className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg cursor-pointer rounded-xl hover:scale-105"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductModal(true);
                          }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="overflow-hidden aspect-square">
                            <img
                              src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop'}
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-green-600">
                              ${product.price}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Slider Navigation */}
            <button
              onClick={() => handleSliderNavigation('prev')}
              className="absolute p-3 transition-all duration-200 transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleSliderNavigation('next')}
              className="absolute p-3 transition-all duration-200 transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Slider Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(latestProducts.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
              All Products
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Browse our complete collection of premium pet care products
            </p>
          </motion.div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky p-6 bg-white shadow-lg rounded-2xl top-8 lg:top-16"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Filter Products</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 text-green-600 bg-green-100 rounded-lg lg:hidden"
                  >
                    <FunnelIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Price Range */}
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-700">Price Range</h4>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [0, parseInt(e.target.value)]
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>$0</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-700">Sort By</h4>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-700">Type</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() => handleCategoryFilter(category)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700 capitalize">
                            {category.toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Products Grid */}
            <div className="mt-8 lg:col-span-3 lg:mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop'}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Category Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(product.category)}`}>
                          {product.category}
                        </div>

                        {/* Stock Status */}
                        {product.stockQuantity <= 10 && (
                          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stockQuantity === 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                          }`}>
                            {product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button className="absolute p-2 transition-opacity duration-300 transform -translate-x-1/2 rounded-full opacity-0 top-4 left-1/2 bg-white/80 backdrop-blur-sm group-hover:opacity-100 hover:bg-white">
                          <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
                            {product.brand || 'Premium Brand'}
                          </span>
                        </div>
                        
                        <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center mb-3 space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 4.5)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating || 4.5} ({product.totalReviews || 0} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center mb-4 space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${product.price}
                          </span>
                          {product.discountPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.discountPrice}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stockQuantity === 0}
                            className="flex items-center justify-center flex-1 px-4 py-3 space-x-2 font-semibold text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            <ShoppingCartIcon className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBuyNow(product)}
                            disabled={product.stockQuantity === 0}
                            className="flex items-center justify-center flex-1 h-10 px-4 py-3 space-x-2 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>Buy Now</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="text-lg text-gray-500">
                    No products found matching your criteria.
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showProductModal && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setShowProductModal(false)}
          />
        )}

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
    <Footer/>
    </>
  );
};

export default Products;