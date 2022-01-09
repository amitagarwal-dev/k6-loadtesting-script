import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
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

