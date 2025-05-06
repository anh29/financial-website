export const GOOGLE_INFO_API_KEY = import.meta.env.VITE_GOOGLE_USERINFO

export const SERVER_URL = import.meta.env.VITE_SERVER_URL
export const SERVER_ENDPOINT = {
  AUTH: {
    CREATE_USER: `${SERVER_URL}/auth/createUser`,
    SIGN_IN: `${SERVER_URL}/auth/signin`,
  },
};
