'use strict';
var async = require('async');
var moment = require('moment');
var days_of_week = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
    7: 'sun'
};

let Validate = {
    params: function(rules) {

        let now = {
            weekday: days_of_week[moment().day()],
            time: moment().format("HH:mm:ss"),
            date: moment().format("YYYY-MM-DD")
        };
        return new Promise((resolve, reject) => {
            async.eachSeries(rules, (rule, cb) => {

                let exp = ['begin_time', 'end_time', 'days_of_week', 'begin_date', 'end_date'];
                exp.forEach(param => {
                    if (rule[param]) {
                        switch (param) {
                            case 'begin_time':
                                if (rule.begin_time > now.time) return cb();
                                break;
                            case 'end_time':
                                if (rule.end_time < now.time) return cb();
                                break;
                            case 'days_of_week':
                                if (!rule.days_of_week.includes(now.weekday)) return cb();
                                break;
                            case 'begin_date':
                                if (rule.begin_date > now.date) return cb();
                                break;
                            case 'end_date':
                                if (rule.end_date < now.date) return cb();
                                break;
                            default:
                                // No other case should even occur
                        }
                    }
                });
                return resolve(rule);

            }, () => {
                return resolve(null);
            });
        });
    }

};


module.exports = Validate;
