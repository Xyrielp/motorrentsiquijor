# MotorRent Siquijor - Frontend Demo

A modern, frontend-only motor rental marketplace demo built with React, specifically designed for Siquijor Island, Philippines.

## 🏍️ Features

### Customer Features
- Browse motorcycles by category with advanced filtering
- Search by location, price range, and availability
- User authentication (demo mode with mock data)
- Favorites system for saving preferred motorcycles
- Enhanced booking system with local payment methods
- Review and rating system
- Travel blog with Siquijor guides and tips

### Demo Credentials
- Email: demo@example.com
- Password: password123

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd motorrentsiquijor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## 📁 Project Structure

```
motorrentsiquijor/
├── public/                 # Static files
├── src/
│   ├── admin/             # Admin components
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth, Favorites)
│   ├── data/              # Mock data
│   ├── pages/             # Page components
│   ├── services/          # API services (mock)
│   └── App.js             # Main app component
├── package.json
└── README.md
```

## 🌟 Key Features

### Frontend-Only Architecture
- **Mock Data**: All backend functionality replaced with mock data
- **Local Storage**: User authentication and favorites stored locally
- **No Backend Required**: Runs entirely in the browser

### Local Market Focus
- **Siquijor-specific content**: All content tailored for Siquijor Island
- **Local payment methods**: GCash, PayMaya, Bank Transfer, Cash payments
- **Filipino currency**: All prices in Philippine Peso (₱)

### Enhanced User Experience
- **Advanced filtering**: Price range, location, availability, category filters
- **Favorites system**: Save and manage favorite motorcycles
- **Enhanced booking**: Detailed booking flow with delivery options
- **Mobile responsive**: Optimized for mobile devices

## 🎨 Design System

### Colors
- **Primary**: #ee4d2d (Shopee-inspired orange)
- **Success**: #28a745 (Green for verified badges)
- **Warning**: #ffc107 (Yellow for pending status)
- **Info**: #17a2b8 (Blue for information)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `build` folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for the beautiful island of Siquijor, Philippines
- Designed to showcase modern React development practices
- Frontend-only demo for easy deployment and testing

---

**MotorRent Siquijor** - Explore the mystical island on two wheels! 🏍️🏝️