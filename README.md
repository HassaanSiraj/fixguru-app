# FixGuru App

React frontend for FixGuru - A professional services marketplace for Pakistan.

## Features

- Modern, responsive UI with Tailwind CSS
- User authentication (Login/Register)
- Job posting and browsing
- Bidding system
- Real-time messaging
- Provider profile management
- Subscription management
- Admin dashboard

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Heroicons

## Setup

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/          # Page components
  ├── context/        # React context (Auth)
  ├── config/         # Configuration files
  └── App.jsx         # Main app component
```

## Features Overview

### For Service Seekers
- Post jobs with descriptions and images
- Browse and filter available jobs
- Review bids from providers
- Accept bids and chat with providers

### For Service Providers
- Complete provider profile with verification
- Browse open jobs
- Submit bids on jobs
- Manage subscriptions
- Chat with job posters

### For Admins
- Approve/reject provider profiles
- Manage payments
- View platform statistics

## License

MIT
