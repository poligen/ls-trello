module.exports = function(duedate) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                   ];
  var d = new Date(duedate);
  var month = monthNames[d.getMonth()];
  var date = d.getDate();
  return month + ' ' + date;
};
