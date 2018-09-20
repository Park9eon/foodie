import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/eatery';

export const getEateryList = () => sendRequest(`${BASE_PATH}`, {
  method: 'GET',
});

export const createEatery = data => sendRequest(`${BASE_PATH}`, {
  body: JSON.stringify(data),
});
