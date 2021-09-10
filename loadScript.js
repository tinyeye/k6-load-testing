import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const baseUrl = 'https://tinyeye.com';
let therapistPath = baseUrl + '/online-therapy-careers/';
let schoolPath = baseUrl + '/online-therapy-for-schools/';
let privateTherapyPath = baseUrl + '/private-slp-ot-therapy/';
let aboutUsPath = baseUrl + '/about-us/';
let careersPath = baseUrl + '/careers/';
let contactUsPath = baseUrl + '/contact-tinyeye/';


export let errorRate = new Rate('errors');
export let options = {
    vus: 1, // Number of initial virtual users

    // Stages to be run in the test. Ramp to target, stay at target, then ramp down to new target
    stages: [
        { duration: '15s', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '15s', target: 0 }
      ],

    // Thresholds that if are not met will fail the test (i.e. throw an error)
    thresholds: {
        errors: ['rate<0.01'],  // less than 1% requests should have any other status code (not 200)
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        // http_req_duration: ['p(95) < 2000'], // p95 of http requests should be less than 2s
    }
}

export default function () {
    
    let response = http.batch([
        { method: 'GET', url: baseUrl},
        { method: 'GET', url: therapistPath },
        { method: 'GET', url: schoolPath },
        { method: 'GET', url: privateTherapyPath },
        { method: 'GET', url: aboutUsPath },
        { method: 'GET', url: careersPath },
        { method: 'GET', url: contactUsPath },
      ]);

      const homepage_result = check(response[0], {
        'Homepage status is 200': (res) => res.status === 200,
      });
      errorRate.add(!homepage_result);

      const therapist_page_result = check(response[1], {
        'Therapist Page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!therapist_page_result);

      const school_page_result = check(response[2], {
        'School Page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!school_page_result);

      const privateTherapy_page_result = check(response[3], {
        'Private Therapy page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!privateTherapy_page_result);

      const aboutUs_page_result = check(response[4], {
        'About Us page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!aboutUs_page_result);

      const careers_page_result = check(response[5], {
        'Careers page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!careers_page_result);

      const contactUs_page_result = check(response[6], {
        'Contact Us page status is 200': (res) => res.status === 200,
      });
      errorRate.add(!contactUs_page_result);
      
};