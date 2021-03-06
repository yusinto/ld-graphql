import fetch from 'node-fetch';
import { flagsUrl } from '../utils/constants';
import requestHeaders from './requestHeaders';
import Logger from '../utils/log';

const log = new Logger('getFlags');

// get a single flag in the specified project
export default async (projKey, flagKey) => {
  const url = `${flagsUrl}/${projKey}/${flagKey}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }

    log.error(`api response: ${response.status} ${response.statusText} from: ${response.url}`);
    return {};
  } catch (e) {
    log.error(`${e}. Will retry again later.`);
    return {};
  }
};
