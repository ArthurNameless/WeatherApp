
import { useTranslation } from 'react-i18next';
import {
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import type { SearchHistoryItem } from '@Types/weather';
import { searchHistoryStyles } from '../SearchHistory.styles';

interface UndoSnackbarProps {
  open: boolean;
  lastRemovedItem: SearchHistoryItem | null;
  onClose: () => void;
  onUndo: () => void;
}

export function UndoSnackbar({
  open,
  lastRemovedItem,
  onClose,
  onUndo
}: UndoSnackbarProps) {
  const { t } = useTranslation();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={searchHistoryStyles.snackbarAnchor}
    >
      <Alert
        onClose={onClose}
        severity="info"
        action={
          <Button color="inherit" size="small" onClick={onUndo}>
            {t('history.undo')}
          </Button>
        }
      >
        {t('history.removedFromHistory', { cityName: lastRemovedItem?.cityName })}
      </Alert>
    </Snackbar>
  );
}
