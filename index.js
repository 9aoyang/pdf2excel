const pdf2json = require('./util/pdf2json');
const json2csv = require('./util/json2csv');

const main = async () => {
  const path = __dirname + '/pdf';
  const data = await pdf2json(path);
  json2csv(data);
};

main();
