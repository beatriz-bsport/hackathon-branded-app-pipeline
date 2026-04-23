export type CollectionRowData = {
  id: number;
  className?: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videosCount: number;
  isPendingDeletion: boolean;
  onRowClick: (() => void) | undefined;
  onEdit: (() => void) | undefined;
  onDelete: (() => void) | undefined;
};
