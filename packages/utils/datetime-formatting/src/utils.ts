function cleanMonthString(month: string) {
  return month.replace(/\./g, "");
}

function cleanDayString(day: string) {
  return day.replace(/,/g, "");
}

export { cleanDayString, cleanMonthString };
