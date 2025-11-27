# Mini E-Commerce Backend

A RESTful API backend for a mini e-commerce application built with Node.js, Express, MongoDB, and Stripe integration for payment processing.

## Features

- User authentication with JWT
- Product management (CRUD operations)
- Category management
- Shopping cart functionality
- Order management
- Stripe payment integration
- Secure password hashing with bcrypt

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe
- **Language:** TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Stripe account for payment processing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mehulrana017/ecommerce-be.git
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token generation |
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret for event verification |
| `FRONTEND_URL` | Frontend application URL for CORS |

## Running the Application

### Development Mode
Run the application in development mode with hot-reloading:
```bash
npm run dev
```

### Production Mode
Build and run the application in production:
```bash
npm run prod
```

Or build and start separately:
```bash
npm run build
npm start
```

### Additional Scripts
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## Database Seeding

To seed the database with sample data:
```bash
npx tsx src/scripts/seed.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Checkout
- `POST /api/checkout/create-checkout-session` - Create Stripe checkout session
- `POST /api/checkout/webhook` - Handle Stripe webhook events

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares (auth)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts (seed)
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Security Notes

- Never commit the `.env` file to version control
- Change the `JWT_SECRET` in production
- Use strong, unique passwords for MongoDB
- Keep Stripe keys secure and never expose them in client-side code

## License

This project is private and for educational purposes.
