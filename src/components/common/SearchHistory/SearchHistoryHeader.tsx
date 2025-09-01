
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  History,
  ExpandMore,
  ExpandLess,
  Clear,
  Undo
} from '@mui/icons-material';

import { searchHistoryStyles } from '../SearchHistory.styles';

interface SearchHistoryHeaderProps {
  historyCount: number;
  removedItemsCount: number;
  expanded: boolean;

  onToggleExpanded: () => void;
  onToggleShowRemoved: () => void;
  onClearHistory: () => void;
}

export function SearchHistoryHeader({
  historyCount,
  removedItemsCount,
  expanded,
  onToggleExpanded,
  onToggleShowRemoved,
  onClearHistory
}: SearchHistoryHeaderProps) {
  const { t } = useTranslation();

  return (
    <Box sx={searchHistoryStyles.headerContainer}>
      <Box sx={searchHistoryStyles.titleContainer}>
        <History color="primary" />
        <Typography variant="h6" component="h2">
          {t('history.title')}
        </Typography>
        <Chip
          label={historyCount}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
      
      <Box sx={searchHistoryStyles.buttonContainer}>
        {removedItemsCount > 0 && (
          <Button
            size="small"
            startIcon={<Undo />}
            onClick={onToggleShowRemoved}
            sx={searchHistoryStyles.actionButton}
          >
            {t('history.recentlyRemoved')} ({removedItemsCount})
          </Button>
        )}
        
        {historyCount > 0 && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={onClearHistory}
            color="error"
            sx={searchHistoryStyles.actionButton}
          >
            {t('history.clearAll')}
          </Button>
        )}
        
        <IconButton
          size="small"
          onClick={onToggleExpanded}
          aria-label={expanded ? t('history.collapse') : t('history.expand')}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
    </Box>
  );
}
