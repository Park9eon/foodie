import { sendRequest, sendForm } from './sendRequest';

const BASE_PATH = '/api/eatery';

export const getTagList = () => sendRequest(`${BASE_PATH}/tags`, {
  method: 'GET',
});

export const getEateryList = () => sendRequest(`${BASE_PATH}`, {
  method: 'GET',
});

export const createEatery = data => sendForm(`${BASE_PATH}`, {
  method: 'POST',
  body: data,
});

export const updateEatery = (id, data) => sendRequest(`${BASE_PATH}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
