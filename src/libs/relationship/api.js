// @flow
import {
  buildUrlParams,
  API_V1_URI,
  getAuth,
  patchAuth,
  postAuth,
} from '../../http';

export async function fetchMemberRelations(memberId: number) {
  return getAuth(`${API_V1_URI}/member/${memberId}/relations/`);
}

export async function createRelation(data: *) {
  return postAuth(`${API_V1_URI}/relationship/member/`, data);
}

export async function updateRelation(relationId: number, data: *) {
  return patchAuth(`${API_V1_URI}/relationship/member/${relationId}/`, data);
}

export async function fetchSharedConsumerPaymentPacks(params: any) {
  return getAuth(
    `${API_V1_URI}/relationship/consumer_payment_pack/${buildUrlParams(
      params,
    )}`,
  );
}

export async function createConsumerPassLink(
  consumerPackId: number,
  memberRelationId: number,
) {
  return postAuth(
    `${API_V1_URI}/relationship/member/${memberRelationId}/link_pass/`,
    {
      consumer_payment_pack: consumerPackId,
    },
  );
}

export async function unlinkConsumerPassLink(consumerPassLinkId: number) {
  return postAuth(
    `${API_V1_URI}/relationship/consumer_payment_pack/${consumerPassLinkId}/unlink/`,
  );
}

export async function relinkConsumerPassLink(consumerPassLinkId: number) {
  return postAuth(
    `${API_V1_URI}/relationship/consumer_payment_pack/${consumerPassLinkId}/relink/`,
  );
}

export async function createPrivateConsumerPassLink(
  privateConsumerPassId: number,
  memberRelationId: number,
) {
  return postAuth(
    `${API_V1_URI}/relationship/member/${memberRelationId}/link_private_pass/`,
    {
      private_consumer_pass: privateConsumerPassId,
    },
  );
}

export async function fetchSharedPrivateConsumerPasses(params: any) {
  return getAuth(
    `${API_V1_URI}/relationship/private_consumer_pass/${buildUrlParams(
      params,
    )}`,
  );
}

export async function unlinkPrivateConsumerPassLink(
  privateConsumerPassLinkId: number,
) {
  return postAuth(
    `${API_V1_URI}/relationship/private_consumer_pass/${privateConsumerPassLinkId}/unlink/`,
  );
}

export async function relinkPrivateConsumerPassLink(
  privateConsumerPassLinkId: number,
) {
  return postAuth(
    `${API_V1_URI}/relationship/private_consumer_pass/${privateConsumerPassLinkId}/relink/`,
  );
}
