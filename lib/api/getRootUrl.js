import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { NODE_ENV, PORT, PROD_URL } = publicRuntimeConfig;

export default function getRootUrl() {
  const port = PORT || 8000;
  const dev = NODE_ENV !== 'production';
  const ROOT_URL = dev ? `http://localhost:${port}` : `${PROD_URL}`;
  return ROOT_URL;
}
