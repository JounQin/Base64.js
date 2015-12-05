# Base64.js


纯 JavaScript 实现获取文件类输入框（包含一次性获取及分片获取）、链接文件、二进制数组生成 Base64 编码，只建议对小文件（不超过 5M）的文件或图片进行 Base64 编码，过长的文件生成过长的字符串可能影响浏览器性能，且无法在浏览器地址栏直接打开。


_兼容  `AMD `、`CMD `、`CommonJs ` 规范，也可以直接导入 js 文件。_


---


### 具体包含如下方法：


1. `Base64.fromFile(file, success, error)` （一次性获取文件 Base64 编码，失败时若未传入失败参数则尝试分段获取）
2. `Base64.fromFileInPiece(file, success, error)` （分段获取文件 Base64 编码）
3. `Base64.fromUrl(url, success, error)` （通过 ajax 获取链接文件 Base64 编码，因此需要注意跨域问题）
4. `Base64.fromBytes(bytes, success, fileType)` （获取二进制数组 Base64 编码）


###### 部分测试用例放置在 `html/base64.html` 文件中，源代码放置在 `js` 文件夹下，包含未压缩及压缩版和 map 文件。
