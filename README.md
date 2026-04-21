🕋 Mihrab — Modern Masjid Connection Platform
A sleek, full-stack platform built with Next.js and MongoDB to keep communities connected with their local Masjids through real-time timings and media updates.

Next.js MongoDB TypeScript

✨ Features
🕌 Masjids Hub
Complete listing of local Masjids with detailed addresses.
Advanced search functionality by name or specific area.
"Nearby Masjids" filter toggle for local discovery.
Personalized Favourites system using browser localStorage for persistence.
⏱️ Dynamic Salah Timings
Highly accurate Azaan and Iqamah times for all 6 daily prayers (including Jummah).
"Updated X hours ago" dynamic tracker to ensure data freshness.
Real-time database sync for instant data reflection.
🛠️ Inline Timing Updates
Dedicated inline editing system allowing verified users to update times on the fly.
No clumsy popups — edit directly within the timings table.
Instant hot-reloading of UI components upon saving.
🖼️ Multimedia Gallery
Modern image slideshow with 3-second auto-transitions.
Embedded YouTube integration for community videos directly within the site.
Premium mobile-phone frame layout for a polished, app-like feel.
🎨 Premium UI/UX
Distinctive Teal Blue (#41C2DC) primary theme for a modern islamic aesthetic.
Fully responsive design optimized for mobile and desktop viewing.
Smooth micro-animations and Google Fonts (Outfit) integration.
🛠️ Tech Stack
Technology	Purpose
Next.js 15	Core React framework with App Router
MongoDB	Real-time document storage for Masjid data
Mongoose	Schema modeling and database management
Lucide React	Clean, modern iconography
Vanilla CSS	Custom design system and theme variables
TypeScript	Strict type safety and developer productivity
📁 Project Structure
src/
├── app/
│   ├── api/                         # Backend Route Handlers (GET/PUT)
│   ├── gallery/                     # Animated Slideshow & Video player
│   └── masjids/                     # Dynamic listing and detailed view routes
├── components/
│   ├── Navbar.tsx                   # Sticky glassmorph navigation
│   └── Footer.tsx                   # Global site footer
├── lib/
│   └── mongodb.ts                   # Database connection helper
├── models/
│   └── masjid.ts                    # Mongoose schema for Masjid & Timings
└── globals.css                      # Global theme and CSS variables
🚀 Getting Started
Prerequisites
Node.js 18+
A running MongoDB instance (Local or Atlas)
Setup
Clone the repository
git clone https://github.com/NadheemM/Mihrab-site.git
cd Mihrab-site
Install dependencies
npm install
Configure Environment
Create a .env.local file in the root directory and add:
MONGODB_URI=your_mongodb_connection_string
Run the development server
npm run dev
Open http://localhost:3000 to see the site live.

📄 License
This project is open source and available under the MIT License.

Made with ❤️ for the Community

