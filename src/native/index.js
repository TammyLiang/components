
/* eslint-disable */
import AppCall from "./appcall";

// //ios手机切换应用、锁屏回调设置   AppCall.openConnectReload(true)
// //然后执行   window.connectReloadChat = function () {xxxx}
// AppCall.call("openConnectReload", val);

// 信息接口
AppCall.extend({
    // 获取个人参数
    getUserData: function() {
        return new Promise((resolve, reject) => {
            AppCall.call("getUserData", (data, error) => {
                resolve(data);
            });
        });
    },

    // 获取app参数
    getProductData: function() {
        return new Promise((resolve, reject) => {
            AppCall.call("getProductData", (data, error) => {
                resolve(data);
            });
        });
    },

    // 获取所有信息（个人和app）
    getAppData: function() {
        let params = {};
        return new Promise((resolve, reject) => {
            AppCall.getProductData()
                .then(data => {
                    data = JSON.parse(data);
                    params.cmdId = data.cmdId;
                    params.cmdName = data.cmdName;

                    params.uuid = data.deviceId || data.appVersion;
                    params.platformCode = data.platformCode;
                    params.platformVersion = data.platformVersion;
                    params.appVersion = data.appVersion;

                    return AppCall.getUserData();
                })
                .then(data => {
                    data = JSON.parse(data);
                    params.userID = data.userId;
                    params.userType = data.userType;
                    params.token = data.userToken;
                    params.username = data.userName;
                    params.islogin = false;
                    if (!!params.userID) params.islogin = true;
                    // console.log(params)
                    resolve(params);
                });
        });
    },

    // 获取签证信息(sign和公共参数)
    getSignData: function(requestParmas) {
        let params = {};
        return new Promise((resolve, reject) => {
            AppCall.getRequestSign(requestParmas).then(data => {
                data = JSON.parse(data);
                params.cmdId = data.cmdId;
                params.cmdName = data.cmdName;
                params.uuid = data.uuid;
                params.platformCode = data.platformCode;
                params.platformVersion = data.platformVersion;
                params.appVersion = data.appVersion;
                params.UserID = data.userId;
                params.islogin = false;
                if (!!params.UserID) params.islogin = true;
                params.sign = data.sign;
                resolve(params);
            });
        });
    },

});

// 工具类接口
AppCall.extend({
    // 弹出提示
    alert: function(text) {
        text = typeof text === "object" ? JSON.stringify(text) : text + "";
        return AppCall.call("alert", text);
    },

    // 设置回调刷新
    setRefreshOnBack: function(on) {
        setTimeout(() => {
            post(on);
        }, 100);

        function post(on) {
            return AppCall.call("setRefreshOnBack", on ? true : false);
        }
    },

    //设置定时器修复IOSbug
    setReload: function(dir) {
        AppCall.call("setReload", dir);
    },

    // 关闭webView
    close: function() {
        return AppCall.call("close");
    },
    //跳转到充值优惠卡页面
    goRechargeCard: function() {
        return this.call("goRechargeCard");
    },
    //跳转到H5没有title
    goNoTitleBarWeb: function(URL) {
        return this.call("goNoTitleBarWeb", URL);
    },
    /**
   * 设置保存在app的值
   * @param key
   * @returns {*}
   */
    setOnetimeEventDone: function(key) {
        // AppCall.call("getOnetimeEventStatus", key, (data) => {
        //   AppCall.alert(data);
        //   resolve("OK");
        // });
        return this.call("setOnetimeEventDone", key);
    },
    /**
   * 从app获取值
   * @param key
   * @returns {Promise}
   */
    getOnetimeEventStatus: function(key) {
        return new Promise((resolve, reject) => {
            AppCall.call("getOnetimeEventStatus", key, data => {
                resolve(data == true);
            });
        });
    },
    /**
     * 原生头部自定义分享
     * @param params
     * iconshow:1
     * title:分享的标题
     * content:内容
     * url:跳转的url
     * ways:渠道   'weixin,weixinfriend,qq,qqfriend' ios没有qqfriend
     * picUrl 分享的图片,不传默认jdd图片
     */
    shareNewsActivity:function (params) {
      return this.call("shareNewsActivity",JSON.stringify(params));
    },
    /**
     * 按钮自定义分享
     * @param params
     * title:分享的标题
     * content:内容
     * url:跳转的url
     * ways:渠道   'weixin,weixinfriend,qq,qqfriend' ios没有qqfriend
     * picUrl 分享的图片,不传默认jdd图片
     */
    shareNewsActivityByWays:function (params) {
      return this.call("shareNewsActivityByWays",JSON.stringify(params));
    },
    /**
     * app登录成功回调某个方法
     * @param params 方法名
     */
    setJsReload:function (params) {
      return this.call("setJsReload", params);
    }
});

// 埋点接口
AppCall.extend({
    // 埋点接口
    infocTable: "",
    infocCfg: {},
    // type
    // 0: wifi下上传
    // 1: 都上传
    infocType: 0,
    infoc: async function(table, obj) {
        let i,
            params = [];
        // 如果只传第一个参数，则表名取默认
        if (obj == null) {
            obj = table;
            table = this.infocTable;
        }
        // 加入默认参数
        for (i in this.infocCfg) {
            if (obj[i] == null) {
                obj[i] = this.infocCfg[i];
            }
        }
        // 参数格式化
        for (i in obj) {
            params.push(i + "=" + encodeURIComponent(obj[i]));
        }

        if (await this.has("report")) {
            return AppCall.call(
                "report",
                JSON.stringify({
                    table: table,
                    type: this.infocType,
                    params: params.join("&")
                })
            );
        } else if (window.Infoc) {
            // 兼容旧版本
            return Infoc.report(
                JSON.stringify({
                    table: table,
                    params: params.join("&")
                })
            );
        }
    }
});

// 调起接口
AppCall.extend({
    // 行为调起
    navigate: function(action) {
        return AppCall.call("navigate", JSON.stringify(action));
    },

    // 分享功能
    share: function(title, content, url, target, screenshot) {
        let params = {
            title: title || "金山彩票",
            text: content || "",
            url: url || "",
            targetUrl: target ? target : url || "",
            screenshot: screenshot ? 1 : 0
        };
        return AppCall.call("share", JSON.stringify(params));
    },

    //动态的分享 标题、分享url、内容
    //obj={title:'xxx',url:'xxx',content:'xzxxx'}
    shareNews: function(obj) {
        AppCall.call("shareNews", JSON.stringify(obj));
    },

    // 分享活动(int 活动ID)
    shareHuodong: function(activityid) {
        setTimeout(function() {
            post();
        }, 100);

        function post() {
            return AppCall.call("shareHuodong", activityid);
        }
    },

    //点击头部按钮分享活动
    //格式:{id:分享id,params:[val1,val2,val3,val4...]}
    shareDynamicHD: function(obj) {
        setTimeout(function() {
            post();
        }, 100);

        function post() {
            return AppCall.call("shareDynamicHD", JSON.stringify(obj));
        }
    },

    //点击页面按钮分享活动，参数同上
    shareHD: function(obj) {
        setTimeout(function() {
            post();
        }, 100);

        function post() {
            return AppCall.call("shareHD", JSON.stringify(obj));
        }
    }
});

// 帐号操作接口
AppCall.extend({
    // 登录
    login: function() {
        return AppCall.call("gameLogin");
    },
    //充值调起
    gameRecharge: function (params) {
        return AppCall.call("gameRecharge", JSON.stringify(params));
    },
    //充值返回
    gameBack: function (callback) {
        return this.call("gameBack", callback);
    },
});

// 基于服务端请求的封装
AppCall.extend({
    // 设置请求数据
    setServerData: function(self, callback) {
        if (typeof self.data !== "object") {
            self.data = {};
        }

        setTimeout(function() {
            return new Promise((resolve, reject) => {
                AppCall.getUserData()
                    .then(data => {
                        data = JSON.parse(data);
                        self.data.userId = data.userId;
                        self.data.userType = data.userType;
                        self.data.token = data.userToken;
                        if (self.data.userId) {
                            self.isLogin = true;
                        } else {
                            self.isLogin = false;
                        }
                        return AppCall.getProductData();
                    })
                    .then(data => {
                        data = JSON.parse(data);
                        self.data.platformCode = data.platformCode;
                        self.data.appVersion = data.appVersion;
                        self.data.cmdId = data.cmdId;
                        self.data.cmdName = data.cmdName;
                    });
            });
        }, 100);
    }
});

export default AppCall;
