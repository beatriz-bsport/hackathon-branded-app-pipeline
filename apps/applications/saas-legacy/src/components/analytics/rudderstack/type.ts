import { apiObject } from 'rudder-sdk-js';

export interface UserTraits extends apiObject {
  name: string;
  email: string;
  id: number;
  manager: boolean;
  company: number;
}

export interface TrackProperties {
  [key: string]: string | number | null;
}
