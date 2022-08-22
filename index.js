const pdf2json = require('./util/pdf2json');
const json2csv = require('./util/json2csv');

const path = './input/test.pdf';

pdf2json(path).then((data) => json2csv(data));
