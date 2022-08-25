const pdf2json = require('./util/pdf2json');
const json2csv = require('./util/json2csv');

const path = __dirname + '/pdf';

const main = async () => {
  const data = await pdf2json(path);
  json2csv(data);
};

main();
