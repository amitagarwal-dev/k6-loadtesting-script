import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: { // exit case
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
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


// scenario 2

// stages: [

//   { duration: '5m', target: 60 }, // simulate ramp-up of traffic from 1 to 60 users over 5 minutes.

//   { duration: '10m', target: 60 }, // stay at 60 users for 10 minutes

//   { duration: '3m', target: 100 }, // ramp-up to 100 users over 3 minutes (peak hour starts)

//   { duration: '2m', target: 100 }, // stay at 100 users for short amount of time (peak hour)

//   { duration: '3m', target: 60 }, // ramp-down to 60 users over 3 minutes (peak hour ends)

//   { duration: '10m', target: 60 }, // continue at 60 for additional 10 minutes

//   { duration: '5m', target: 0 }, // ramp-down to 0 users

// ],