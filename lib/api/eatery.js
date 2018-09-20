import { sendRequest, sendForm } from './sendRequest';

const BASE_PATH = '/api/eatery';

export const getEatery = (id) => sendRequest(`${BASE_PATH}/${id}`, {
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

export const maps = () => sendRequest(`${BASE_PATH}/map`, {
  method: 'GET',
});

export const createEatery = (data) => sendRequest(`${BASE_PATH}`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateEatery = (id, data) => sendRequest(`${BASE_PATH}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const createReview = (id, data) => sendForm(`${BASE_PATH}/${id}/review`, {
  method: 'POST',
  body: data,
});

export const updateReview = (id, reviewId, data) => sendForm(`${BASE_PATH}/${id}/review/${reviewId}`, {
  method: 'PUT',
  body: data,
});

export const deleteReview = (id, reviewId) => sendForm(`${BASE_PATH}/${id}/review/${reviewId}`, {
  method: 'DELETE',
});
