# encoding: utf-8
# Author   : allen
# @Time    : 2020/7/27 上午11:26
# @File    : test.py
# @Software: PyCharm
# @Desc    :
import re

import execjs
import requests


class Gsxt:
    def __init__(self):
        self.url = "http://www.gsxt.gov.cn/index.html"

        self.headers = {
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
                          'Chrome/78.0.3904.70 Safari/537.36',
            'Referer': 'http://www.gsxt.gov.cn/',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }

        filepath = "/home/allen/allen/codes/js_crack_learning/gsxt_jsl/source_new_new.js"
        with open(filepath, "r") as file:
            self.js_func = execjs.compile(file.read())
        self.session =requests.session()

    def get_js_code(self):
        """获取不带cookie返回的js代码"""
        response = self.session.get(self.url, headers=self.headers)
        js_code = re.search(r'<script>(.*?)</script>', response.text)
        if js_code:
            js_code = js_code.group(1)
        return js_code

    def get_cookie(self, inner_js_code):
        """执行js代码，生成__jsl_clearance"""
        cookie = self.js_func.call("getCookie", inner_js_code)
        self.session.cookies["__jsl_clearance"] = re.search(r'__jsl_clearance=(.*?);', cookie).group(1)

    def real_request(self):
        """携带cookie请求页面"""
        response = self.session.get(self.url, headers=self.headers)
        print(response)
        print(response.text)


if __name__ == '__main__':
    spider = Gsxt()
    js_code = spider.get_js_code()
    spider.get_cookie(js_code)
    spider.real_request()
