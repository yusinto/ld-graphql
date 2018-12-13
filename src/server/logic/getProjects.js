import fetch from 'node-fetch';
import { projectsUrl } from '../utils/constants';
import requestHeaders from './requestHeaders';
import Logger from '../utils/log';

const log = new Logger('getProjects');

export default async () => {
  const url = `${projectsUrl}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.items;
    }

    log.error(`api response: ${response.status} ${response.statusText} from: ${response.url}`);
    return [];
  } catch (e) {
    log.error(`${e}. Will retry again later.`);
    return [];
  }
};
