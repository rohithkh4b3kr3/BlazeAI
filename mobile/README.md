# BlazeAI Mobile (React Native / Expo)

React Native app for BlazeAI tools. Uses the same Python backend API.

## Prerequisites

- Node.js 18+
- Expo Go app on your phone (for testing), or Android Studio / Xcode for emulators
- Backend running at `http://localhost:5000` (or set URL in `src/config.js`)

## Setup

```bash
cd mobile
npm install
```

## Configure API URL

Edit `src/config.js`:

- **Emulator/simulator:** `http://localhost:5000` or `http://10.0.2.2:5000` (Android emulator)
- **Physical device on same Wi‑Fi:** Use your computer’s LAN IP, e.g. `http://192.168.0.156:5000`

## Run

```bash
npm start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` for Android emulator / `i` for iOS simulator.

## Screens

- **Home** – list of all tools
- **Currency** – convert between 30+ currencies
- **Word count** – words, characters, lines
- **Password** – generate and copy
- **JSON formatter** – format / minify / copy
- **Unit converter** – length, weight, temperature
- **Plagiarism** – check text (backend + Hugging Face)
- **Image → PDF** – pick images, convert, share PDF
- **Image compress** – pick image, set quality, share
- **Remove background** – pick image, share PNG
- **PDF → Word** – pick PDF, convert, share DOCX

## Build (optional)

- **Development build:** `npx expo prebuild` then build with Xcode/Android Studio
- **EAS Build:** `npm i -g eas-cli` then `eas build`
