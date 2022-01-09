import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 400 }, // ramp up to 400 users
    { duration: '3h56m', target: 400 }, // stay at 400 for ~4 hours
    { duration: '2m', target: 0 }, // scale down. (optional)
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
