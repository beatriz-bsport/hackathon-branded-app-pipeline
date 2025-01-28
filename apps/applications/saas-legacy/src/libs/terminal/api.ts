import { postAuth, getAuth, deleteAuth, putAuth } from '../../http';
import type {
  ConnectionToken,
  ProcessPaymentIntentPayload,
  ProcessSetupIntentPayload,
  ReaderActionSumup,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

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
  return postAuth<ConnectionToken>(`${API_V1_URI}/terminal/connection_token`);
};

export const capturePaymentIntent = async (data: {
  payment_intent_id: string;
}) => {
  return postAuth(`${API_V1_URI}/terminal/capture_payment_intent`, data);
};

export const retrieveReaderActionSumup = (readerId: string) =>
  getAuth<ReaderActionSumup>(
    `${API_V1_URI}/terminal/reader/${readerId}/retrieve_reader_sumup/`,
  );

export const processPaymentIntent = (
  readerId: string,
  data: ProcessPaymentIntentPayload,
) =>
  postAuth<ReaderActionSumup>(
    `${API_V1_URI}/terminal/reader/${readerId}/process_payment_intent/`,
    data,
  );

export const processSetupIntent = (
  readerId: string,
  data: ProcessSetupIntentPayload,
) =>
  postAuth<ReaderActionSumup>(
    `${API_V1_URI}/terminal/reader/${readerId}/process_setup_intent/`,
    data,
  );

export const cancelReaderAction = (readerId: string) =>
  postAuth<void>(`${API_V1_URI}/terminal/reader/${readerId}/cancel_action/`);
