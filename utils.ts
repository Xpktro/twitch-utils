import { moment } from './deps.ts';

export const dateDiff = (from: any, to: any) => {
  const fromDiff = moment(from);
  const toDiff = moment(to);
  const result = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  fromDiff.add(toDiff.utcOffset() - fromDiff.utcOffset(), 'minutes');

  if (fromDiff.isSame(toDiff)) return result;

  var years = toDiff.year() - fromDiff.year();
  var months = toDiff.month() - fromDiff.month();
  var days = toDiff.date() - fromDiff.date();
  var hours = toDiff.hour() - fromDiff.hour();
  var minutes = toDiff.minute() - fromDiff.minute();
  var seconds = toDiff.second() - fromDiff.second();

  if (seconds < 0) {
    seconds = 60 + seconds;
    minutes--;
  }

  if (minutes < 0) {
    minutes = 60 + minutes;
    hours--;
  }

  if (hours < 0) {
    hours = 24 + hours;
    days--;
  }

  if (days < 0) {
    var daysInLastFullMonth = moment(
      toDiff.year() + '-' + (toDiff.month() + 1),
      'YYYY-MM',
    ).subtract(1, 'M').daysInMonth();
    if (daysInLastFullMonth < fromDiff.date()) {
      days = daysInLastFullMonth + days + (fromDiff.date() - daysInLastFullMonth);
    } else {
      days = daysInLastFullMonth + days;
    }
    months--;
  }

  if (months < 0) {
    months = 12 + months;
    years--;
  }

  return { ...result, years, months, days, hours, minutes, seconds };
};

