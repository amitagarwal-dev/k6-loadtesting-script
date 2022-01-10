import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export const options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '1m',

  thresholds: { //exit case
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
  ext: {
    loadimpact: {
      projectID: 3565478,
      // Test runs with the same name groups test runs together
      name: "Fi loadtest"
    }
  }
};

const data = open('../aeps_wt_request.json');

const BASE_URL = 'http://10.10.11.222:9897/integra/FI/AEPS/withdrawal/v2';


export default () => {
  const txnRes = http.post(BASE_URL,data,{timeout:'120s'});

  check(txnRes, {
    'txn success': (resp) => {
        return JSON.parse(resp.body).ERRORCODE == '00' },
  });

  sleep(1);
};
