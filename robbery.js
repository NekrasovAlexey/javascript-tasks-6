'use strict';

var moment = require('./moment');
var utils = require('./utils');
// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var shedule = JSON.parse(json);
    var freeTime = [{from: 24, to: 96}];
    var names = Object.keys(shedule);
    names.forEach(function (name) {
        var personShedule = shedule[name];
        personShedule.forEach(function (period) {
            freeTime = mergeTime(freeTime, {from: utils.dateToInt(period.from),
                                            to: utils.dateToInt(period.to)});
        });
    });
    var workFrom = utils.timeToInt(workingHours.from);
    var workTo = utils.timeToInt(workingHours.to);
    for (var i = 1; i < 4; i++) {
        freeTime = mergeTime(freeTime, {from: 24 * i, to: workFrom + 24 * i});
        freeTime = mergeTime(freeTime, {from: workTo + 24 * i, to: 24 * (i + 1)});
    }
    freeTime = freeTime.filter(function (period) {
        return period.to - period.from > minDuration / 60;
    });
    if (freeTime.length == 0) {
        appropriateMoment.date = null;
    } else {
        appropriateMoment.date = utils.intToDate(freeTime[0].from);
        appropriateMoment.timezone = '+5';
    }
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
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (robberyMoment.date == null) {
        return 'Ограбления не будет';
    }
    if (utils.dateToInt(moment.date) < utils.dateToInt(robberyMoment.date)) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
