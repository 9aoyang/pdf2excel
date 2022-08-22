const fs = require('fs');
const PDFParser = require('pdf2json');
const xlsx = require('node-xlsx');

const cols = require('./cols');

const src = './input';

const pdfParser = new PDFParser(this, 1);
pdfParser.loadPDF(`${src}/test.pdf`);
pdfParser.on('pdfParser_dataError', (errData) =>
  reject(new Error(errData.parserError))
);
pdfParser.on('pdfParser_dataReady', () => {
  const data = pdfParser.getRawTextContent().split('\n');
  const [, head, ...content] = data;
  const [name, formula] = head.replace(/\s+/, ' ').split(' ');
  const colMap = ['Name', 'Formula'];
  const valMap = [name, formula];

  for (let i = 1, len = content.length; i < len - 2; i++) {
    const str = content[i];
    const index = str.indexOf(':');

    // 匹配到 ":"
    if (index !== -1) {
      const key = str.slice(0, index);

      // 是想抓取的 key 的:
      if (cols.includes(key)) {
        colMap.push(key);
        valMap.push(str.slice(index + 1));
      } else {
        valMap[valMap.length - 1] += str;
      }
    } else {
      valMap[valMap.length - 1] += str;
    }
  }

  console.log(valMap);
});
