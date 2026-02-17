import { WeatherItem } from "./types";

export const dayLabels = ["현재", "내일", "모레", "글피", "그글피"];

export const getMaxDaysAvailable = (baseTime: string) => {
  const hour = parseInt(baseTime.substring(0, 2));
  return [17, 20, 23].includes(hour) ? 5 : 4;
};

export const getTargetDate = (baseDate: string, dayOffset: number) => {
  const year = parseInt(baseDate.substring(0, 4));
  const month = parseInt(baseDate.substring(4, 6)) - 1;
  const day = parseInt(baseDate.substring(6, 8));

  const date = new Date(year, month, day);
  date.setDate(date.getDate() + dayOffset);

  const resultYear = date.getFullYear();
  const resultMonth = String(date.getMonth() + 1).padStart(2, "0");
  const resultDay = String(date.getDate()).padStart(2, "0");

  return `${resultYear}${resultMonth}${resultDay}`;
};

export const findCloseStfcTime = (items: WeatherItem[], targetDate: string) => {
  const dateItems = items.filter((item) => item.fcstDate === targetDate);
  const uniqueTimes = [
    ...new Set(dateItems.map((item) => item.fcstTime)),
  ].sort();

  const now = new Date();
  const currentTimeNum = now.getHours() * 100 + now.getMinutes();

  const futureTimes = uniqueTimes.filter(
    (time) => parseInt(time) >= currentTimeNum,
  );
  const target =
    futureTimes.length > 0
      ? futureTimes[0]
      : uniqueTimes[uniqueTimes.length - 1];
  return target ?? null;
};
