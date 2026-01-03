export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3006'
    : 'https://frontend.muxcloudweb.store';

export default API_BASE_URL;
