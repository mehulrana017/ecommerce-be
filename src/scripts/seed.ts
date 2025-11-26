import Product from "../models/productModel.ts";
import Category from "../models/categoryModel.ts";
import User from "../models/userModel.ts";

// Category data with integer IDs
const categories = [
  {
    categoryId: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets",
    isActive: true,
  },
  {
    categoryId: 2,
    name: "Clothing",
    description: "Fashion and apparel",
    isActive: true,
  },
  {
    categoryId: 3,
    name: "Accessories",
    description: "Fashion and tech accessories",
    isActive: true,
  },
  {
    categoryId: 4,
    name: "Books",
    description: "Books and publications",
    isActive: true,
  },
  {
    categoryId: 5,
    name: "Sports",
    description: "Sports and fitness equipment",
    isActive: true,
  },
  {
    categoryId: 6,
    name: "Home & Kitchen",
    description: "Home and kitchen items",
    isActive: true,
  },
];

// Product data with category IDs
const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-canceling wireless headphones with 30-hour battery life and superior sound quality. Perfect for music lovers and professionals.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944",
    ],
    price: 199.99,
    stock: 50,
    category: 1, // Electronics
    tags: ["audio", "wireless", "bluetooth", "headphones"],
    rating: 4.5,
    reviewCount: 128,
    isActive: true,
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors. Made from 100% organic cotton with eco-friendly dyes.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68",
    ],
    price: 29.99,
    stock: 200,
    category: 2, // Clothing
    tags: ["clothing", "organic", "casual", "sustainable"],
    rating: 4.2,
    reviewCount: 85,
    isActive: true,
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track your fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and 50+ sport modes.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
    ],
    price: 249.99,
    stock: 75,
    category: 1, // Electronics
    tags: ["fitness", "smartwatch", "health", "wearable"],
    rating: 4.7,
    reviewCount: 203,
    isActive: true,
  },
  {
    name: "Leather Laptop Bag",
    description:
      "Genuine leather laptop bag with multiple compartments. Fits laptops up to 15.6 inches. Professional and durable design.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    ],
    price: 89.99,
    stock: 40,
    category: 3, // Accessories
    tags: ["bag", "leather", "laptop", "professional"],
    rating: 4.4,
    reviewCount: 67,
    isActive: true,
  },
  {
    name: "The Art of Programming",
    description:
      "Comprehensive guide to modern programming practices. Covers algorithms, data structures, and software design patterns. Perfect for beginners and experts.",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    ],
    price: 45.99,
    stock: 120,
    category: 4, // Books
    tags: ["books", "programming", "education", "technology"],
    rating: 4.8,
    reviewCount: 342,
    isActive: true,
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof design.",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504",
    ],
    price: 24.99,
    stock: 150,
    category: 3, // Accessories
    tags: ["water bottle", "insulated", "eco-friendly", "reusable"],
    rating: 4.6,
    reviewCount: 95,
    isActive: true,
  },
  {
    name: "Wireless Gaming Mouse",
    description:
      "High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons. 16,000 DPI sensor for ultimate accuracy.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
    ],
    price: 79.99,
    stock: 60,
    category: 1, // Electronics
    tags: ["gaming", "mouse", "wireless", "rgb"],
    rating: 4.5,
    reviewCount: 156,
    isActive: true,
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Extra thick yoga mat with superior cushioning and non-slip surface. Made from eco-friendly TPE material. Includes carrying strap.",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
    ],
    price: 39.99,
    stock: 85,
    category: 5, // Sports
    tags: ["yoga", "fitness", "exercise", "wellness"],
    rating: 4.3,
    reviewCount: 72,
    isActive: true,
  },
  {
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 handcrafted ceramic coffee mugs. Microwave and dishwasher safe. Each mug holds 12 oz and features unique artisan designs.",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38",
    ],
    price: 34.99,
    stock: 95,
    category: 6, // Home & Kitchen
    tags: ["mugs", "ceramic", "coffee", "kitchen"],
    rating: 4.1,
    reviewCount: 43,
    isActive: true,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof portable speaker with 360-degree sound. 12-hour battery life and wireless connectivity up to 30 feet.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d",
    ],
    price: 59.99,
    stock: 110,
    category: 1, // Electronics
    tags: ["speaker", "bluetooth", "portable", "waterproof"],
    rating: 4.4,
    reviewCount: 187,
    isActive: true,
  },
  {
    name: "Running Shoes Pro",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for long-distance runners.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    ],
    price: 129.99,
    stock: 70,
    category: 5, // Sports
    tags: ["shoes", "running", "athletic", "footwear"],
    rating: 4.6,
    reviewCount: 241,
    isActive: true,
  },
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${insertedCategories.length} categories`);

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};
