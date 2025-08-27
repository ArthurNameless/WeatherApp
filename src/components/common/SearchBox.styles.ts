import type { SxProps, Theme } from '@mui/material/styles';

export const searchBoxStyles = {
  formContainer: {
    width: '100%'
  } as SxProps<Theme>,

  mainContainer: {
    display: 'flex',
    gap: 1,
    alignItems: 'flex-start',
    flexDirection: { xs: 'column', sm: 'row' }
  } as SxProps<Theme>,

  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main'
      }
    }
  } as SxProps<Theme>,

  buttonContainer: {
    display: 'flex',
    gap: 1,
    flexDirection: { xs: 'row', sm: 'column' },
    minWidth: { sm: 'auto' }
  } as SxProps<Theme>,

  searchButton: {
    minWidth: { xs: '120px', sm: '100px' },
    height: '56px',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  } as SxProps<Theme>,

  locationButton: {
    minWidth: { xs: '120px', sm: '100px' },
    height: '56px',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  } as SxProps<Theme>,

  errorAlert: {
    mt: 2,
    borderRadius: 2
  } as SxProps<Theme>
};
