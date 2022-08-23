const fs = require('fs');
const PDFParser = require('pdf2json');
const cols = require('./cols');

const loadPDF = (file) =>
  new Promise((resolve, reject) => {
    {
      const pdfParser = new PDFParser(this, 1);

      pdfParser.loadPDF(file);

      pdfParser.on('pdfParser_dataError', (errData) => {
        reject(new Error(errData.parserError));
        console.log(file);
      });

      pdfParser.on('pdfParser_dataReady', () => {
        {
          const pdfParser = new PDFParser(this, 1);

          pdfParser.loadPDF(file);

          pdfParser.on('pdfParser_dataError', (errData) => {
            reject(new Error(errData.parserError));
            console.log(file);
          });

          pdfParser.on('pdfParser_dataReady', () => {
            const data = pdfParser.getRawTextContent().split('\n');
            let head;
            let content;

            // 匹配文件名
            const fileName = file
              .replace(/.+\/([\S.-]+)\.pdf$/, '$1')
              .replace(/\S/, (s) => s.toUpperCase());

            // head 可能出现在第一行，也可能出现在第二行
            if (data[0].startsWith(fileName)) {
              head = data[0];
            } else {
              head = data[1];
            }
            // 最后两行为无用信息
            content = data.slice(2, data.length - 2);

            const formula = head.slice(fileName.length).trim();
            const valMap = [fileName, formula];
            let keyIndex = -1;

            for (let i = 0, len = content.length; i < len; i++) {
              const str = content[i];
              const colonIndex = str.indexOf(':');

              if (colonIndex !== -1) {
                const key = str.slice(0, colonIndex);
                keyIndex = cols.indexOf(key);

                if (keyIndex !== -1) {
                  valMap[keyIndex] = str.slice(colonIndex + 1);
                } else {
                  valMap[valMap.length - 1] += str;
                }
              } else {
                if (keyIndex !== -1) {
                  valMap[keyIndex] += str;
                }
              }
            }
            resolve(valMap.map((item) => item.replaceAll('\r', '\r\n')));
          });
        }
      });
    }
  });

const pdf2json = (path) =>
  new Promise((resolve, reject) => {
    const res = [cols];
    fs.readdir(path, async (err, files) => {
      if (err) reject(err);

      for (let i = 0, len = files.length; i < len; i++) {
        const row = await loadPDF(path + '/' + files[i]);
        console.log(`finished: ${i}, total: ${files.length - 1}`);
        res.push(row);
      }
      resolve(res);
    });
  });

module.exports = pdf2json;
