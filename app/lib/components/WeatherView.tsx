"use client";

import { useEffect, useState } from "react";
import { converToNxNy } from "../converToNxNy";
import { getBaseDateTime } from "../getBaseDateTime";
import { getWCH } from "../getWCH";

const dayLabels = ["현재", "내일", "모레", "글피", "그글피"];

const getMaxDaysAvailable = (baseTime: string) => {
  const hour = parseInt(baseTime.substring(0, 2));
  return [17, 20, 23].includes(hour) ? 5 : 4;
};

const getTargetDate = (baseDate: string, dayOffset: number) => {
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

const findCloseStfcTime = (items: any[], targetDate: string) => {
  const dateItems = items.filter((item) => item.fcstDate === targetDate);
  const uniqueTimes = [
    ...new Set(dateItems.map((item) => item.fcstTime)),
  ].sort();

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeNum = currentHour * 100 + currentMinute;

  const futureTimes = uniqueTimes.filter(
    (time) => parseInt(time) >= currentTimeNum,
  );
  const target =
    futureTimes.length > 0
      ? futureTimes[0]
      : uniqueTimes[uniqueTimes.length - 1];
  return target ?? null;
};

export default function WeatherView() {
  const { base_date, base_time } = getBaseDateTime();

  const maxDays = getMaxDaysAvailable(base_time);
  const availableDays = Array.from({ length: maxDays }, (_, i) => ({
    offset: i,
    label: dayLabels[i],
  }));

  const [loading, setLoading] = useState(true);
  const [cachedItems, setCachedItems] = useState([]);

  const [selectedDayOffset, setSelectedDayOffset] = useState(() => {
    if(typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('selectedDayOffset')
    const parsed = saved !== null ? parseInt(saved) : 0;
    return parsed < maxDays ? parsed : 0;
  });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [windChill, setWindChill] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<{
    tmp: string;
    wsd: string;
  } | null>(null);

  useEffect(() => {
    if(!navigator.geolocation) {
      alert('위치를 지원하지 않는 브라우저입니다.')
      setLoading(false)
      return;
    }
    navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const { nx, ny } = converToNxNy(latitude, longitude);

              const response = await fetch(
                `/api/weather?base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`,
              );
              const resData = await response.json();
              const items = resData.response.body.items.item || [];
              setCachedItems(items)
  } catch (error) {
    console.error('날씨 로딩 중 에러 발생', error)
  } finally {
    setLoading(false)
  }},
  () => {
    alert('위치 정보를 가져오는 데 실패했습니다.')
    setLoading(false)
  }
)},[])

useEffect(() => {
  if(cachedItems.length === 0) return;

  localStorage.setItem('selectedDayOffset', selectedDayOffset.toString())

  const targetDate = getTargetDate(base_date, selectedDayOffset)
  const dateItems = cachedItems.filter((i) => i.fcstDate === targetDate)

  const times3Hour = [...new Set(dateItems.map((i) => i.fcstTime))].sort().filter((time) => parseInt(time.substring(0, 2)) % 3 === 0)
  setAvailableTimes(times3Hour)

  const initTime = selectedDayOffset === 0 ? findCloseStfcTime(cachedItems, targetDate) : times3Hour[0] ?? null

  setSelectedTime(initTime)
},[selectedDayOffset, cachedItems])

useEffect(() => {
  if(!selectedTime || cachedItems.length === 0) return;

  const targetDate = getTargetDate(base_date, selectedDayOffset)
  const filtered = cachedItems.filter((i) => i.fcstDate === targetDate && i.fcstTime === selectedTime)

  const tmpItem = filtered.find((i) => i.category === 'TMP')
  const wsdItem = filtered.find((i) => i.category === 'WSD')

  if(tmpItem && wsdItem) {
    const tmp = tmpItem.fcstValue;
    const wsd = wsdItem.fcstValue;
    setWeatherInfo({tmp, wsd})
    setWindChill(getWCH(Number(tmp), Number(wsd)))
  } else {
    setWeatherInfo(null)
    setWindChill(null)
  }
},[selectedTime, cachedItems])

  return (
    <div className="w-xl mx-auto flex flex-col items-center mt-11">
      <div className="flex gap-4">
        {availableDays.map((day) => (
          <button
            key={day.offset}
            onClick={() => setSelectedDayOffset(day.offset)}
            className={`${day.offset === selectedDayOffset ? "text-red-600" : "text-black"}`}
          >
            {day.label}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`${time === selectedTime ? "text-red-600" : "text-black"}`}
          >
            {time.substring(0, 2)}: {time.substring(2, 4)}
          </button>
        ))}
      </div>
      {weatherInfo ? (
        <div>
<div className="text-4xl font-bold">체감온도 : {windChill}</div>
      <div className="text-4xl font-bold ">기온 : {weatherInfo?.tmp}</div>
      <div className="text-4xl font-bold">풍속 : {weatherInfo?.wsd}</div>
      </div>
      ): <div>날씨 정보를 받아오고 있습니다...</div>}
      
    </div>
  );
}
