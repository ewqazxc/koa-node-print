const fetch = require("node-fetch");
const path = require('path');
const fs = require('fs');
const NodePdfPrinter = require('node-pdf-printer');

const SUCCESS_CODE = 'SUCCESS_CODE';
const ERROR_CODE = 'ERROR_CODE';
const printPdfByUrl = async (pdfUrl) => {
  if (!pdfUrl) {
    return {
      code: ERROR_CODE,
      message: '请输入pdfUrl'
    };
  }
  if (!(/http[s]{0,1}:\/\/([\w.]+\/?)\S*.pdf/.test(pdfUrl))) {
    return {
      code: ERROR_CODE,
      message: '请输入正确的pdfUrl'
    };
  }
  fetch(pdfUrl)
    .then((res) => res.buffer())
    .then(async (buffer) => {
      const pdf = save(buffer);
      NodePdfPrinter.listPrinter("en-US");
      console.log('pdf::', pdf);
      const array = [pdf];
      const res = await NodePdfPrinter.printFiles(array); // 将文件发送到默认打印机
      remove(pdf);
      return res;// true
    });
  return {
    code: SUCCESS_CODE,
    data: {
      pdfUrl,
    },
    message: '成功发起打印请求'
  };
}

function remove(pdf) {
  fs.unlinkSync(pdf);
}

function randomString() {
  // return Math.random().toString(36).substring(7);
  return Date.now().toString();
}
function mkdir(filePath, callback) {
  const arr = filePath.split('\\');
  let dir = arr[0];
  const dirCache = {};
  for (let i = 1; i < arr.length; i++) {
    if (!dirCache[dir] && !fs.existsSync(dir)) {
      dirCache[dir] = true;
      fs.mkdirSync(dir);
    }
    dir = dir + '/' + arr[i];
  }
  fs.writeFileSync(filePath, '');
  callback();
}
function save(buffer) {
  const pdfPath = path.join(__dirname + '/.cache/files/', randomString() + ".pdf");
  if (fs.existsSync(pdfPath)) {
    console.log('该路径已存在');
    fs.writeFileSync(pdfPath, buffer, "binary");
  } else {
    console.log('该路径不存在');
    mkdir(pdfPath, () => { fs.writeFileSync(pdfPath, buffer, "binary") });
  }
  return pdfPath;
}
function onSuccess(res) {
  console.log('onSuccess::', res);
}

function onError(error) {
  console.log('error::', error);
}

module.exports = { printPdfByUrl }