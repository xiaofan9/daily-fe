export function formatDate(date_, pattern) {
  // date 默认值为当天日期数据
  var tmp = date_;

  if (!date_) {
    tmp = new Date();
  } else if (typeof date_ === "string" && !isNaN(date_)) {
    tmp = parseInt(date_);
  }

  var date = new Date(tmp);

  var DEFAULT_PATTERN = "yyyy-MM-dd";
  var SIGN_REGEXP = /([yMdhsm])(\1*)/g;

  function padding(s, len) {
    let len_ = len - (s + "").length;
    for (let i = 0; i < len_; i++) s = "0" + s;

    return s;
  }

  pattern = pattern || DEFAULT_PATTERN;
  return pattern.replace(SIGN_REGEXP, function($0) {
    switch ($0.charAt(0)) {
      case "y":
        return padding(date.getFullYear(), $0.length);
      case "M":
        return padding(date.getMonth() + 1, $0.length);
      case "d":
        return padding(date.getDate(), $0.length);
      case "w":
        return date.getDay() + 1;
      case "h":
        return padding(date.getHours(), $0.length);
      case "m":
        return padding(date.getMinutes(), $0.length);
      case "s":
        return padding(date.getSeconds(), $0.length);
    }
  });
}
