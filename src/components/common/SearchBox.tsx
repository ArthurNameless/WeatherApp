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
import { Search as SearchIcon, MyLocation as LocationIcon } from '@mui/icons-material';

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
  placeholder,
  disabled = false
}: SearchBoxProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const defaultPlaceholder = placeholder || t('search.placeholder');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setLocalError(null);
    
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
            {loading ? <CircularProgress size={20} color="inherit" /> : t('search.button')}
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
              {t('search.myLocation')}
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
