import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  List,
  Collapse,
  Divider
} from '@mui/material';
import type { SearchHistoryItem } from '@Types/weather';
import { searchHistoryStyles } from '../SearchHistory.styles';
import { EmptyState } from './EmptyState';
import { SearchHistoryHeader } from './SearchHistoryHeader';
import { SearchHistoryItemComponent } from './SearchHistoryItem';
import { RemovedItemsSection } from './RemovedItemsSection';
import { UndoSnackbar } from './UndoSnackbar';

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

  // Show empty state if no history and no removed items
  if (searchHistory.length === 0 && removedItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <Card elevation={1} sx={searchHistoryStyles.mainCard}>
        <CardContent sx={searchHistoryStyles.cardContent}>
          <SearchHistoryHeader
            historyCount={searchHistory.length}
            removedItemsCount={removedItems.length}
            expanded={expanded}
            onToggleExpanded={() => setExpanded(!expanded)}
            onToggleShowRemoved={() => setShowRemoved(!showRemoved)}
            onClearHistory={onClearHistory}
          />

          <Collapse in={expanded}>
            {/* Search History List */}
            {searchHistory.length > 0 ? (
              <List disablePadding>
                {searchHistory.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <SearchHistoryItemComponent
                      item={item}
                      onItemClick={onItemClick}
                      onItemRemove={handleItemRemove}
                      formatRelativeTime={formatRelativeTime}
                    />
                    {index < searchHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={searchHistoryStyles.noItemsText}
              >
                {t('history.noItems')}
              </Typography>
            )}

            {/* Recently Removed Items */}
            {showRemoved && (
              <RemovedItemsSection
                removedItems={removedItems}
                onItemRestore={onItemRestore}
              />
            )}
          </Collapse>
        </CardContent>
      </Card>

      <UndoSnackbar
        open={snackbarOpen}
        lastRemovedItem={lastRemovedItem}
        onClose={handleSnackbarClose}
        onUndo={handleUndo}
      />
    </>
  );
}
