import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Chip,
  Collapse,
  Button,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Delete,
  History,
  ExpandMore,
  ExpandLess,
  Clear,
  Undo,
  LocationOn
} from '@mui/icons-material';
import type { SearchHistoryItem } from '@Types/weather';

interface SearchHistoryProps {
  searchHistory: SearchHistoryItem[];
  removedItems: SearchHistoryItem[];
  onItemClick: (item: SearchHistoryItem) => void;
  onItemRemove: (itemId: string) => void;
  onItemRestore: (itemId: string) => void;
  onClearHistory: () => void;
}

export function SearchHistory({
  searchHistory,
  removedItems,
  onItemClick,
  onItemRemove,
  onItemRestore,
  onClearHistory
}: SearchHistoryProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [showRemoved, setShowRemoved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastRemovedItem, setLastRemovedItem] = useState<SearchHistoryItem | null>(null);

  const handleItemRemove = (item: SearchHistoryItem) => {
    setLastRemovedItem(item);
    setSnackbarOpen(true);
    onItemRemove(item.id);
  };

  const handleUndo = () => {
    if (lastRemovedItem) {
      onItemRestore(lastRemovedItem.id);
      setLastRemovedItem(null);
      setSnackbarOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setLastRemovedItem(null);
  };

  const formatRelativeTime = (date: Date) => {
    try {
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return t('history.timeAgo.justNow');
      if (diffInHours < 24) return t('history.timeAgo.hoursAgo', { count: diffInHours });
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return t('history.timeAgo.daysAgo', { count: diffInDays });
      
      return date.toLocaleDateString();
    } catch {
      return t('history.timeAgo.recently');
    }
  };

  if (searchHistory.length === 0 && removedItems.length === 0) {
    return (
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <History sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t('history.noHistory')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('history.noHistorySubtitle')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ pb: 1 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History color="primary" />
              <Typography variant="h6" component="h2">
                {t('history.title')}
              </Typography>
              <Chip
                label={searchHistory.length}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {removedItems.length > 0 && (
                <Button
                  size="small"
                  startIcon={<Undo />}
                  onClick={() => setShowRemoved(!showRemoved)}
                  sx={{ textTransform: 'none' }}
                >
                  {t('history.recentlyRemoved')} ({removedItems.length})
                </Button>
              )}
              
              {searchHistory.length > 0 && (
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={onClearHistory}
                  color="error"
                  sx={{ textTransform: 'none' }}
                >
                  {t('history.clearAll')}
                </Button>
              )}
              
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? t('history.collapse') : t('history.expand')}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expanded}>
            {/* Search History List */}
            {searchHistory.length > 0 ? (
              <List disablePadding>
                {searchHistory.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => onItemClick(item)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" component="span">
                                {item.cityName}
                              </Typography>
                              {(item.region || item.country) && (
                                <Chip
                                  label={item.region && item.region !== item.cityName ? `${item.region}, ${item.country}` : item.country}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.75rem' }}
                                />
                              )}
                              {item.weatherData && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="span"
                                  sx={{ ml: 1 }}
                                >
                                  {Math.round(item.weatherData.current.temp_c)}°C
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={formatRelativeTime(item.searchDate)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemRemove(item);
                            }}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    </ListItem>
                    {index < searchHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                {t('history.noItems')}
              </Typography>
            )}

            {/* Recently Removed Items */}
            {showRemoved && removedItems.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('history.recentlyRemoved')}
                </Typography>
                <List disablePadding>
                  {removedItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton
                        onClick={() => onItemRestore(item.id)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: 'action.hover',
                          '&:hover': {
                            backgroundColor: 'action.selected'
                          }
                        }}
                      >
                        <Undo sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                            >
                              {item.cityName}
                            </Typography>
                          }
                          secondary={t('history.clickToRestore')}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Collapse>
        </CardContent>
      </Card>

      {/* Undo Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleUndo}>
              {t('history.undo')}
            </Button>
          }
        >
          {t('history.removedFromHistory', { cityName: lastRemovedItem?.cityName })}
        </Alert>
      </Snackbar>
    </>
  );
}
