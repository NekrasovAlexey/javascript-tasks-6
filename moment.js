'use strict';

var utils = require('./utils');

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            var format = pattern.slice();
            var date = utils.intToDate(utils.dateToInt(this.date));
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
            var period = utils.dateToInt(this.date + this.timezone);
            period -= utils.dateToInt(moment.date + moment.timezone);
            return toStatus(period);

            function toStatus(period) {
                var status = 'До ограбления осталось';
                var days = ['', ' 1 день', ' 2 дня'];
                status += days[parseInt(period / 24)];
                var time = period % 24;
                var hour = parseInt(time);
                status += toString(hour, ['час', 'часа', 'часов']);
                var minutes = Math.round((time - hour) * 60);
                status += toString(minutes, ['минута', 'минуты', 'минут']);
                return status;
            }

            function toString(time, strings) {
                var string = '';
                if (time % 10 == 1) {
                    string += ' ' + time + ' ' + strings[0];
                }
                if (time % 10 > 1 && time % 10 < 5) {
                    string += ' ' + time + ' ' + strings[1];
                }
                if (time % 10 > 4 && time % 10 < 21) {
                    string += ' ' + time + ' ' + strings[2];
                }
                return string;
            }
        }
    };
};
