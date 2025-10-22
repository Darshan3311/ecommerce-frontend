# E-Commerce Platform - Frontend

A modern, responsive e-commerce frontend built with React, Tailwind CSS, and modern web technologies.

## 🚀 Features

- **Modern UI/UX**
  - Fully responsive design (mobile-first)
  - Clean and professional interface
  - Smooth animations and transitions
  - Optimized color scheme for e-commerce

- **Authentication**
  - User registration with email verification
  - Login/Logout functionality
  - Password reset
  - Protected routes
  - Persistent authentication state

- **Product Features**
  - Product listing with filters
  - Product search
  - Product details with image gallery
  - Product variants (size, color, etc.)
  - Product reviews and ratings
  - Wishlist functionality

- **Shopping Experience**
  - Shopping cart with local persistence
  - Real-time cart updates
  - Checkout process
  - Order tracking
  - Order history

- **State Management**
  - Zustand for global state
  - React Query for server state
  - Local storage persistence
  - Cart synchronization

## 📁 Project Structure

```
frontend/
├── public/              # Static files
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Loading.js
│   │   ├── layout/
│   │   │   ├── Layout.js
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   └── product/
│   │       └── ProductCard.js
│   ├── pages/           # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── VerifyEmailPage.js
│   │   ├── HomePage.js
│   │   ├── ProductListPage.js
│   │   ├── ProductDetailPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── ProfilePage.js
│   │   ├── OrdersPage.js
│   │   ├── OrderDetailPage.js
│   │   ├── WishlistPage.js
│   │   └── NotFoundPage.js
│   ├── services/        # API services
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   └── review.service.js
│   ├── store/           # State management
│   │   ├── useAuthStore.js
│   │   └── useCartStore.js
│   ├── utils/           # Utility functions
│   │   └── api.js
│   ├── App.js           # Main app component
│   ├── index.js         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## 🛠️ Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

4. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎨 Design System

### Color Palette

- **Primary** (Red/Pink) - CTAs, important buttons
  - Used for: Primary buttons, links, highlights
  
- **Secondary** (Gray/Black) - Text, backgrounds
  - Used for: Text, borders, subtle backgrounds
  
- **Accent** (Orange) - Energy, warnings
  - Used for: Badges, notifications, special offers

### Typography

- Font Family: Inter (Google Fonts)
- Headings: Bold weights (700-900)
- Body: Regular/Medium weights (400-500)

### Components

All components follow Tailwind utility-first approach:
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Inputs: `.input`
- Cards: `.card`
- Container: `.container-custom`

## 📦 Technologies Used

- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state management
- **Axios** - HTTP client
- **Formik & Yup** - Form handling and validation
- **React Hot Toast** - Notifications
- **Heroicons** - Icons
- **Swiper** - Carousels/sliders
- **Day.js** - Date formatting

## 🔧 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Features Implementation

### Authentication Flow
1. User registers → Email sent
2. User verifies email → Account activated
3. User logs in → JWT token stored
4. Protected routes check authentication
5. Auto-redirect to login if not authenticated

### Cart Management
1. Guest users: Cart stored in localStorage
2. Logged-in users: Cart synced with backend
3. On login: Local cart merged with server cart
4. Real-time updates across tabs

### State Management
- **Auth State**: User data, tokens (Zustand + localStorage)
- **Cart State**: Cart items, totals (Zustand + localStorage)
- **Server Data**: Products, orders (React Query)

## 🔒 Security Features

- Protected routes
- JWT token management
- XSS protection
- CSRF prevention
- Secure cookie handling
- Input sanitization

## 🚀 Performance Optimizations

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Debounced search
- Pagination

## 📱 Mobile Responsiveness

- Touch-friendly UI elements
- Mobile navigation menu
- Optimized images for mobile
- Fast loading times
- Progressive Web App ready

## 🎨 UI Components

### Layout Components
- Header with search and navigation
- Footer with links and newsletter
- Responsive sidebar
- Breadcrumbs

### Product Components
- Product card with image, price, rating
- Product grid/list view
- Product filters and sorting
- Quick view modal

### Form Components
- Input fields with validation
- Select dropdowns
- Checkboxes and radio buttons
- File upload with preview

### Feedback Components
- Loading spinners
- Toast notifications
- Error messages
- Success confirmations

## 📝 Best Practices

- Component composition
- Reusable components
- Custom hooks
- Error boundaries
- Accessibility (ARIA labels)
- SEO optimization

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@eshop.com or join our Slack channel.
