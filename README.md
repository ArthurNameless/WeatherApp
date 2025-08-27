# Weather Forecast Application

A modern, responsive weather forecast application built with React, TypeScript, and Material-UI. Get current weather information for any city worldwide with an intuitive interface and comprehensive search history.

![Weather App Demo](https://via.placeholder.com/800x400/1976d2/ffffff?text=Weather+Forecast+App)

## 🌟 Features

### Core Functionality
- **City Weather Search**: Search for current weather by city name
- **Location-Based Weather**: Get weather for your current location using geolocation
- **Comprehensive Weather Data**: Display temperature, weather description, min/max temps, wind speed, humidity, pressure, visibility, sunrise/sunset
- **Search History**: Automatic history tracking with local storage persistence
- **History Management**: Click history items to re-search, remove unwanted items
- **Undo Functionality**: Restore recently removed search items

### User Experience
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Input validation with helpful error messages
- **Loading States**: Clear feedback during API requests
- **Error Handling**: Comprehensive error messages for various failure scenarios
- **Accessibility**: ARIA labels and keyboard navigation support

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks-based architecture with functional components
- **Material-UI**: Professional, accessible UI components
- **Local Storage**: Persistent search history across sessions
- **Debounced Search**: Optimized API calls to prevent excessive requests
- **Production Ready**: Comprehensive error handling and edge case management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- WeatherAPI.com API key (free at [weatherapi.com](https://www.weatherapi.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your WeatherAPI.com API key:
   ```
   VITE_WEATHER_API_KEY=your_weatherapi_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting an API Key

1. Visit [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key
4. Copy the API key
5. Add it to your `.env` file

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable components
│   │   ├── SearchBox.tsx
│   │   └── SearchHistory.tsx
│   └── weather/         # Weather-specific components
│       └── WeatherCard.tsx
├── hooks/               # Custom React hooks
│   ├── useWeather.ts
│   └── useSearchHistory.ts
├── services/            # API and external services
│   └── weatherApi.ts
├── types/               # TypeScript type definitions
│   └── weather.ts
├── utils/               # Utility functions
│   └── localStorage.ts
├── __tests__/           # Test files
│   ├── components/
│   ├── services/
│   └── utils/
└── App.tsx              # Main application component
```

### Architecture Principles

#### SOLID Principles Applied

1. **Single Responsibility Principle**
   - Each component has a single, well-defined purpose
   - Services handle only their specific domain (API, storage, etc.)

2. **Open/Closed Principle**
   - Components are open for extension but closed for modification
   - Easy to add new weather providers or storage mechanisms

3. **Liskov Substitution Principle**
   - All components implement consistent interfaces
   - Weather data sources are interchangeable

4. **Interface Segregation Principle**
   - Interfaces are specific to client needs
   - No forced dependencies on unused methods

5. **Dependency Inversion Principle**
   - High-level modules don't depend on low-level modules
   - Dependencies are injected via props and hooks

#### Design Patterns

- **Custom Hooks Pattern**: Encapsulate stateful logic in reusable hooks
- **Service Layer Pattern**: Separate API logic from UI components
- **Observer Pattern**: React state management with hooks
- **Strategy Pattern**: Pluggable weather data providers
- **Factory Pattern**: Error handling and data transformation

## 🧪 Testing

### Testing Strategy

The application follows Test-Driven Development (TDD) principles with comprehensive test coverage:

- **Unit Tests**: Individual functions and components
- **Integration Tests**: Component interactions and data flow
- **Error Handling Tests**: Edge cases and failure scenarios
- **Accessibility Tests**: ARIA attributes and keyboard navigation

### Test Coverage Goals

- Components: 95%+ coverage
- Services: 100% coverage
- Utilities: 100% coverage
- Error Handling: All error paths covered

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files

- `src/__tests__/components/` - Component tests
- `src/__tests__/services/` - API service tests
- `src/__tests__/utils/` - Utility function tests
- `src/__tests__/setup.ts` - Test configuration

## 🎨 Styling and Theming

### Material-UI Theme

The application uses a custom Material-UI theme with:
- Dark and light mode support
- Consistent color palette
- Responsive breakpoints
- Custom component overrides

### Design Tokens

```typescript
// Primary colors
light: '#1976d2'
dark: '#90caf9'

// Background gradients
lightBackground: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
darkBackground: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
```

### Responsive Design

- Mobile-first approach
- Flexbox layouts
- Adaptive component sizing
- Touch-friendly interactions

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deployment Options

#### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist` folder contents to web server
3. Configure web server for SPA routing

### Environment Variables for Production

Ensure these are set in your deployment environment:
- `VITE_WEATHER_API_KEY`: Your WeatherAPI.com API key

## 🔧 Configuration

### API Configuration

The weather service is configured in `src/services/weatherApi.ts`:

```typescript
const config = {
  apiKey: import.meta.env.VITE_WEATHER_API_KEY,
  baseUrl: 'https://api.weatherapi.com/v1',
  units: 'celsius' // or 'fahrenheit'
};
```

### Local Storage Configuration

Search history is managed in `src/utils/localStorage.ts`:

```typescript
const STORAGE_KEYS = {
  SEARCH_HISTORY: 'weather-app-search-history',
  REMOVED_ITEMS: 'weather-app-removed-items'
};

const MAX_HISTORY_ITEMS = 10;
const MAX_REMOVED_ITEMS = 5;
```

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Ensure 95%+ test coverage for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WeatherAPI.com](https://www.weatherapi.com/) for the weather API
- [Material-UI](https://mui.com/) for the component library
- [Vite](https://vitejs.dev/) for the build tool
- [Vitest](https://vitest.dev/) for the testing framework

## 📞 Support

If you have any questions or issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ and modern web technologies