import { AxiosError } from 'axios';

export const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'response' in error;
};
