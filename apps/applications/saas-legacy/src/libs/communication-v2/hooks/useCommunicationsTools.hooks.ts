import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList as fetchTagListAction,
} from '#src/libs/notification-rule/actions';

import { getCommunicationSMSProviderVerificationState } from '#src/libs/communication-v2/selectors';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#src/libs/notification-rule/selectors';
import themeSelectors from '#src/libs/theme/selectors';
import Config from '#src/config';
import { LINE_SPORTS_CLUB_ID } from '#src/constants';

export const useTagsAndCategories = () => {
  const dispatch = useDispatch();

  const resolvedGenericTags = useSelector(getResolvedGenericTags);
  const tagCategories = useSelector(getTagCategories);

  const fetchTags = useCallback(() => {
    dispatch(fetchResolvedGenericTagsAction());
    dispatch(fetchTagListAction());
  }, [dispatch]);

  return {
    resolvedGenericTags,
    tagCategories,
    fetchTags,
  };
};

export const useTheme = () => {
  const theme = useSelector(themeSelectors.getTheme);
  const communicationStartHour = theme.earliest_hour_to_send_communications;
  const communicationEndHour = theme.latest_hour_to_send_communications;
  const timezone = theme.timezone_name;
  const companyId = theme.company;

  const isAutoResendHidden =
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
    companyId !== LINE_SPORTS_CLUB_ID;

  return {
    theme,
    communicationStartHour,
    communicationEndHour,
    timezone,
    isAutoResendHidden,
  };
};

export const useSMSVerification = () => {
  const smsVerificationProvider = useSelector(
    getCommunicationSMSProviderVerificationState,
  );
  return { smsVerificationProvider };
};
