export type CardValidityInfo = {
  dateRange?: {
    upper: string;
    lower: string;
  };
  durationYears: number;
  durationMonths: number;
  durationDays: number;
  startDateMethod: number;
};

export type CardContent = {
  id: number;
  title: string;
  validityInfo: CardValidityInfo;
  price: number;
  credits: number;
  tax?: number;
  onClickDetails: () => void;
  onAddToCart: () => void;
};

export type PassRestrictionFrequency = 'daily' | 'weekly' | 'monthly';

export type PassRestriction = {
  frequency: PassRestrictionFrequency;
  amount: number;
};

export type DailyTimeSlots = {
  dayOfWeek: number;
  slots: Array<{
    from: string;
    to: string;
  }>;
};
