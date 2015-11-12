'use strict';

module.exports.dateToInt = function (date) {
    var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ'];
    return days.indexOf(date.substr(0, 2)) * 24 + this.timeToInt(date.substr(3));
};

module.exports.timeToInt = function timeToInt(time) {
    var hour = parseInt(time.substr(0, 2));
    if (time.substr(5, 1) == '+') {
        hour -= parseInt(time.substr(6, 2));
    }
    if (time.substr(5, 1) == '-') {
        hour += parseInt(time.substr(6, 2));
    }
    var minutes = parseInt(time.substr(3, 2)) / 60;
    return hour + minutes;
};

module.exports.intToDate = function (int) {
    var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ'];
    var date = days[parseInt(int / 24)];
    var time = int % 24;
    var hour = parseInt(time);
    if (hour < 10) {
        date += ' 0' + hour;
    } else {
        date += ' ' + hour;
    }
    var minutes = (time - hour) * 60;
    if (minutes < 10) {
        date += ':0' + minutes;
    } else {
        date += ':' + minutes;
    }
    return date;
};
