import type { SxProps, Theme } from '@mui/material/styles';

export const sunTimesStyles = {
  container: {
    display: 'contents'
  } as SxProps<Theme>,

  detailItemBox: {
    textAlign: 'center'
  } as SxProps<Theme>,

  detailIcon: {
    fontSize: 24,
    mb: 1,
    color: 'text.secondary'
  } as SxProps<Theme>,

  detailLabel: {
    color: 'text.secondary'
  } as SxProps<Theme>,

  detailValue: {
    fontWeight: 600
  } as SxProps<Theme>
};
