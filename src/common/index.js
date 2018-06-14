
/* eslint-disable */

window.GLOBALS = {
    //获取地址栏问号后面的参数值
    getUrlParam: function (ename) {
        var url = window.location.href
        var Request = new Object()
        if (url.indexOf('?') != -1) {
            var str = url.split('?')[1]
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
                Request[strs[i].split('=')[0]] = (strs[i].split('=')[1])
            }
        } else {
            return ''
        }
        return Request[ename] && Request[ename].split('#')[0]
    },
    isEquipment() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            return 'Android';
        } else if (isiOS) {
            return 'IOS';
        }
    },
}