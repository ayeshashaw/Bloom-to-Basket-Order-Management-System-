Food Ordering System
A full-stack food ordering application built with React and Node.js, featuring user authentication, food management, order processing, and payment integration.
🚀 Features

User Authentication: Secure login and registration system
Food Menu Management: Browse and search food items
Shopping Cart: Add/remove items with quantity management
Order Management: Place orders and track order status
Payment Processing: Integrated with Stripe for secure payments
Admin Panel: Manage food items, orders, and users
Responsive Design: Works seamlessly on desktop and mobile devices
File Upload: Support for food images using Multer

🛠️ Technologies Used
Backend

Node.js: JavaScript runtime environment
Express.js: Web application framework
MongoDB: NoSQL database for data storage
Mongoose: MongoDB object data modeling (ODM)
JWT: JSON Web Tokens for authentication
bcryptjs: Password hashing and encryption
Stripe: Payment processing integration
Multer: File upload handling for images
CORS: Cross-Origin Resource Sharing
Validator: String validation and sanitization

Frontend

React: JavaScript library for building user interfaces
Vite: Fast build tool and development server
React Router DOM: Client-side routing
Axios: HTTP client for API requests
Context API: Global state management
CSS3: Styling and responsive design

📁 Project Structure
├── backend/
│   ├── config/                 # Database configuration
│   ├── controllers/            # Business logic controllers
│   │   ├── foodControllers.js  # Food-related operations
│   │   ├── orderControllers.js # Order management
│   │   └── userControllers.js  # User authentication
│   ├── middlewears/            # Custom middleware functions
│   ├── models/                 # Mongoose data models
│   │   ├── foodModels.js       # Food item schema
│   │   ├── ordersModel.js      # Order schema
│   │   └── userModel.js        # User schema
│   ├── routers/                # API route definitions
│   ├── upload/                 # File upload directory
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
⚙️ Setup and Installation
Prerequisites

Node.js (v14 or higher)
MongoDB (local installation or MongoDB Atlas)
npm or yarn package manager

1. Clone the Repository
bashgit clone <repository-url>
cd food-ordering-system
2. Backend Setup
bash# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
Environment Variables
Create a .env file in the backend directory with the following variables:
envMONGODB_URI=mongodb://localhost:27017/food-ordering
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
bash# Start the backend server
npm start
# or for development with nodemon
npm run dev
3. Frontend Setup
bash# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
🌐 Usage

Access the Application: Open your browser and navigate to http://localhost:5173
User Registration: Create a new account or log in with existing credentials
Browse Menu: Explore available food items and add them to your cart
Place Orders: Review your cart and proceed to checkout
Payment: Complete payment using Stripe integration
Admin Access: Access admin panel to manage food items and orders

🔑 API Endpoints
Authentication

POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile

Food Management

GET /api/food - Get all food items
POST /api/food - Add new food item (Admin)
PUT /api/food/:id - Update food item (Admin)
DELETE /api/food/:id - Delete food item (Admin)

Orders

POST /api/orders - Create new order
GET /api/orders - Get user orders
GET /api/orders/all - Get all orders (Admin)
PUT /api/orders/:id - Update order status (Admin)

Payment

POST /api/payment/create-intent - Create Stripe payment intent
POST /api/payment/confirm - Confirm payment

🚀 Deployment
Backend Deployment

Choose a hosting platform (Heroku, Railway, DigitalOcean)
Set up environment variables
Configure MongoDB connection (MongoDB Atlas recommended)
Deploy using platform-specific instructions

Frontend Deployment

Build the production version:

bashnpm run build

Deploy to hosting platform (Vercel, Netlify, GitHub Pages)
Update API endpoints to point to your deployed backend

🤝 Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
👥 Authors

Your Name - Ayesha Shaw

🙏 Acknowledgments

React community for excellent documentation
Express.js team for the robust framework
MongoDB for flexible data storage
Stripe for secure payment processing

📞 Support
If you have any questions or need support, please open an issue or contact [ayeshashaw520@gmail.com].

Happy Coding! 🍕🚀
