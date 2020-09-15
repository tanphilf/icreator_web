import axios from "axios"
import qs from 'qs'

var domain;

if (process.env.NODE_ENV == 'development')
{
  domain = "http://139.196.158.77/api";
} else if (process.env.NODE_ENV == 'production')
{
  domain = "http://139.196.158.77/api";
}

var request_url = ''
axios.defaults.baseURL = domain
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

// 请求拦截，检查token合法性等
function beforeRequest (cfg) {
}

// 相应拦截，检查请求状态及处理等
function breforeResponse (res) {
}

// 请求拦截器
axios.interceptors.request.use(function (cfg) {
  beforeRequest(cfg);
  request_url = cfg.url
  return cfg

}, function (err) {
  console.log('[request fail]:', cfg.url)
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(function (res) {
  breforeResponse(res);
  return res
}, function (err) {
  console.log('[response error]:', request_url, err)
  return Promise.reject(err)
})

const Request = {
  get (url, data = {}, cfg = {}) {
    return axios.get(url, Object.assign(cfg, {
      params: data
    }));
  },

  post (url, data = {}, cfg = {}) {
    return axios.post(url, qs.stringify(data), cfg)
  },

  upload () {

  },

  download () {

  }
}

export default Request