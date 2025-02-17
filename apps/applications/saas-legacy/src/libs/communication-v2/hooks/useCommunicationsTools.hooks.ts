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
  return { theme };
};

export const useSMSVerification = () => {
  const smsVerificationProvider = useSelector(
    getCommunicationSMSProviderVerificationState,
  );
  return { smsVerificationProvider };
};
