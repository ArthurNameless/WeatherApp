
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import { SearchBox } from '@Components/common/SearchBox';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('SearchBox', () => {
  const mockOnSearch = vi.fn();
  const mockOnLocationSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnLocationSearch.mockClear();
  });

  it('renders correctly with default props', () => {
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, 'London');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('shows validation error for short input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    
    await user.type(input, 'L');
    
    await waitFor(() => {
      expect(screen.getByText('City name must be at least 2 characters long')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid characters', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    
    await user.type(input, 'London123');
    
    await waitFor(() => {
      expect(screen.getByText('City name contains invalid characters')).toBeInTheDocument();
    });
  });

  it('disables submit button when loading', () => {
    renderWithTheme(<SearchBox onSearch={mockOnSearch} loading={true} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it('shows error message when provided', () => {
    const errorMessage = 'API Error';
    renderWithTheme(<SearchBox onSearch={mockOnSearch} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders location button when onLocationSearch is provided', () => {
    renderWithTheme(
      <SearchBox 
        onSearch={mockOnSearch} 
        onLocationSearch={mockOnLocationSearch} 
      />
    );
    
    expect(screen.getByRole('button', { name: /my location/i })).toBeInTheDocument();
  });

  it('calls onLocationSearch when location button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SearchBox 
        onSearch={mockOnSearch} 
        onLocationSearch={mockOnLocationSearch} 
      />
    );
    
    const locationButton = screen.getByRole('button', { name: /my location/i });
    await user.click(locationButton);
    
    expect(mockOnLocationSearch).toHaveBeenCalled();
  });

  it('trims whitespace from search input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Enter city name...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '  London  ');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('prevents submission with empty input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchBox onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.click(searchButton);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a city name')).toBeInTheDocument();
  });
});
