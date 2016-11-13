const _ = require('lodash');

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

function calcSplit(string, maxLength) {
  const lastBlankLine = string.lastIndexOf('\n\n', maxLength);
  const lastNewLine = string.lastIndexOf('\n', maxLength);
  const lastPeriod = string.lastIndexOf('.', maxLength);
  const lastWhiteSpace = string.lastIndexOf(' ', maxLength);

  if (-1 !== lastBlankLine) {
    return lastBlankLine;
  } else if (-1 !== lastNewLine) {
    return lastNewLine;
  } else if (-1 !== lastPeriod) {
    return lastPeriod;
  } else if (-1 !== lastWhiteSpace) {
    return lastWhiteSpace;
  }

  return maxLength;
}

module.exports.IS_TWEET = isTweet;
module.exports.CALC_SPLIT = calcSplit;