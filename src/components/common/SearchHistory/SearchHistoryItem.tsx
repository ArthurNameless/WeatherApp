

import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Chip,
  Typography
} from '@mui/material';
import {
  Delete,
  LocationOn
} from '@mui/icons-material';

import type { SearchHistoryItem } from '@Types/weather';
import { searchHistoryStyles } from '../SearchHistory.styles';

interface SearchHistoryItemProps {
  item: SearchHistoryItem;
  onItemClick: (item: SearchHistoryItem) => void;
  onItemRemove: (item: SearchHistoryItem) => void;
  formatRelativeTime: (date: Date) => string;
}

export function SearchHistoryItemComponent({
  item,
  onItemClick,
  onItemRemove,
  formatRelativeTime
}: SearchHistoryItemProps) {


  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onItemClick(item)}
        sx={searchHistoryStyles.listItemButton}
      >
        <LocationOn sx={searchHistoryStyles.locationIcon} />
        <ListItemText
          primary={
            <Box sx={searchHistoryStyles.primaryTextContainer}>
              <Typography variant="subtitle1" component="span">
                {item.cityName}
              </Typography>
              {(item.region || item.country) && (
                <Chip
                  label={item.region && item.region !== item.cityName ? `${item.region}, ${item.country}` : item.country}
                  size="small"
                  variant="outlined"
                  sx={searchHistoryStyles.regionChip}
                />
              )}
              {item.weatherData && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  sx={searchHistoryStyles.temperatureText}
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
              onItemRemove(item);
            }}
            size="small"
          >
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
}
