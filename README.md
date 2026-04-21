# 🕋 Mihrab — Modern Masjid Connection Platform
A sleek, full-stack platform built with Next.js and MongoDB to keep communities connected with their local Masjids through real-time timings and media updates.

`Next.js` `MongoDB` `TypeScript` `Mongoose`

---

## ✨ Features

### 🔐 Masjids Hub
- **Dynamic Listing**: Complete listing of local Masjids with detailed addresses.
- **Search & Discovery**: Advanced search functionality by name or specific area.
- **Nearby Filter**: "Nearby Masjids" filter toggle for local discovery.
- **Personalized Favourites**: Client-side favourites system using browser localStorage.

### ⏱️ Dynamic Salah Timings
- **Real-Time Display**: Accurate Azaan and Iqamah times for all 6 daily prayers.
- **Recency Tracker**: "Updated X hours ago" counter for timing verified status.
- **Direct Database Sync**: Timings are fetched fresh from the database on every load.

### 🛠️ Inline Timing Updates
- **Seamless Editing**: Verified users can update times directly within the interface.
- **No Popups**: Clean inline editing system — saves instantly with one click.
- **Instant Hot-Reload**: Changes are reflected for all users without page refreshes.

### 🖼️ Multimedia Gallery
- **Slideshow**: Animated image slideshow with 3-second auto-transitions.
- **Video Integration**: Embedded YouTube player for community videos and events.
- **Premium Frame**: Housed in a polished mobile-frame layout for an app-like feel.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15** | Core React framework with App Router & Server Components |
| **MongoDB Atlas** | Cloud document storage for high-availability Masjid data |
| **Mongoose** | Schema modeling and database relationship management |
| **Lucide React** | High-quality, lightweight iconography |
| **Vanilla CSS** | Performance-first custom design system with Teal Blue accents |
| **TypeScript** | Type-safe development for enterprise-grade stability |

---

## 📁 Project Structure

```text
lib/
├── src/
│   ├── app/
│   │   ├── api/             # Backend API Route Handlers (GET/PUT)
│   │   ├── gallery/         # Slideshow & YouTube video integration
│   │   └── masjids/         # Dynamic routes for masjid lists & details
│   ├── components/
│   │   ├── Navbar.tsx       # Sticky glassmorphism navigation
│   │   └── Footer.tsx       # Semantic site footer
│   ├── models/
│   │   └── masjid.ts        # Mongoose Schema & Interface definitions
│   └── globals.css          # Theme variables & global CSS resets
```

---

## 🔥 Database Schema

### `masjids` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| **name** | String | Official name of the Masjid |
| **address** | String | Physical location details |
| **timings** | Object | Nested object containing `azaan` and `iqamah` for 6 prayers |
| **lastUpdated** | Date | Timestamp of the most recent timing modification |
| **createdAt** | Date | Timestamp when the masjid was added |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18.17.0** or higher
- A running **MongoDB** cluster (Local or Atlas)

### 1. Setup
```bash
# Clone the repository
git clone https://github.com/NadheemM/Mihrab-site.git

# Navigate to directory
cd Mihrab-site

# Install dependencies
npm install
```

### 2. Configuration
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Execution
```bash
# Start development server
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 📄 License
This project is open-source and available under the **MIT License**.

**Made with ❤️ for the community by Nadheem**
