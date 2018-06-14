/* eslint-disable */

import axios from 'axios'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)



// axios 配置
axios.defaults.timeout = 10000;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    if (localStorage.getItem('ACCESS_TOKEN')) {
        config.headers.Authorization = localStorage.getItem('ACCESS_TOKEN')
    }
    config.headers['App-Channel'] = localStorage.getItem('APP_CHANNEL')
    config.headers['App-Version'] = '2.9.4.1';
    // config.headers['App-Version'] = '3.0.0.0';
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
var that = this
axios.interceptors.response.use(
    response => {
        var res = JSON.parse(response.request.response);
        if(res && res.code && res.code != 200) {
            switch (res.code) {
                case 401:
                    localStorage.setItem('ACCESS_TOKEN','')
                    break;
                default:
                     var  result = response.config && response.config.data;
                     if(result && (result == '{"isShowTotast":false}') || result == '{isShowTotast:"false"}' || result == '{"isShowTotast":"false"}' || result == '{isShowTotast:false}') {
                        result = JSON.parse(result);
                        if(result && !JSON.parse(result.isShowTotast)) {
                            break;
                        }
                     }
            }
        }
        return response;
    },
    error => {
        if(error && error.response) {

        }else {
            error = JSON.stringify(error);
            if(error.indexOf('timeout') != -1) {
            }
        }
        return Promise.reject(error);
    }
)
export default axios;
