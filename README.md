# Admin Portal – Registration Management Dashboard

A production-ready admin dashboard for managing, analyzing, and exporting user registrations. Built with modern web technologies and designed for real-world admin workflows.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

## 🎯 Overview

This admin portal provides a comprehensive solution for managing user registrations with an intuitive interface, powerful filtering capabilities, and data export features. Perfect for events, courses, membership programs, or any platform requiring user registration management.

## ✨ Features

### 📊 Dashboard Analytics
- *Total Registrations* - Complete registration count
- *Student Registrations* - Student user metrics
- *Professional Registrations* - Professional user metrics
- *Today's Registrations* - Real-time daily signups
- *Last 7 Days Registrations* - Weekly trend analysis

### 📋 Registration Management
View and manage all registrations in a comprehensive table with the following columns:
- Name
- Email
- Type (Student / Professional)
- Company (for Professionals only)
- Phone
- Registration Date
- Status

### 🔍 Advanced Filtering & Search

*Filter by Type:*
- All
- Student
- Professional

*Filter by Status:*
- New
- Contacted
- Approved
- Rejected

*Global Search* across:
- Name
- Email
- Phone
- Company

### 🗂️ Sorting & Pagination
- Sort by Registration Date, Name, or Type
- Flexible page sizes: 10, 25, or 50 records per page
- Smooth pagination controls

### 📅 Date Range Filtering
- Today
- Last 7 Days
- Last 30 Days
- Custom date range picker

### 📝 Registration Details
- Click any row to open detailed modal
- View complete registration information
- Update registration status directly from modal
- Quick access to all user data

### 📤 Export Capabilities
- Export all registrations to CSV
- Export filtered data to CSV
- Export filtered data to Excel
- Preserve current filters and search criteria in exports

### 🔐 Authentication
- Protected routes with authentication
- Secure admin access
- Session management

### 🎨 UX Enhancements
- Loading skeletons for better perceived performance
- Empty state UI for better user experience
- Comprehensive error handling
- Fully responsive design (mobile, tablet, desktop)
- Optional dark mode support

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
bash
git clone https://github.com/yourusername/registeration-hub
cd registeration-hub


2. Install dependencies:
bash
npm install
# or
yarn install


3. Set up environment variables:
bash
cp .env.example .env


Edit .env with your configuration:
env
SUPABASE_URL=your_api_endpoint
SUPABASE_Token=your_auth_token


4. Start the development server:
bash
npm start
# or
yarn start


The application will open at http://localhost:3000

## 📦 Build for Production

bash
npm run build
# or
yarn build


The optimized production build will be in the build folder.

## 🛠️ Tech Stack

- *Frontend Framework*: React 18.x
- *Language*: TypeScript
- *Styling*: Tailwind CSS
- *State Management*: React Hooks / Context API
- *Routing*: React Router
- *Data Fetching*: Axios / Fetch API
- *Date Handling*: date-fns
- *Export Functionality*: Papa Parse (CSV), xlsx (Excel)
- *Icons*: Lucide React





### Theme
Modify tailwind.config.js to customize colors, fonts, and spacing.

### Dark Mode
Dark mode can be toggled via the settings menu. Customize dark mode colors in your Tailwind configuration.

## 🧪 Testing

bash
npm test
# or
yarn test


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📧 Support

For support, email support@yourdomain.com or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern admin dashboards
- Built with ❤️ by [Your Name/Team]

---
