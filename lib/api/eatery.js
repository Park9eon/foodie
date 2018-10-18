import { sendRequest, sendForm } from './sendRequest';

const BASE_PATH = '/api/eatery';

export const getEatery = id => sendRequest(`${BASE_PATH}/${id}`, {
  method: 'GET',
});

export const getRecommendTagList = () => sendRequest(`${BASE_PATH}/tags/recommend`, {
  method: 'GET',
});

export const getTagList = () => sendRequest(`${BASE_PATH}/tags`, {
  method: 'GET',
});

export const search = (query = '', size = 100) => sendRequest(`${BASE_PATH}/?q=${query}&size=${size}`, {
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

export const addReview = (id, data) => sendRequest(`${BASE_PATH}/${id}/review`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
