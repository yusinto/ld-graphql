import { apiKey } from '../utils/constants';

export default {
  Accept: '*/*',
  'Content-Type': 'application/json',
  Authorization: apiKey,
  'accept-encoding': 'gzip, deflate',
};
