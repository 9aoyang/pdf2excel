const fs = require('fs');
const PDFParser = require('pdf2json');
const cols = require('./cols');

const loadPDF = (file) =>
  new Promise((resolve, reject) => {
    {
      const pdfParser = new PDFParser(this, 1);
      pdfParser.loadPDF(file);
      pdfParser.on('pdfParser_dataError', (errData) =>
        reject(new Error(errData.parserError))
      );

      pdfParser.on('pdfParser_dataReady', () => {
        const data = pdfParser.getRawTextContent().split('\n');
        const [, head, ...content] = data;
        const [name, formula] = head.replace(/\s+/, ' ').split(' ');
        const valMap = [name, formula];

        for (let i = 1, len = content.length; i < len - 2; i++) {
          const str = content[i];
          const colonIndex = str.indexOf(':');

          if (colonIndex !== -1) {
            const key = str.slice(0, colonIndex);
            if (cols.includes(key)) {
              valMap.push(str.slice(colonIndex + 2));
            } else {
              valMap[valMap.length - 1] += str;
            }
          } else {
            valMap[valMap.length - 1] += str;
          }
        }
        resolve(valMap.map((item) => item.replaceAll('\r', '\r\n')));
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
        res.push(row);
      }
      resolve(res);
    });
  });

module.exports = pdf2json;
