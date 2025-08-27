import type { SxProps, Theme } from '@mui/material/styles';

export const searchHistoryStyles = {
  // Empty state styles
  emptyStateCard: {
    borderRadius: 2
  } as SxProps<Theme>,

  emptyStateContent: {
    textAlign: 'center',
    py: 4
  } as SxProps<Theme>,

  emptyStateIcon: {
    fontSize: 48,
    color: 'text.secondary',
    mb: 2
  } as SxProps<Theme>,

  // Main card styles
  mainCard: {
    borderRadius: 2
  } as SxProps<Theme>,

  cardContent: {
    pb: 1
  } as SxProps<Theme>,

  // Header styles
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 1
  } as SxProps<Theme>,

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  } as SxProps<Theme>,

  buttonContainer: {
    display: 'flex',
    gap: 1
  } as SxProps<Theme>,

  actionButton: {
    textTransform: 'none'
  } as SxProps<Theme>,

  // List item styles
  listItemButton: {
    borderRadius: 1,
    mb: 0.5,
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  } as SxProps<Theme>,

  locationIcon: {
    mr: 2,
    color: 'text.secondary'
  } as SxProps<Theme>,

  primaryTextContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  } as SxProps<Theme>,

  regionChip: {
    height: 20,
    fontSize: '0.75rem'
  } as SxProps<Theme>,

  temperatureText: {
    ml: 1
  } as SxProps<Theme>,

  noItemsText: {
    textAlign: 'center',
    py: 2
  } as SxProps<Theme>,

  // Recently removed section styles
  divider: {
    my: 2
  } as SxProps<Theme>,

  recentlyRemovedTitle: {
    mb: 1
  } as SxProps<Theme>,

  removedItemButton: {
    borderRadius: 1,
    mb: 0.5,
    backgroundColor: 'action.hover',
    '&:hover': {
      backgroundColor: 'action.selected'
    }
  } as SxProps<Theme>,

  removedItemIcon: {
    mr: 2,
    color: 'text.secondary'
  } as SxProps<Theme>,

  removedItemText: {
    textDecoration: 'line-through',
    opacity: 0.7
  } as SxProps<Theme>,

  // Snackbar styles
  snackbarAnchor: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const
  }
};
