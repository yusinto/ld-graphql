import fetch from 'node-fetch';
import { flagsUrl } from '../utils/constants';
import requestHeaders from './requestHeaders';
import Logger from '../utils/log';
import getFlag from './getFlag';

const log = new Logger('getFlags');

// toggle a flag's killswitch
export default async (projKey, envKey, flagKey) => {
  const flag = await getFlag(projKey, flagKey);
  const url = `${flagsUrl}/${projKey}/${flagKey}`;
  const path = `/environments/${envKey}/on`;
  const body = JSON.stringify([
    {
      op: 'replace',
      path,
      value: !flag.environments[envKey].on,
    },
  ]);
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: requestHeaders,
      body,
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }

    log.error(`api response: ${response.status} ${response.statusText} from: ${response.url}`);
    return { error: response.statusText };
  } catch (e) {
    log.error(`${e}. Will retry again later.`);
    return { error: e };
  }
};
