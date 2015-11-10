'use strict';

var moment = require('./moment');

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var shedule = JSON.parse(json);
    var freeTime = [{from: 0, to: 72}];
    var names = Object.keys(shedule);
    names.forEach(function (name) {
        var personShedule = shedule[name];
        personShedule.forEach(function (period) {
            freeTime = mergeTime(freeTime, {from: dateToInt(period.from),
                                            to: dateToInt(period.to)});
        });
    });
    var workFrom = timeToInt(workingHours.from);
    var workTo = timeToInt(workingHours.to);
    for (var i = 0; i < 3; i++) {
        freeTime = mergeTime(freeTime, {from: 24 * i, to: workFrom + 24 * i});
        freeTime = mergeTime(freeTime, {from: workTo + 24 * i, to: 24 * (i + 1)});
    }
    freeTime = freeTime.filter(function (period) {
        return period.to - period.from > minDuration / 60;
    });
    appropriateMoment.date = intToDate(freeTime[0].from);
    appropriateMoment.timezone = '+5';
    return appropriateMoment;

    function mergeTime(time, period) {
        var newTime = time.slice();
        time.forEach(function (freePeriod) {
            var newPeriods = [];
            if (freePeriod.from >= period.to || freePeriod.to <= period.from) {
                newPeriods.push(freePeriod);
            }
            if (freePeriod.from < period.from && freePeriod.to > period.from) {
                //возможно нужно вычитать минуту
                newPeriods.push({from: freePeriod.from, to: period.from});
            }
            if (freePeriod.to > period.to && freePeriod.from < period.to) {
                newPeriods.push({from: period.to, to: freePeriod.to});
            }
            var index = newTime.indexOf(freePeriod);
            if (index > -1) {
                newTime.splice(newTime.indexOf(freePeriod));
            }
            newTime = newTime.concat(newPeriods);
        });
        return newTime;
    }

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
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
