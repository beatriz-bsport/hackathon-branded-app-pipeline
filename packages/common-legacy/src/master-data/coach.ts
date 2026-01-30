import { MarketPlaceCoachDisplay } from './personalization';

export const getCoachDisplayName = (
  coachDisplayOption?: MarketPlaceCoachDisplay,
  coachName?: string,
  coachFirstName?: string,
) => {
  if (!coachDisplayOption || (!coachName && !coachFirstName)) return null;

  const isOnlyFirstNameDisplayed = [
    MarketPlaceCoachDisplay.FIRST_NAME_WITH_PICTURE,
    MarketPlaceCoachDisplay.ONLY_FIRST_NAME,
  ].includes(coachDisplayOption);

  if (isOnlyFirstNameDisplayed) {
    return coachFirstName;
  }
  return coachName;
};

export const getCoachDisplayPicture = (
  coachDisplayOption: MarketPlaceCoachDisplay,
  coachPicture: string,
) => {
  if (!coachPicture) return '';

  const hidePicture = [
    MarketPlaceCoachDisplay.ONLY_FIRST_NAME,
    MarketPlaceCoachDisplay.FULL_NAME_WITHOUT_PICTURE,
  ].includes(coachDisplayOption);

  if (hidePicture) {
    return '';
  }
  return coachPicture;
};
