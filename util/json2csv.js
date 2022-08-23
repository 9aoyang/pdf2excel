const fs = require('fs');

const xlsx = require('node-xlsx');

const output = __dirname + '/csv/list.csv';

const json2csv = (data) => {
  const buffer = xlsx.build([
    {
      name: 'name',
      data,
    },
  ]);
  fs.writeFileSync(output, buffer, 'binary');
};

module.exports = json2csv;
