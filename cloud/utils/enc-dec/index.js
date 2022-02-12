const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Please enter the metamask password here. The format is the same password (hint: "capitalist coder" and ending with the same format you follow uniquely for each different sites)
const IV_LENGTH = 16;
 
const encrypt = (text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};
module.exports = { encrypt }