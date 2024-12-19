import type {
  ConsumerPaymentPackLinkWithRelatedMemberNames,
  PrivateConsumerPassLink,
} from 'bsport-saas/src/libs/relationship/types';
import { createAction } from 'redux-actions';

export const fetchRelatedMembersNamesByConsumerPaymentPackLinksActions = {
  isLoading: createAction<boolean>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/ERROR',
  ),
  success: createAction<ConsumerPaymentPackLinkWithRelatedMemberNames>(
    'RELATIONSHIP/RELATED_MEMBER_BY_CONSUMER_PACK_LINK/SUCCESS',
  ),
};

export const fetchRelatedMembersNamesByPrivateConsumerPassLinksActions = {
  isLoading: createAction<boolean>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/ERROR',
  ),
  success: createAction<PrivateConsumerPassLink>(
    'RELATIONSHIP/RELATED_MEMBER_BY_PRIVATE_CONSUMER_PASS_LINK/SUCCESS',
  ),
};
