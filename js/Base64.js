/**
 * Created by JounQin on 15/12/3.
 *
 * @author JounQin
 */
;(function () {
    function concatenate(Constructor, arrays) {
        "use strict";

        var totalLength = 0, i, len, arr, result, offset;
        for (i = 0, len = arrays.length; i < len; i++) {
            arr = arrays[i];
            totalLength += arr.length;
        }
        result = new Constructor(totalLength);
        offset = 0;
        for (i = 0, len = arrays.length; i < len; i++) {
            arr = arrays[i];
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    var Base64 = {
        //一次性读取文件 base64 编码,如果失败,尝试分片读取文件
        fromFile: function (file, success, error) {
            var reader = new FileReader;
            reader.readAsDataURL(file);
            reader.onload = function () {
                success && success(this.result);
            };
            reader.onerror = error || function () {
                    this.fromFileInPiece(file, success);
                }.bind(this);
            return this;
        },
        //分片获取文件 base64 编码
        fromFileInPiece: (function () {
            var cache = {};
            return function (file, success, error, start, id) {
                if (!(file && file.slice)) throw Error('参数错误,应传入上传的文件对象!');
                !start && (start = 0);
                !id && (id = +new Date);
                !cache[id] && (cache[id] = {}) && (cache[id].result = new Uint8Array(0)) && (cache[id].file = file) && (cache[id].reader = new FileReader());
                var inFile = cache[id].file,
                    reader = cache[id].reader,
                    end = Math.min(start + 1024 * 1024, inFile.size);
                reader.readAsArrayBuffer(inFile.slice(start, end));
                reader.onload = function (e) {
                    var result = cache[id].result,
                        bytes = new Uint8Array(e.target.result);
                    if (bytes.length) {
                        cache[id].result = concatenate(Uint8Array, [result, bytes]);
                        return this.fromFileInPiece(inFile, success, error, end + 1, id);
                    }
                    this.fromBytes(result, success, file.type);
                    delete cache[id];
                }.bind(this);
                error && (reader.onerror = error);
                return this;
            }
        })(),
        //注意:此方法使用 ajax 请求数据,因此资源须做好跨域处理
        fromUrl: function (url, success, error) {
            var xhr = new XMLHttpRequest(),
                fileType = url.replace(/(\.\d*x\d*)+$/g, '');
            fileType = fileType.substr(fileType.lastIndexOf('.') + 1).toLowerCase();
            var isImage = /(jpg|jpeg|png)/.test(fileType);
            xhr.responseType = "arraybuffer";
            xhr.open("GET", url, true);
            xhr.send();
            xhr.onload = function () {
                this.fromBytes(new Uint8Array(xhr.response), success, isImage && ('image/' + fileType));
            }.bind(this);
            error && (xhr.onerror = error);
            return this;
        },
        fromBytes: function (bytes, success, fileType) {
            var binary = [].map.call(bytes, function (byte) {
                    return String.fromCharCode(byte);
                }).join(''),
                base64 = [
                    'data:',
                    fileType ? fileType : '',
                    ';base64,',
                    btoa(binary)
                ].join('');
            success && success(base64);
            return this;
        }
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = Base64;
    } else {
        if (typeof define === 'function' && (define.amd || define.cmd)) {
            //noinspection JSUnresolvedFunction
            define(function () {
                return Base64;
            });
        } else {
            this.Base64 = Base64;
        }
    }
}).call(this || (typeof window !== 'undefined' ? window : global));