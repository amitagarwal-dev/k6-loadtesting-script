import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // spike to 1400 users
    { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
    { duration: '10s', target: 100 }, // scale down. Recovery stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
  ext: {
    loadimpact: {
      projectID: 3565478,
      // Test runs with the same name groups test runs together
      name: "Fi loadtest"
    }
  }
};

const data = open('../aeps_wt_request.json');

const BASE_URL = 'http://127.0.0.1:9897/integra/FI/AEPS/withdrawal/v2';

export default () => {
   const txnRes = http.post(BASE_URL,data,{timeout:'120s'});


   check(txnRes, {
    'txn success': (resp) => {
        return JSON.parse(resp.body).ERRORCODE == '00' },
  });

  sleep(1);
};
