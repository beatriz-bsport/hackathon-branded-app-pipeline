export type VideoFormat = "ebook" | "video" | "none";

export type VideoMemberAvailability = "available" | "unavailable";

export type VideoAccessType = "limited" | "unlimited";

export type VideoRowData = {
  id: number;
  name: string;
  thumbnailUrl?: string;
  categoryLabel?: string;
  format: VideoFormat;
  memberAvailability: VideoMemberAvailability;
  accessType: VideoAccessType;
  onRowClick?: () => void;
};
