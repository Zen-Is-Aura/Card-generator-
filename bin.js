const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const bin = event.queryStringParameters.number;

  if (!bin || bin.length !== 6) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid BIN" }),
    };
  }

  const csvPath = path.join(__dirname, '..', '..', 'bin-list-data.csv');
  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.split('\\n');
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols[0] === bin) {
      const result = {};
      headers.forEach((key, index) => {
        result[key.trim()] = cols[index]?.trim() || '';
      });

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: "BIN not found" })
  };
};