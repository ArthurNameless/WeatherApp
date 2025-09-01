# Weather Forecast Application

A modern, responsive weather forecast application built with React, TypeScript, and Material-UI. Get current weather information for any city worldwide with an intuitive interface and comprehensive search history.

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

### Material-UI Theme

The application uses a custom Material-UI theme with:
- Dark and light mode support
- Consistent color palette
- Responsive breakpoints
- Custom component overrides

## 🙏 Acknowledgments

- [WeatherAPI.com](https://www.weatherapi.com/) for the weather API
- [Material-UI](https://mui.com/) for the component library
- [Vite](https://vitejs.dev/) for the build tool
- [Vitest](https://vitest.dev/) for the testing framework
