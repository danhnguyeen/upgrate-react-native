import { AsyncStorage } from 'react-native';
import axios from 'axios';
import i18n from '../i18n';

const instance = axios.create({
  //Key dev
  baseURL: 'http://mylifeapi.vnyi.com:81/api/v1/',
  //Key live
  // baseURL: 'http://appapi.mylifecompany.com:1868/api/v1/',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use( async (config) => {
  const token = await AsyncStorage.getItem('token');
  // console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Check type data r
  const res = typeof response.data ==='object' ? response.data : JSON.parse(response.data)
  if (res.resultCode === 'OK' || res.resultCode === null) {
    return res;
  } else {
    return Promise.reject(res);
  }
}, function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', error.message);
  }
  
  // console.log(error.config);
  // console.log(error);
  if (error.message) {
    if (error.message.includes('timeout') || error.message.includes('Network Error')) {
      error.message = i18n.t('global.networkMsg');
    }
  }
  let errorMessage = '';
  if (error.msg) {
    errorMessage = msg;
  } else if (error.message) {
    errorMessage = error.message;
  }
  error.msg = errorMessage;
  error.message = errorMessage;
  return Promise.reject(error);
});
export default instance;
