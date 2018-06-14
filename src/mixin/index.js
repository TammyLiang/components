/* eslint-disable */

import AppCall from '../native'

export const commonLogin = {
    data(){
        return{
            platSource : '',
            isIOS : false,
            equipmentFlag: {'Android': 1, 'IOS': 2}
        }
    },
    beforeMount () {
        // location.href='https://wap.beeplay123.com/testJDDLoading/jddLoading.html?channel=100001&from=plat'
        let channel = GLOBALS.getUrlParam('channel')
        localStorage.setItem('APP_CHANNEL',channel)
        this.platSource = GLOBALS.getUrlParam('from')
        let ua = navigator.userAgent
        this.isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        
        // this.getLoginUserToken('//uic-api.beeplay123.com/uic/api/lottery/login', {
        //     token: "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJqc2NwIiwiaXNzIjoiamRkLmNvbSJ9.eyJ1c2VyVHlwZSI6MSwidXNlcmlkIjoxMzYsInV1aWQiOiIxQjhBNTM4OUM5RDI0MkQ4OUQ3MTVFREQzNTAzNTg5RiJ9.7a37c4913e1940192f3249cf3b5f10f5.MzcxNDY1M2EtODI0ZC00MjczLTkzMmItZDkyNTcwMjhjZWQ5",
        //     userID: "MTM2",
        //     userType: 1,
        //     appVersion: "5.1.9",
        //     platformCode: "IPHONE",
        //     systemCode: this.isIOS ? 2 : 1
        // })
    },
    mounted(){
    },
    methods: {
        async getLoginUserToken (loginUrl, objParams) {
            let self = this
            let {data:data} = await this.axios.post(loginUrl,objParams)
            if(data.code == 200){
                let token = data.data
                this.getAccessToken(token)
            }
        },
        async getAccessToken (token) {
            let {data:data} = await this.axios.post('//uic-api.beeplay123.com/uic/api/user/login/accessToken', {
                                    token: token,
                                    type: 1
                                })
            if (data.code == 200) {
                localStorage.setItem('ACCESS_TOKEN', data.data.accessToken);
                // 获取accesstoken后设置时间，用以判断token失效时间
                localStorage.setItem('jddTokenTime', new Date().getTime())
                localStorage.setItem('lotteryWap', true)
                this.getJumpURL(this.platSource)
            }
        }, 
        async getJumpURL(val){
            let {data:data} = await this.axios.post('//platform-api.beeplay123.com/wap/api/plat/entranceRedirect', {
                value: val,
            })
            if(data.code == 200){
                let params = data.data.redirect,
                    jumpURL
                switch(params){
                    case 'billiards':
                        jumpURL = data.data.redirect+'?channel='+localStorage.getItem('APP_CHANNEL')+'&token='+localStorage.getItem('ACCESS_TOKEN')
                        break
                    default:
                        location.href = data.data.redirect
                }
            } 
        }
    }
}