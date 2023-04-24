// @ts-nocheck
import { API_V1_URI, postAuth, getAuth, deleteAuth, putAuth } from '../../http';

export const fetchStripeReaders = async () => {
  return getAuth(`${API_V1_URI}/terminal/reader`);
};

export const createStripeReader = async (data: any) => {
  return postAuth(`${API_V1_URI}/terminal/reader`, data);
};

export const deleteStripeReader = async (readerId: string) => {
  return deleteAuth(`${API_V1_URI}/terminal/reader`, { reader_id: readerId });
};

export const editStripeReader = async (readerId: string, label: string) => {
  return putAuth(`${API_V1_URI}/terminal/reader`, {
    reader_id: readerId,
    label,
  });
};

export const fetchConnectionToken = async () => {
  return postAuth(`${API_V1_URI}/terminal/connection_token`);
};

export const capturePaymentIntent = async (data: {
  payment_intent_id: string;
}) => {
  return postAuth(`${API_V1_URI}/terminal/capture_payment_intent`, data);
};
