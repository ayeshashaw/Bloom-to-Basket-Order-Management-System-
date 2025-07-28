## Bloom to Basket(Order Management System)

A comprehensive full-stack food ordering application built with React and Node.js, featuring user authentication, food management, order processing, and payment integration.

### 🚀 Features

- **User Authentication**: Secure login and registration system.
- **Food Menu Management**: Browse and search for food items.
- **Shopping Cart**: Add/remove items while managing quantities.
- **Order Management**: Place orders and track their status.
- **Payment Processing**: Integrated with Stripe for secure payments.
- **Admin Panel**: Manage food items, orders, and users.
- **Responsive Design**: Seamlessly works on both desktop and mobile devices.
- **File Upload**: Supports food images using Multer.

### 🛠️ Technologies Used

#### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object data modeling (ODM).
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: For password hashing and encryption.
- **Stripe**: Payment processing integration.
- **Multer**: Handles file uploads for images.
- **CORS**: Cross-Origin Resource Sharing.
- **Validator**: For string validation and sanitization.

#### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **React Router DOM**: Client-side routing.
- **Axios**: HTTP client for API requests.
- **Context API**: Global state management.
- **CSS3**: For styling and responsive design.

### 📁 Project Structure

```
├── backend/
│   ├── config/                 # Database configuration
│   ├── controllers/            # Business logic controllers
│   │   ├── foodControllers.js  # Food-related operations
│   │   ├── orderControllers.js  # Order management
│   │   └── userControllers.js   # User authentication
│   ├── middlewares/            # Custom middleware functions
│   ├── models/                 # Mongoose data models
│   │   ├── foodModels.js       # Food item schema
│   │   ├── ordersModel.js      # Order schema
│   │   └── userModel.js        # User schema
│   ├── routers/                # API route definitions
│   ├── upload/                 # Directory for file uploads
│   ├── server.js               # Main server file
│   └── package.json            # Backend dependencies
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── admin/              # Admin panel components
│   │   ├── assets/             # Images and static files
│   │   │   └── images/         # Image assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer/         # Footer component
│   │   │   ├── Header/         # Header component
│   │   │   ├── Menu/           # Menu components
│   │   │   └── Navbar/         # Navigation bar
│   │   ├── context/            # React Context for state management
│   │   │   └── AppContext.jsx  # Global application context
│   │   ├── pages/              # Application pages/views
│   │   ├── App.jsx             # Main App component
│   │   ├── App.css             # Global styles
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

### ⚙️ Setup and Installation

#### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-ordering-system
```

#### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

**Environment Variables**: Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/food-ordering
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
```

```bash
# Start the backend server
npm start
# or for development with nodemon
npm run dev
```

#### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 🌐 Usage

- **Access the Application**: Open your browser and navigate to http://localhost:5173.
- **User Registration**: Create a new account or log in with existing credentials.
- **Browse Menu**: Explore available food items and add them to your cart.
- **Place Orders**: Review your cart and proceed to checkout.
- **Payment**: Complete payment using Stripe integration.
- **Admin Access**: Access the admin panel to manage food items and orders.

### 🔑 API Endpoints

#### Authentication

- `POST /api/auth/register`: User registration.
- `POST /api/auth/login`: User login.
- `GET /api/auth/profile`: Retrieve user profile.

#### Food Management

- `GET /api/food`: Retrieve all food items.
- `POST /api/food`: Add a new food item (Admin).
- `PUT /api/food/:id`: Update a food item (Admin).
- `DELETE /api/food/:id`: Delete a food item (Admin).

#### Orders

- `POST /api/orders`: Create a new order.
- `GET /api/orders`: Retrieve user orders.
- `GET /api/orders/all`: Retrieve all orders (Admin).
- `PUT /api/orders/:id`: Update order status (Admin).

#### Payment

- `POST /api/payment/create`: (Further details would follow here).

This should enhance clarity and structure while ensuring correct spelling and grammar.
