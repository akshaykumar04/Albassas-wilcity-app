import moment from "moment";
import momentTimeZone from "moment-timezone";

export const getTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getTodayTimeZone = (zone) => {
  const todayOnZone = momentTimeZone.tz(zone).format();
  return moment(todayOnZone).unix();
};

const getTimeUnixByDay = (date, zone) => {
  const today = moment().format("YYYY-MM-DD");
  const time = momentTimeZone.tz(`${today} ${date}`, zone).format();
  return moment(time).unix();
};

const compareDate = (date1, date2, zone) => {
  const today = moment().format("YYYY-MM-DD");
  const today2359 = momentTimeZone.tz(`${today} 23:59:59`, zone).format();
  const today2359Unix = moment(today2359).unix();

  const time1 = momentTimeZone.tz(`${today} ${date1}`, zone).format();
  const timeUnix1 = moment(time1).unix();
  const todayUnix = getTodayTimeZone(zone);
  const time2 = momentTimeZone.tz(`${today} ${date2}`, zone).format();
  const timeUnix2 = moment(time2).unix();
  if (timeUnix2 < timeUnix1 && timeUnix1 < today2359Unix) {
    const time3 = momentTimeZone.tz(moment(time2).add(1, "day"), zone).format();
    const timeUnix3 = moment(time3).unix();
    return timeUnix1 < todayUnix && todayUnix < timeUnix3;
  }
  return timeUnix1 < todayUnix && todayUnix < timeUnix2;
};

const getBusinessStatus = (data, zone) => {
  const today = momentTimeZone.tz(moment(), zone).format("dddd");
  const now = momentTimeZone.tz(zone).format();
  const nowUnix = moment(now).unix();
  const now7h = getTimeUnixByDay("7:00:00", zone);
  const now0h = getTimeUnixByDay("0:00:00", zone);
  return data.reduce((isOpen, item, index) => {
    let compareDay;
    if (now0h < nowUnix && nowUnix < now7h) {
      compareDay = momentTimeZone
        .tz(moment().subtract(1, "day"), zone)
        .format("dddd");
    } else {
      compareDay = item.dayOfWeek;
    }
    if (today.toLowerCase() === compareDay) {
      if (item.isOpen === "yes") {
        if (
          item.secondOpenHour === null ||
          (getTimeUnixByDay(item.firstOpenHour, zone) < nowUnix &&
            nowUnix < getTimeUnixByDay(item.firstCloseHour, zone))
        ) {
          if ((item.firstOpenHour === item.firstCloseHour) === "24:00:00") {
            return (isOpen = true);
          }
          return (isOpen = compareDate(
            item.firstOpenHour,
            item.firstCloseHour,
            zone
          ));
        }
        return (isOpen = compareDate(
          item.secondOpenHour,
          item.secondCloseHour,
          zone
        ));
        if (item.firstOpenHour === null && item.secondOpenHour === null) {
          return (isOpen = false);
        }
      } else {
        return (isOpen = "day_off");
      }
    }
    return isOpen;
  }, false);
};

export { getBusinessStatus };
