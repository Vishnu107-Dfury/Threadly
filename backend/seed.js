require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const seedProducts = [
  {
    title: "Men's Classic Cotton T-Shirt",
    category: "Men's Apparel",
    grade: "A",
    brick: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 499,
    stock: 150,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    rating: 4.5,
    reviewCount: 2847,
    attributes: { material: "100% Cotton", fit: "Regular", color: "Navy Blue" }
  },
  {
    title: "Women's Floral Summer Dress",
    category: "Women's Apparel",
    grade: "Premium",
    brick: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    price: 1299,
    stock: 85,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    rating: 4.7,
    reviewCount: 1203,
    attributes: { material: "Viscose Blend", length: "Midi", pattern: "Floral Print" }
  },
  {
    title: "Men's Slim Fit Chino Pants",
    category: "Men's Apparel",
    grade: "A",
    brick: "Trousers",
    sizes: ["30", "32", "34", "36", "38"],
    price: 899,
    stock: 120,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    rating: 4.3,
    reviewCount: 987,
    attributes: { material: "Cotton Spandex", fit: "Slim Fit", color: "Khaki" }
  },
  {
    title: "Women's Oversized Graphic Tee",
    category: "Women's Apparel",
    grade: "B",
    brick: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    price: 399,
    stock: 200,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    rating: 4.1,
    reviewCount: 3421,
    attributes: { material: "Cotton Blend", fit: "Oversized", neck: "Round Neck" }
  },
  {
    title: "Kids' Denim Jacket",
    category: "Kids' Apparel",
    grade: "Premium",
    brick: "Jackets",
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"],
    price: 999,
    stock: 45,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80",
    rating: 4.6,
    reviewCount: 456,
    attributes: { material: "Denim", closure: "Button", color: "Light Wash Blue" }
  },
  {
    title: "Men's Formal Oxford Shirt",
    category: "Men's Apparel",
    grade: "Premium",
    brick: "Shirts",
    sizes: ["38", "39", "40", "42", "44"],
    price: 1499,
    stock: 90,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d09?w=800&q=80",
    rating: 4.8,
    reviewCount: 672,
    attributes: { material: "Egyptian Cotton", fit: "Tailored", sleeve: "Full Sleeve" }
  },
  {
    title: "Women's High-Rise Skinny Jeans",
    category: "Women's Apparel",
    grade: "A",
    brick: "Jeans",
    sizes: ["26", "28", "30", "32", "34"],
    price: 1199,
    stock: 110,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    rating: 4.4,
    reviewCount: 1893,
    attributes: { material: "Stretch Denim", fit: "Skinny", rise: "High-Rise" }
  },
  {
    title: "Unisex Fleece Pullover Hoodie",
    category: "Unisex Apparel",
    grade: "A",
    brick: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    price: 799,
    stock: 160,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    rating: 4.6,
    reviewCount: 2210,
    attributes: { material: "Fleece", style: "Pullover", color: "Heather Grey" }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');
    await Product.deleteMany({});
    console.log('Existing products cleared.');
    await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${seedProducts.length} products with images!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
