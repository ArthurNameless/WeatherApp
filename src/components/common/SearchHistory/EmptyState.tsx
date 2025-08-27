
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { History } from '@mui/icons-material';
import { searchHistoryStyles } from '../SearchHistory.styles';

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <Card elevation={1} sx={searchHistoryStyles.emptyStateCard}>
      <CardContent sx={searchHistoryStyles.emptyStateContent}>
        <History sx={searchHistoryStyles.emptyStateIcon} />
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
