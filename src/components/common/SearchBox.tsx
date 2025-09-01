import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { searchBoxStyles } from './SearchBox.styles';

interface SearchBoxProps {
  onSearch: (cityName: string) => void;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  onErrorClear?: () => void;
}

export function SearchBox({
  onSearch,
  loading = false,
  error = null,
  placeholder,
  disabled = false,
  onErrorClear
}: SearchBoxProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const defaultPlaceholder = placeholder || t('search.placeholder');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setLocalError(null);
    
    // Clear API error when user starts typing
    if (error && onErrorClear) {
      onErrorClear();
    }
    
    // Validate input
    if (value.length > 0 && value.length < 2) {
      setLocalError(t('search.errors.minLength'));
      return;
    }
    
    if (value.length > 50) {
      setLocalError(t('search.errors.maxLength'));
      return;
    }
    
    // Check for invalid characters
    const invalidChars = /[^a-zA-Z\s\-',]/;
    if (invalidChars.test(value)) {
      setLocalError(t('search.errors.invalidCharacters'));
      return;
    }
    
    // Clear any previous error
    setLocalError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!searchValue.trim()) {
      setLocalError(t('search.errors.enterCity'));
      return;
    }
    
    if (localError) {
      return;
    }
    
    onSearch(searchValue.trim());
  };

  const displayError = error || localError;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={searchBoxStyles.formContainer}>
      <Box sx={searchBoxStyles.mainContainer}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={defaultPlaceholder}
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
          sx={searchBoxStyles.textField}
        />
        
        <Box sx={searchBoxStyles.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || loading || !!localError || !searchValue.trim()}
            sx={searchBoxStyles.searchButton}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : t('search.button')}
          </Button>
        </Box>
      </Box>
      
      {/* Additional error display for API errors */}
      {error && !localError && (
        <Alert 
          severity="error" 
          sx={searchBoxStyles.errorAlert}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
