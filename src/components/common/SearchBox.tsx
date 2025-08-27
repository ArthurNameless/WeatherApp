import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon, MyLocation as LocationIcon } from '@mui/icons-material';
// import { debounce } from 'lodash'; // For future use

interface SearchBoxProps {
  onSearch: (cityName: string) => void;
  onLocationSearch?: () => void;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchBox({
  onSearch,
  onLocationSearch,
  loading = false,
  error = null,
  placeholder = "Enter city name...",
  disabled = false
}: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setLocalError(null);
    
    // Validate input
    if (value.length > 0 && value.length < 2) {
      setLocalError('City name must be at least 2 characters long');
      return;
    }
    
    if (value.length > 50) {
      setLocalError('City name is too long');
      return;
    }
    
    // Check for invalid characters
    const invalidChars = /[^a-zA-Z\s\-',]/;
    if (invalidChars.test(value)) {
      setLocalError('City name contains invalid characters');
      return;
    }
    
    // Clear any previous error
    setLocalError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!searchValue.trim()) {
      setLocalError('Please enter a city name');
      return;
    }
    
    if (localError) {
      return;
    }
    
    onSearch(searchValue.trim());
  };

  const handleLocationSearch = () => {
    if (onLocationSearch) {
      onLocationSearch();
    }
  };

  const displayError = error || localError;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          disabled={disabled || loading}
          error={!!displayError}
          helperText={displayError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color={displayError ? 'error' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main'
              }
            }
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexDirection: { xs: 'row', sm: 'column' },
            minWidth: { sm: 'auto' }
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || loading || !!localError || !searchValue.trim()}
            sx={{
              minWidth: { xs: '120px', sm: '100px' },
              height: '56px',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
          </Button>
          
          {onLocationSearch && (
            <Button
              variant="outlined"
              onClick={handleLocationSearch}
              disabled={disabled || loading}
              startIcon={<LocationIcon />}
              sx={{
                minWidth: { xs: '120px', sm: '100px' },
                height: '56px',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              My Location
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Additional error display for API errors */}
      {error && !localError && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
