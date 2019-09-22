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
