'use strict';

module.exports = function () {
    function dateToInt(date) {
        var day;
        switch (date.substr(0, 2)) {
            case 'ПН':
                day = 0;
                break;
            case 'ВТ':
                day = 1;
                break;
            case 'СР':
                day = 2;
                break;
        }

        return day * 24 + timeToInt(date.substr(3));
    }

    function timeToInt(time) {
        var hour = parseInt(time.substr(0, 2));
        if (time.substr(5, 1) == '+') {
            hour -= parseInt(time.substr(6, 2));
        }
        if (time.substr(5, 1) == '-') {
            hour += parseInt(time.substr(6, 2));
        }
        var minutes = parseInt(time.substr(3, 2)) / 60;
        return hour + minutes;
    }

    function intToDate(int) {
        var date = '';
        switch (parseInt(int / 24)) {
            case 0:
                date += 'ПН';
                break;
            case 1:
                date += 'ВТ';
                break;
            case 2:
                date += 'СР';
                break;
        }
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
    }

    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            var format = pattern.slice();
            var date = intToDate(dateToInt(this.date));
            format = replaceIntoString(format, '%DD', date.substr(0, 2));
            var hour = parseInt(date.substr(3, 2)) + parseInt(this.timezone);
            format = replaceIntoString(format, '%HH', hour);
            format = replaceIntoString(format, '%MM', date.substr(6, 2));
            return format;

            function replaceIntoString(string, from, to) {
                var index = string.indexOf(from);
                return string.slice(0, index) + to + string.slice(index + 3);
            }
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
        }
    };
};
