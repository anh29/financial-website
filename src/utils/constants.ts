export const GOOGLE_INFO_API_KEY = import.meta.env.VITE_GOOGLE_USERINFO

export const SERVER_URL = import.meta.env.VITE_SERVER_URL
export const SERVER_ENDPOINT = {
  AUTH: {
    CREATE_USER: `${SERVER_URL}/auth/signUp`,
    SIGN_IN: `${SERVER_URL}/auth/signIn`
  }
}

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL
}
