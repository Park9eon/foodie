import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/eatery';

export const getEateryList = () => sendRequest(`${BASE_PATH}`, {
  method: 'GET',
});

export const createEatery = data => sendRequest(`${BASE_PATH}`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateEatery = (id, data) => sendRequest(`${BASE_PATH}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
