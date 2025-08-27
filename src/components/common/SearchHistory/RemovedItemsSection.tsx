
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { Undo } from '@mui/icons-material';
import type { SearchHistoryItem } from '@Types/weather';
import { searchHistoryStyles } from '../SearchHistory.styles';

interface RemovedItemsSectionProps {
  removedItems: SearchHistoryItem[];
  onItemRestore: (itemId: string) => void;
}

export function RemovedItemsSection({
  removedItems,
  onItemRestore
}: RemovedItemsSectionProps) {
  const { t } = useTranslation();

  if (removedItems.length === 0) {
    return null;
  }

  return (
    <>
      <Divider sx={searchHistoryStyles.divider} />
      <Typography variant="subtitle2" color="text.secondary" sx={searchHistoryStyles.recentlyRemovedTitle}>
        {t('history.recentlyRemoved')}
      </Typography>
      <List disablePadding>
        {removedItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => onItemRestore(item.id)}
              sx={searchHistoryStyles.removedItemButton}
            >
              <Undo sx={searchHistoryStyles.removedItemIcon} />
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={searchHistoryStyles.removedItemText}
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
  );
}
