// @flow
import { API_V1_URI, postAuth, getAuth } from '../../http.ts';

export const findMemberFromFace = async (blob: Blob) => {
  const data = new FormData();
  data.append('photo', blob);
  return postAuth(
    `${API_V1_URI}/face_recognition/face_collection/match_face/`,
    data,
  );
};

export const checkFaceIDAvailable = async () => {
  return getAuth(
    `${API_V1_URI}/face_recognition/face_collection/feature_enabled/`,
  );
};
