const fs = require('fs');

const xlsx = require('node-xlsx');

const output = process.cwd() + '/csv/list.csv';

const json2csv = (data) => {
  const buffer = xlsx.build([
    {
      name: 'data',
      data,
    },
  ]);
  fs.writeFileSync(output, buffer, 'binary');
};

module.exports = json2csv;
