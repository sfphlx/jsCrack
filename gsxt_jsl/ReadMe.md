### 文件结构

```
gsxt_jsl
|- decrypt.js 生成cookie的解密js脚本
|- test.py  python测试文件
```

### 解密思路

#### 访问流程

首先请求不带cookie访问时，返回一段 script 标签包裹js代码，浏览器执行js代码向document.cookie中添加__jsl_clearance 的cookie， js代码最后执行location.reload重新加载页面.获取真实页面

#### 解密js代码
js代码使用ob混淆，ob混淆的特征有：

- 开头定义个加密字符串的数组
```javascript
var _0x2638 = ['w48Xw7fDiw==', 'REpuwpo=', 'w4IDwq/Dsw==', 'w7UhMA==', 'w5jDsVkl', 'WkN6wpg=', 'w443I8Op', 'w7UQwqfDnw==', 'wrrCjgMc', 'IlPCnUc=', 'CT7DpMKJ', 'CBVxw5w=', 'w7fCjcKmCw==', 'Kj/DtyU=', 'w6TCtcKrwow=', 'w63CuF8q', 'U2FdwrI=', 'ABfDn8K7', 'DTPDhxo=', 'w4x1w4LChA==', 'KyPDozM=', 'w5/CqiXCmg==', 'w7swA8O1', 'wpfCr8KQwow=', 'wo8WDg==', 'aUtcwpQ=', 'w7wsIsOc', 'w7zCo8OrGA==', 'wp/CmMOPw48=', 'w5TCtcK9wrM=', 'w7RnY8O8', 'wqXCq8Kiwrk=', 'w4c1esKm', 'w5PDhF4+', 'w7odWcKR', 'BzfDucKq', 'UG9Rw5s=', 'RHlcwoE=', 'wpzClsOPw68=', 'w5M+GMOG', 'w73Chi3Ctw==', 'Ai7Djk4=', 'w7sjw5fDoA==', 'w6zDoilP', 'wrYZw6UR', 'wqTCkMOvw6Q=', 'HzxHUA==', 'w4s/dcKB', 'HyVfRQ==', 'wrshbVY=', 'EHjCol8=', 'GTBSw7c=', 'Tg59', 'wrHCoSRs', 'IDTDgcKY', 'wpwOKsKh', 'KBnCvAY=', 'wq3Cj8Ofw58=', 'TTdMFQ==', 'w794wpQf', 'w6rChsK2NQ==', 'wqvCjB5K', 'ASdkfQ==', 'RyTCvMKY', 'UEF8wo4=', 'HAvClMOq', 'w7bDhBk=', 'fAfCvMKw', 'wqFHGDw=', 'w5giw5rDpQ==', 'NcKNQMKw', 'w64qw7DDtA==', 'bUlUwpc=', 'w7HCt8KZKg==', 'BBrDgsKv', 'UlnCkcOR', 'w43ClMOrPg==', 'Qn1kwoQ=', 'wprCkx1I', 'w7LDj0k1', 'OMOLw40=', 'OR9rw7s=', 'wq4mw7ME', 'QjMEHw==', 'w7k4wprDgA==', 'w70iOMO7', 'w6fDgg1J', 'wrggw5lW', 'w49nFsO1', '5q+y5Z6P6aqk6K6G', 'w5wpwqXDgw==', 'OGx1JA==', 'IhRvw7s=', 'w6U1PsOr', 'QAvCgsKt', 'wrgiw7o9', 'w6PDvWsM', 'woBLADY=', 'wp8AKsKB', 'IQDChio=', 'MhRsw5s=', 'w5vCkzvCkQ==', 'w6kWG8OV', 'eDg6wpE=', 'wqTCpMOlw5U=', 'wpR6w4PCpw==', 'w68NAMOa', 'wqFnVcKE', 'w7rDtkQR', 'CB1VZw==', 'CcOqw5vDvg==', 'w4UqwrLDig==', 'UFdiw6Q=', 'Jx9xw6k=', 'w5lITnI=', 'w5pzwqIn', 'wo8VLcKK', 'OsOFwobDhw==', 'wokPOcKR', 'w4rDgh9f', 'K8O/w7Eu', 'ABXDnV4=', 'Iz3CgA==', 'w7vCicKvwoI=', 'WjZqPQ==', 'c2Jqw7E=', 'WMOawrbDhA==', 'wqDCpsKFwo0=', 'w6HDgwpo', 'woRFGio=', 'w4nDpxpc', 'woxVOAw=', 'OjzCizk=', 'JyPDlMKG', 'VyIV', 'AE1MLQ==', 'J8Olw5/Dsg==', 'w69+w7XChQ==', 'DhHDm2E=', 'eA8IEA==', 'w63CpcKywrI=', 'w7Yuwr3Dkw==', 'wpBbw4vCkA==', 'YX9nwoI=', 'TBJtMQ==', 'wqFfQsKU', 'bV5nwpc=', 'V2Bdwr0=', 'wqXCqMKGDg==', 'wrsfI8Ki', 'dHNbwqg=', 'woIxw6AS', 'fQbCrMKO', 'PwnDlno=', 'KRd5w5k=', 'w5XDsX0K', 'PBXCgE0=', 'wofCgcO6w7w=', 'eMOxw64=', 'KEzCoFQ=', 'w7XCvUAs', 'MBfDtMKn', 'G2PClW4=', 'wq0wVF4=', 'woFVFCc=', 'QcOtwrrDqg==', 'CHrClFI=', 'JDbDtMKv', 'KsOhw54n', 'DsO+w57DnA==', 'w6gqK8O7', 'wq3CnsKgwpk=', 'wqfCksKswr8=', 'LwzDlXs=', 'wo5LX8Kh', 'w5dqw6LChg==', 'Yy5UNQ==', 'woLCvcKSKg==', 'w7IoJcO7', 'w4s2wo3DrQ==', 'wp3ChcKkJQ==', 'w4LCuSXClQ==', 'JiTCg8O7', 'wqgnXX4=', 'c3lkwow=', 'TsO5wq/DjQ==', 'Kwdjcw==', 'FDTCq8OD', 'w5DDpMK4w4o=', 'GcOtw7Yz', 'DAzCrEY=', 'PQjChVk=', 'w4gOGMON', 'wo7Dt2vDkA==', 'w5Z6wpwK', 'QjTCr8KS', 'w78uw5PDvQ==', 'wpHCvsKUwo8=', 'wrddw4DCsg==', 'woHCrMKIwpQ=', 'w45eL2g=', 'w7xAw4rCsg==', 'ZiDClMKg', 'w6kRwpHDrg==', 'BjTDgsKO', 'w78mPcOh', 'LVzCsXM=', 'w4HCh8OZOg==', 'PcKYW8KY', 'w4s4YcKG', 'w5/Dl0Uk', 'wozCjsOqw64=', 'wr4aw7ki', 'I8Osw4rDrw==', 'w55pw6DCqw==', 'wr09w7s7', 'USrDjQ==', 'elNjwrQ=', 'ZsK/CEw=', 'w4rCkXM8', 'XVkKVQ==', 'XsOCwqTDtQ==', 'XwQ2Ng==', 'wqtPORw=', 'w7UUwpnDmg==', 'woLCk8OJw4k=', 'woHCo8K2Iw==', 'w5HCtsKzwro=', 'R29+wqw=', 'wofChsKDwqs=', 'w4vCg8Opw7A=', 'wrptPQA=', 'w5ABD8Oi', 'wo/CosKLwok=', 'BTTDg8K5', 'wr7Cm8KtCQ==', 'w5zCjSfCgw==', 'w6MdCMOD', 'w43DqcKNfw==', '6K215rOp6aun6K+b', 'w6rCpGID', 'wpZEw7XCpQ==', 'w7LCk14h', 'wqDCjcK4Ow==', 'IcO0w5vDsQ==', 'w6gJPcOy', 'KmXCgFs=', 'wrFTDDU=', 'w5IFZMKq', 'w6p/wpRA', 'woDCl8Ogw7Y=', 'KsOQw5AW', 'wpIVGQ==', 'w6rCjmQI', 'w53CtsKUAw==', 'w5nDjlwC', 'wqjClsOMw7s=', 'wpLCjcOCw7o=', 'w6YsC8OC', 'wrFpw7TCnw==', 'bzMiHQ==', 'woDCrcOjw44=', 'w6gIwqnDvw==', 'w7Ntwr4k', 'FBpAYQ==', 'w6bChhPCpA==', 'w4oZwrTDgw==', 'DTvCgyo=', 'w44YL8O6', 'w6PCscOgDw==', 'TVXDr1Q=', 'w7rCg28O', 'wo3Cng4=', 'w6FwwrAz', 'LCTDtCM=', 'PgVZdg==', 'F8KveMK8', 'PiTDszQ=', 'aVBDwrc=', 'Ojxww7g=', 'HTJGRg==', 'O8Oiw7Iv', 'LMO4w6Y+', 'woDCn8K1wqc=', 'woI/w5c9', 'w5jDiVgk', 'Dkt4NA==', 'LMOhw4XDug==', 'w6U3GMOl', 'AxVFXQ==', 'w6MpJMOY', 'wqEZacKm', 'PgvCojs=', 'HWXClg==', 'w5jCp38c', 'ZSPCocKs', 'wpM9c3s=', 'ehrDrcOH', 'U3HCm8Ot', 'w7HCi8K6', 'wpJjw44N', 'w6UWwp3Dkw==', 'M8OFw4jDuQ==', 'wofCpsKNwo8=', 'CDtRXg==', 'w7UtwrbCkg==', 'w7DCrsK3wp8=', 'wrNjw5XCtA==', 'WjQNMQ==', 'wpXCjh1O', 'JxnDtXg=', 'AcODw4AY', 'ZwIAKw==', 'wr7CusKmwo0=', 'GjbDk0I=', 'wrQkw4EX', 'w6XDih91', 'wrvCgsKVwqU=', 'w4cmQsKh', 'w5tiw6bCrA==', 'w77CisOePA==', 'wrZKw6nCtg==', 'DsOww6nDsw==', 'IAfDoE0=', '77+86Ky556up566q', 'R8KTGlY=', 'w5fCsMKxCw==', 'wrZdXcKE', 'wp/Ck8KSNA==', 'DSbCglg=', 'wrkEw6Uw', 'w6TDrFol', 'wpEdXGA=', 'wpHCisOnw7k=', 'HjPDnsKD', 'w6bCosK7wo0=', 'w7LDiEY0', 'w5PCj8Kqwp0=', 'w7sNwq/Dug==', 'AwrClgg=', 'w4zDmwZ5', 'HVnCqk8=', 'wpdWGyY=', 'wpFsGiE=', 'woZmasKf', 'wrTCo8O4w70=', 'w6LCjmga', 'FQDChMOf', 'wr/Cq8Odw5A=', 'FSDCjMOi', 'w4zCsFAm', 'w4QyesKP', 'CgjCkw==', 'w45ew6bCtQ==', 'NS/DuVg=', 'w5IeJMOK', 'w4TCu3Aj', 'w4jDrnsC', '5oCZ55uG6Ky75rOV', 'w7M3wqE=', 'wr7CvsKJwoA=', 'X35JwrQ=', 'DgDCmD0=', 'E1dwAw==', 'GjxUfA==', 'R39qwqI=', 'woTCtcK0JQ==', 'ZXlRw5g=', 'KmXCimw=', 'wpFKTmo=', 'I8KRKsKI', 'P8Ouw6MI', 'w7trwp0F', 'w6PDklkN', 'MEPCt3s=', 'DD3Conc=', 'GRvDh34=', 'w4fCvXcf', 'SxVtBw==', 'w6zCj3QU', 'wrTCvcK2IQ==', 'wqHCv8Kmwpc=', 'w64kw7LDqw==', 'U2JHw7I=', 'Nh3Ct2s=', 'w6Q3wr7Diw==', 'JgfCoMO7', 'ECHDgMKh', 'w7HDnxlz', 'f8KuIlU=', 'TSkYHA==', 'w6UsN8OX', 'F8Odw5EZ', 'wp0uw6QG', 'w4rDjgp+', 'w7DDghpK', 'aTRwwoo=', 'w5HChcOZ', 'w70iJcOv', 'wpIfGMKv', 'CsOAw54k', 'HBzDmH0=', 'AATDghg='];
```
- 第二个节点是一个自执行方法，用来解密开头定义的字符串数组, 其中有对代码格式化检测
```javascript
(function (_0x47a840, _0x263875) {
    var _0x10588b = function (_0x1e49ea) {
        while (--_0x1e49ea) {
            _0x47a840['push'](_0x47a840['shift']());
        }
    };
    var _0x3ffa1f = function () {
        var _0x309a5b = {
            'data': {'key': 'cookie', 'value': 'timeout'},
            'setCookie': function (_0x35d813, _0x4d0bd9, _0x250d1f, _0x30c4b2) {
                _0x30c4b2 = _0x30c4b2 || {};
                var _0x1b07c5 = _0x4d0bd9 + '=' + _0x250d1f;
                var _0x492163 = 0x0;
                for (var _0x3ab92c = 0x0, _0x203bd2 = _0x35d813['length']; _0x3ab92c < _0x203bd2; _0x3ab92c++) {
                    var _0x55e509 = _0x35d813[_0x3ab92c];
                    _0x1b07c5 += ';\x20' + _0x55e509;
                    var _0x4a3baf = _0x35d813[_0x55e509];
                    _0x35d813['push'](_0x4a3baf);
                    _0x203bd2 = _0x35d813['length'];
                    if (_0x4a3baf !== !![]) {
                        _0x1b07c5 += '=' + _0x4a3baf;
                    }
                }
                _0x30c4b2['cookie'] = _0x1b07c5;
            },
            'removeCookie': function () {
                return 'dev';
            },
            'getCookie': function (_0x5ded55, _0x187bbb) {
                _0x5ded55 = _0x5ded55 || function (_0x8a36c4) {
                    return _0x8a36c4;
                };
                var _0x5311ad = _0x5ded55(new RegExp('(?:^|;\x20)' + _0x187bbb['replace'](/([.$?*|{}()[]\/+^])/g, '$1') + '=([^;]*)'));
                var _0x1cbb91 = function (_0x5349fa, _0x49dd98) {
                    _0x5349fa(++_0x49dd98);
                };
                _0x1cbb91(_0x10588b, _0x263875);
                return _0x5311ad ? decodeURIComponent(_0x5311ad[0x1]) : undefined;
            }
        };
        var _0x2103d0 = function () {
            var _0x5518c3 = new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');
            return _0x5518c3['test'](_0x309a5b['removeCookie']['toString']());
        };
        _0x309a5b['updateCookie'] = _0x2103d0;
        var _0x44f07d = '';
        var _0x53a325 = _0x309a5b['updateCookie']();
        if (!_0x53a325) {
            _0x309a5b['setCookie'](['*'], 'counter', 0x1);
        } else if (_0x53a325) {
            _0x44f07d = _0x309a5b['getCookie'](null, 'counter');
        } else {
            _0x309a5b['removeCookie']();
        }
    };
    _0x3ffa1f();
}(_0x2638, 0x191));
```
里面有一些关于document，cookie的代码，这些都是没有用的，其中核心逻辑是读取第一个节点定义的字符串数组，进行一些操作

- 三个节点，主要是对经过第二个节点操作完之后的字符串提供一个访问的接口，通过传递不同的参数，得到真实的字符串值。

```javascript
var _0x1058 = function (_0x47a840, _0x263875) {
    _0x47a840 = _0x47a840 - 0x0;
    var _0x10588b = _0x2638[_0x47a840];
    if (_0x1058['WMWMsh'] === undefined) {
        (function () {
            var _0x309a5b = function () {
                var _0x53a325;
                try {
                    _0x53a325 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')();
                } catch (_0x35d813) {
                    _0x53a325 = window;
                }
                return _0x53a325;
            };
            var _0x2103d0 = _0x309a5b();
            var _0x44f07d = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            _0x2103d0['atob'] || (_0x2103d0['atob'] = function (_0x4d0bd9) {
                var _0x250d1f = String(_0x4d0bd9)['replace'](/=+$/, '');
                var _0x30c4b2 = '';
                for (var _0x1b07c5 = 0x0, _0x492163, _0x3ab92c, _0x203bd2 = 0x0; _0x3ab92c = _0x250d1f['charAt'](_0x203bd2++); ~_0x3ab92c && (_0x492163 = _0x1b07c5 % 0x4 ? _0x492163 * 0x40 + _0x3ab92c : _0x3ab92c, _0x1b07c5++ % 0x4) ? _0x30c4b2 += String['fromCharCode'](0xff & _0x492163 >> (-0x2 * _0x1b07c5 & 0x6)) : 0x0) {
                    _0x3ab92c = _0x44f07d['indexOf'](_0x3ab92c);
                }
                return _0x30c4b2;
            });
        }());
        var _0x1e49ea = function (_0x55e509, _0x4a3baf) {
            var _0x5ded55 = [], _0x187bbb = 0x0, _0x5311ad, _0x1cbb91 = '', _0x8a36c4 = '';
            _0x55e509 = atob(_0x55e509);
            for (var _0x49dd98 = 0x0, _0x5518c3 = _0x55e509['length']; _0x49dd98 < _0x5518c3; _0x49dd98++) {
                _0x8a36c4 += '%' + ('00' + _0x55e509['charCodeAt'](_0x49dd98)['toString'](0x10))['slice'](-0x2);
            }
            _0x55e509 = decodeURIComponent(_0x8a36c4);
            var _0x5349fa;
            for (_0x5349fa = 0x0; _0x5349fa < 0x100; _0x5349fa++) {
                _0x5ded55[_0x5349fa] = _0x5349fa;
            }
            for (_0x5349fa = 0x0; _0x5349fa < 0x100; _0x5349fa++) {
                _0x187bbb = (_0x187bbb + _0x5ded55[_0x5349fa] + _0x4a3baf['charCodeAt'](_0x5349fa % _0x4a3baf['length'])) % 0x100;
                _0x5311ad = _0x5ded55[_0x5349fa];
                _0x5ded55[_0x5349fa] = _0x5ded55[_0x187bbb];
                _0x5ded55[_0x187bbb] = _0x5311ad;
            }
            _0x5349fa = 0x0;
            _0x187bbb = 0x0;
            for (var _0x3f4097 = 0x0; _0x3f4097 < _0x55e509['length']; _0x3f4097++) {
                _0x5349fa = (_0x5349fa + 0x1) % 0x100;
                _0x187bbb = (_0x187bbb + _0x5ded55[_0x5349fa]) % 0x100;
                _0x5311ad = _0x5ded55[_0x5349fa];
                _0x5ded55[_0x5349fa] = _0x5ded55[_0x187bbb];
                _0x5ded55[_0x187bbb] = _0x5311ad;
                _0x1cbb91 += String['fromCharCode'](_0x55e509['charCodeAt'](_0x3f4097) ^ _0x5ded55[(_0x5ded55[_0x5349fa] + _0x5ded55[_0x187bbb]) % 0x100]);
            }
            return _0x1cbb91;
        };
        _0x1058['QNjAEM'] = _0x1e49ea;
        _0x1058['OgNkSk'] = {};
        _0x1058['WMWMsh'] = !![];
    }
    var _0x3ffa1f = _0x1058['OgNkSk'][_0x47a840];
    if (_0x3ffa1f === undefined) {
        if (_0x1058['JdVHAR'] === undefined) {
            var _0xdf7ad2 = function (_0xc04746) {
                this['djFSAv'] = _0xc04746;
                this['TUFxDw'] = [0x1, 0x0, 0x0];
                this['gGlyWA'] = function () {
                    return 'newState';
                };
                this['DXsFRC'] = '\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';
                this['urZHtL'] = '[\x27|\x22].+[\x27|\x22];?\x20*}';
            };
            _0xdf7ad2['prototype']['xkoRdT'] = function () {
                var _0x56bc34 = new RegExp(this['DXsFRC'] + this['urZHtL']);
                var _0x241178 = _0x56bc34['test'](this['gGlyWA']['toString']()) ? --this['TUFxDw'][0x1] : --this['TUFxDw'][0x0];
                return this['uAriHu'](_0x241178);
            };
            _0xdf7ad2['prototype']['uAriHu'] = function (_0x17559d) {
                if (!Boolean(~_0x17559d)) {
                    return _0x17559d;
                }
                return this['kdrIaR'](this['djFSAv']);
            };
            _0xdf7ad2['prototype']['kdrIaR'] = function (_0x28a859) {
                for (var _0x1ae48d = 0x0, _0x3001e9 = this['TUFxDw']['length']; _0x1ae48d < _0x3001e9; _0x1ae48d++) {
                    this['TUFxDw']['push'](Math['round'](Math['random']()));
                    _0x3001e9 = this['TUFxDw']['length'];
                }
                return _0x28a859(this['TUFxDw'][0x0]);
            };
            new _0xdf7ad2(_0x1058)['xkoRdT']();
            _0x1058['JdVHAR'] = !![];
        }
        _0x10588b = _0x1058['QNjAEM'](_0x10588b, _0x263875);
        _0x1058['OgNkSk'][_0x47a840] = _0x10588b;
    } else {
        _0x10588b = _0x3ffa1f;
    }
    return _0x10588b;
};

```

调用方式如下：
```javascript
_0x35bc('0x17a','ED9W');  //  ]+(
_0x35bc('0x88','(To9'); // cusQ
```

#### 混淆还原
编写混淆还原工具还原代码，混淆还原工具见 tools.reverse_sojson.js, 原始代码和还原后的代码见decrypt文件夹。

还原后，分析发现，生成cookie代码只有三个方法有关，其他的方法都是干扰检测，和加密没有关系；

```javascript
function hash(_0x141ffe) {
   // ...
}
function go_0x31c554() {
  // ...
}

go({
    "bts": ["1595400407.737|0|g%2", "XtcCE9l7sOO8R6ct0y3KUveg%3D"],
    "chars": "smFfnyiCljSZCKUfdWXvXk",
    "ct": "d82902b5926dc07343dc700883fcc204",
    "ha": "md5",
    "tn": "__jsl_clearance",
    "vt": "3600"
});

```
抠出上面三段代码，即可生成cookie

### 问题
进过多次运行发现，返回的js代码不是不变的，每次返回的js代码不一样，那么上面方法不能通用。所以通过补环境的方式进行破解，即对返回的js代码整体运行，不修改js代码。

拿到返回的js代码，直接运行，根据报错补全运行所需要的环境。补全的环境如下：

```javascript
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

alter = function () {};
```

最后构建返回cookie的接口：
```javascript
function getCookie(innerCode) {
    eval(innerCode);
    return document.cookie;
}
```

以上便可以根据响应返回的js代码生成cooie