
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { SearchBox } from '@Components/common/SearchBox';

// Create a test i18n instance
const testI18n = i18n.createInstance();
testI18n.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        'search.placeholder': 'Enter city name...',
        'search.button': 'Search',
        'search.errors.minLength': 'City name must be at least 2 characters long',
        'search.errors.maxLength': 'City name is too long',
        'search.errors.invalidCharacters': 'City name contains invalid characters',
        'search.errors.enterCity': 'Please enter a city name'
      }
    }
  }
});

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={testI18n}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </I18nextProvider>
  );
};

describe('SearchBox', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders correctly with default props', () => {
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, 'London');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('shows validation error for short input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    
    await user.type(input, 'L');
    
    await waitFor(() => {
      expect(screen.getByText('City name must be at least 2 characters long')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    
    await user.type(input, 'London123');
    
    await waitFor(() => {
      expect(screen.getByText('City name contains invalid characters')).toBeInTheDocument();
    });
  });

  it('disables submit button when loading', () => {
    renderWithProviders(<SearchBox onSearch={mockOnSearch} loading={true} />);
    
    const searchButton = screen.getByRole('button', { type: 'submit' });
    expect(searchButton).toBeDisabled();
  });

  it('shows error message when provided', () => {
    const errorMessage = 'API Error';
    renderWithProviders(<SearchBox onSearch={mockOnSearch} error={errorMessage} />);
    
    expect(screen.getAllByText(errorMessage)).toHaveLength(2); // Helper text and Alert both show the error
  });



  it('trims whitespace from search input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '  London  ');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('prevents submission with empty input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBox onSearch={mockOnSearch} />);
    
    // Try to click the submit button (which should be disabled) or submit the form
    const form = screen.getByRole('button', { type: 'submit' }).closest('form');
    expect(form).toBeInTheDocument();
    
    // Fire submit event directly on the form without typing anything
    if (form) {
      // Use fireEvent to submit the form
      const { fireEvent } = await import('@testing-library/react');
      fireEvent.submit(form);
    }
    
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Please enter a city name')).toBeInTheDocument();
    });
  });
});
