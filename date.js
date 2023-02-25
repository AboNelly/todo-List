const getDate = function () {
  const date = new Date();
  let options = { weekday: "long" };
  day = date.toLocaleDateString("en-US", options);
  return day;
};

module.exports = getDate;
