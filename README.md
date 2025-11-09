# Minyan Now 🕍

A web platform for finding active minyanim and nearby synagogues in real-time. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- 🗺️ **Interactive Map**: Find synagogues near your location with Google Maps integration
- 🔍 **Smart Search**: Search by location, synagogue name, or nusach (tradition)
- ⏰ **Prayer Times**: Accurate prayer times using MyZmanim and Hebcal APIs
- 👥 **Community Reports**: Real-time minyan status updates from the community
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🌍 **Accessibility**: Filter by wheelchair access, parking, air conditioning, and more

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Maps**: Google Maps API
- **Prayer Times**: MyZmanim API, Hebcal API
- **Authentication**: NextAuth.js (planned)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Maps API key
- MyZmanim API key (optional)
- Hebcal API key (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd minyan-now
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory (you can copy from `.env.local.example`):
   
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   
   ```env
   # Google Maps API - REQUIRED
   # Get your API key: https://console.cloud.google.com/google/maps-apis
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-actual-api-key-here"
   
   # Database (optional for basic usage)
   DATABASE_URL="file:./dev.db"
   
   # Other optional variables...
   ```
   
   **How to get Google Maps API Key:**
   
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select an existing one
   3. Enable **Maps JavaScript API** and **Places API**
   4. Go to "Credentials" → "Create Credentials" → "API Key"
   5. Copy the API key to your `.env.local` file
   6. (Recommended) Restrict the API key to only your domains for security

   **How to get Google Maps Map ID (for Advanced Markers):**
   
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Navigate to **Maps** → **Map Styles** (or go to [Map Styles page](https://console.cloud.google.com/google/maps-apis/studio/maps))
   3. Click **"Create Map Style"** or use an existing style
   4. After creating a style, you'll get a **Map ID** (looks like: `1234567890abcdef`)
   5. Alternatively, you can use the default Map ID by going to **Maps** → **Map Management** → **Map IDs**
   6. Copy the Map ID and add it to your `.env.local` file:
      ```
      NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="your-map-id-here"
      ```
   7. If you don't have a Map ID, the app will use `DEMO_MAP_ID` for testing (limited functionality)

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed with sample data
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Synagogues

- `GET /api/synagogues` - Search synagogues with filters
- `POST /api/synagogues` - Create new synagogue
- `GET /api/synagogues/[id]` - Get synagogue details
- `PUT /api/synagogues/[id]` - Update synagogue
- `DELETE /api/synagogues/[id]` - Delete synagogue

### Minyan Reports

- `GET /api/minyan-reports` - Get recent minyan reports
- `POST /api/minyan-reports` - Create new minyan report
- `PUT /api/minyan-reports/[id]/verify` - Verify a minyan report

### Prayer Times

- `GET /api/prayer-times` - Get prayer times for a location

## Database Schema

The application uses the following main entities:

- **Users**: Authentication and community trust scores
- **Synagogues**: Core location data with accessibility features
- **PrayerSchedule**: Regular prayer times for each synagogue
- **MinyanReport**: Real-time community reports
- **Reviews**: User reviews and ratings
- **SynagoguePhoto**: Photo gallery

## Features in Detail

### 🗺️ Map Integration

- Google Maps with custom synagogue markers
- Real-time location detection
- Interactive synagogue selection

### 🔍 Search & Filtering

- Location-based search
- Filter by nusach (Ashkenaz, Sephard, Chabad, etc.)
- Filter by prayer type (Shacharit, Mincha, Maariv)
- Accessibility filters (wheelchair access, parking, etc.)

### 👥 Community Reporting

- GPS-verified minyan reports
- Real-time status updates
- Community verification system
- Trust score system

### ⏰ Prayer Times

- Integration with MyZmanim and Hebcal APIs
- Automatic calculation based on location
- Daily prayer schedules

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- AWS (using Vercel or custom setup)
- Google Cloud Platform
- DigitalOcean App Platform
- Railway
- Render

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Phase 1 (MVP) ✅

- [x] Basic synagogue search and map
- [x] Minyan reporting system
- [x] Prayer times integration
- [x] Responsive UI

### Phase 2 (Planned)

- [ ] User authentication
- [ ] Synagogue profiles and ratings
- [ ] Push notifications
- [ ] Mobile PWA

### Phase 3 (Future)

- [ ] Create-your-own minyan feature
- [ ] Calendar integration
- [ ] API for third-party apps
- [ ] Multi-language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@minyannow.com or join our community discussions.

## Acknowledgments

- MyZmanim for accurate prayer time calculations
- Hebcal for Hebrew calendar and prayer time APIs
- Google Maps for location services
- The Jewish community for inspiration and feedback
