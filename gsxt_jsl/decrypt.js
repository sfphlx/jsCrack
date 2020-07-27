window = global;
document = {
    "cookie": ""
};

navigator = {
    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
};
window.navigator = navigator;

location = {
    "href": "http://www.gsxt.gov.cn/index.html",
    "ancestorOrigins": {},
    "origin": "http://www.gsxt.gov.cn",
    "protocol": "http:",
    "host": "www.gsxt.gov.cn",
    "hostname": "www.gsxt.gov.cn",
    "port": "",
    "pathname": "/index.html",
    "search": "",
    "hash": "",
    reload: function () {},
};
window.loation = location;

alert = alert = function () {};

function setInterval() {};

function setTimeout() {};


function getCookie(innerCode) {
    eval(innerCode);
    return document.cookie;
}

