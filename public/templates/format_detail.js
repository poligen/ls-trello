module.exports = function(duedate) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                   ];
  var d = new Date(duedate);
  var month = monthNames[d.getMonth()];
  var date = d.getDate();
  var hour = Number(d.getHours());
  var formatHour = function() {
    if (hour > 12) {
      return hour - 12;
    } else if (hour === 0) {
      return hour = 12;
    } else {
      return hour;
    }
  };
  var ampm = (hour >= 12) ? "PM" : "AM";
  var min = Number(d.getMinutes());
  var formatMin = function() {
    if (min < 10) {
      return '0' + min;
    } else {
      return min;
    }
  };
  return month + ' ' + date + ' at ' + formatHour() + ':' + formatMin() + ' ' + ampm;
};
