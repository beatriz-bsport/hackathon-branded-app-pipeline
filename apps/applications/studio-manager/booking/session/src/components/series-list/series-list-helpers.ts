import type { Series } from "#src/types";

export {
  getSeriesBookingRule,
  type SeriesBookingRule,
} from "#src/utils/series-booking-rule";

type SeriesDateBounds = {
  firstDate: string | null;
  lastDate: string | null;
};

export const getSeriesDateBounds = (
  series: Pick<Series, "first_offer_date" | "last_offer_date">,
): SeriesDateBounds => ({
  firstDate: series.first_offer_date || null,
  lastDate: series.last_offer_date || null,
});
