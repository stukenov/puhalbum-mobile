# PuhAlbum Mobile App

Mobile application for uploading and validating images, built with React Native and Expo.

## Technologies

- **React Native** - Framework for building native applications
- **Expo** - Platform for developing and deploying React Native apps
- **expo-image-picker** - Image selection from gallery
- **AsyncStorage** - User data storage
- **Axios** - HTTP client for API communication

## Project Structure

```
puhalbum-mobile/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── PhotoSelector.jsx
│   │   └── FileList.jsx
│   ├── screens/          # App screens
│   │   └── HomeScreen.jsx
│   ├── services/         # Services for API and storage
│   │   ├── api.js
│   │   └── storage.js
│   ├── constants/        # Constants and configuration
│   │   ├── config.js
│   │   └── theme.js
│   └── utils/            # Helper functions
│       └── format.js
├── App.js                # Application entry point
├── app.config.js         # Expo configuration
└── .env.example          # Environment variables example
```

## Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with API settings:
```bash
cp .env.example .env
# Edit .env and set your API_URL
```

3. Run the application:

**For iOS (requires macOS):**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

**For Web:**
```bash
npm run web
```

**Development Mode (Expo Go):**
```bash
npm start
```

## Features

- Multiple image selection from gallery
- File upload to server with progress display
- View list of uploaded files
- Validation status display for each file
- Automatic file list refresh every 5 seconds
- Pull-to-refresh for manual updates
- User management via AsyncStorage

## Production Build

**Android APK:**
```bash
eas build --platform android --profile preview
```

**iOS (requires Apple Developer account):**
```bash
eas build --platform ios --profile preview
```

## API

The application works with REST API endpoints:

- `POST /api/user/create` - Create a new user
- `POST /api/upload/:userId` - Upload a file
- `GET /api/files/:userId` - Get user's file list
- `GET /api/file/:userId/:filename` - Get a file

## License

MIT License - see LICENSE file for details

## Author

Saken Tukenov

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
