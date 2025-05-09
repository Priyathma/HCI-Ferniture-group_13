import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "../data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";

function HeroSection() {
  const swiperRef = useRef(null);

  const slides = [
    { image: "/images/slider-1.png", alt: "Furniture Big Sale" },
    { image: "/images/slider-2.png", alt: "Modern Furniture Sale" },
    { image: "/images/slider-3.png", alt: "Cyber Monday Sale" },
  ];

  return (
    <div className="relative">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-auto object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation arrows */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 z-20">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="bg-[#5E2E87] hover:bg-[#4A2468] p-3 text-white rounded-full transition-colors"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="bg-[#5E2E87] hover:bg-[#4A2468] p-3 text-white rounded-full transition-colors"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  // Get featured products for both sections
  const featuredProducts = products.filter((p) => p.featured);
  const scrollProducts = featuredProducts.slice(0, 6); // First 6 for scroll
  const gridProducts = featuredProducts.slice(6, 12); // Next 6 for grid

  // Reference to the scroll container
  const scrollContainerRef = useRef(null);

  // Handle scroll
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust this value to control scroll distance
      const newScrollPosition =
        direction === "right"
          ? scrollContainerRef.current.scrollLeft + scrollAmount
          : scrollContainerRef.current.scrollLeft - scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700"
          >
            See All
          </Link>
        </div>

        {/* Products Scroll Section */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide"
          >
            {scrollProducts.map((product) => (
              <div key={product.id} className="flex-none w-72">
                <Link to={`/product/${product.id}`} className="group">
                  <div className="relative">
                    <div className="w-full rounded-lg overflow-hidden aspect-square">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      <p className="font-medium text-gray-900">
                        ${product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="ml-2 text-sm text-gray-500 line-through">
                          RRP ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Scroll Buttons */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* More Products Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">More to Love</h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700"
            >
              Shop All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xl font-bold">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm line-through opacity-75">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-sm px-3 py-1 rounded-full font-medium">
                    Featured
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-16 relative rounded-lg overflow-hidden">
          <video className="w-full h-auto" autoPlay loop muted playsInline>
            <source src="/clip/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  // Get featured products for flash deals
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  // Get latest products for new arrivals (using the last 4 products)
  const newArrivalsProducts = products.slice(-4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Deals Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Flash Deals: They'll Be Gone in a Flash →
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#8B0000] text-white text-sm px-2 py-1 rounded">
                    WAY DAY
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-sm p-2 rounded">
                    <div className="font-semibold truncate">{product.name}</div>
                    <div className="text-primary-300">${product.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              New Arrivals: Extra 10% Off With Code NEW10 →
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivalsProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#E91E63] text-white text-sm px-2 py-1 rounded">
                    10% Off New Arrivals
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-sm p-2 rounded">
                    <div className="font-semibold truncate">{product.name}</div>
                    <div className="text-primary-300">${product.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="block group"
            >
              <div className="relative bg-[#5E2E87] rounded-lg p-6 h-[300px] overflow-hidden">
                {/* Decorative Bunting */}
                <div className="absolute top-0 right-0 p-2">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-yellow-300 transform rotate-45"
                      />
                    ))}
                  </div>
                </div>

                {/* Category Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-yellow-300">
                    {category.name}
                  </h3>
                  <p className="text-white text-sm">{category.description}</p>
                </div>

                {/* Category Image */}
                <div className="absolute bottom-0 right-0 w-3/4 h-2/3 flex items-end justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-w-full max-h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 bg-yellow-300 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-[#5E2E87]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      text: "The 3D preview feature is amazing! I was able to visualize exactly how the sofa would look in my living room before purchasing. The quality is exceptional and delivery was right on time.",
      author: "Priyanka Perera",
      role: "Home Owner",
    },
    {
      text: "As an interior designer, I frequently recommend this store to my clients. Their modern collection perfectly balances style and comfort. The craftsmanship of each piece is outstanding.",
      author: "Ashan De Silva",
      role: "Interior Designer",
    },
    {
      text: "I furnished my entire office with their executive collection. The quality and durability are unmatched, and their after-sales service is exceptional. Highly recommended!",
      author: "Kumari Jayawardena",
      role: "Business Director",
    },
    {
      text: "The dining set I purchased is absolutely beautiful. The attention to detail in the woodwork is remarkable, and their staff was incredibly helpful throughout the process.",
      author: "Rajitha Fernando",
      role: "Restaurant Owner",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it — hear from some of our satisfied
            customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 bg-primary-500 w-8 h-8 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </div>

              {/* Testimonial Content */}
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-primary-600">{testimonial.role}</p>
                </div>
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Start Shopping
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialSection />
    </div>
  );
}

// Add this CSS class to hide scrollbar but allow scrolling
const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);
