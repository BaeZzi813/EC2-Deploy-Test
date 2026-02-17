"use client";

import { useEffect, useState } from "react";
import { converToNxNy } from "../converToNxNy";
import { getBaseDateTime } from "../getBaseDateTime";
import { getWCH } from "../getWCH";
import {
  dayLabels,
  getMaxDaysAvailable,
  getTargetDate,
  findCloseStfcTime,
} from "../weatherDateUtils";
import {
  getTimeOfDay,
  getTempColorClass,
  bgGradients,
  timeIcons,
} from "../weatherUiUtils";
import ParticleLayer from "./ParticleLayer";
import { WeatherItem } from "../types";

export default function WeatherView() {
  const { base_date, base_time } = getBaseDateTime();

  const maxDays = getMaxDaysAvailable(base_time);
  const availableDays = Array.from({ length: maxDays }, (_, i) => ({
    offset: i,
    label: dayLabels[i],
  }));

  const [loading, setLoading] = useState(true);
  const [cachedItems, setCachedItems] = useState<WeatherItem[]>([]);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [windChill, setWindChill] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<{
    tmp: string;
    wsd: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedDayOffset");
    const parsed = saved !== null ? parseInt(saved) : 0;
    setSelectedDayOffset(parsed < maxDays ? parsed : 0);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("위치를 지원하지 않는 브라우저입니다.");
      setLoading(false);
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
          setCachedItems(items);
        } catch (error) {
          console.error("날씨 로딩 중 에러 발생", error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("위치 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (cachedItems.length === 0) return;

    localStorage.setItem("selectedDayOffset", selectedDayOffset.toString());

    const targetDate = getTargetDate(base_date, selectedDayOffset);
    const dateItems = cachedItems.filter((i) => i.fcstDate === targetDate);

    const times3Hour = [...new Set(dateItems.map((i) => i.fcstTime))]
      .sort()
      .filter((time) => parseInt(time.substring(0, 2)) % 3 === 0);
    setAvailableTimes(times3Hour);

    const initTime =
      selectedDayOffset === 0
        ? findCloseStfcTime(cachedItems, targetDate)
        : times3Hour[0] ?? null;
    setSelectedTime(initTime);
  }, [selectedDayOffset, cachedItems]);

  useEffect(() => {
    if (!selectedTime || cachedItems.length === 0) return;

    const targetDate = getTargetDate(base_date, selectedDayOffset);
    const filtered = cachedItems.filter(
      (i) => i.fcstDate === targetDate && i.fcstTime === selectedTime,
    );

    const tmpItem = filtered.find((i) => i.category === "TMP");
    const wsdItem = filtered.find((i) => i.category === "WSD");

    if (tmpItem && wsdItem) {
      setWeatherInfo({ tmp: tmpItem.fcstValue, wsd: wsdItem.fcstValue });
      setWindChill(getWCH(Number(tmpItem.fcstValue), Number(wsdItem.fcstValue)));
    } else {
      setWeatherInfo(null);
      setWindChill(null);
    }
  }, [selectedTime, cachedItems]);

  useEffect(() => setMounted(true), []);

  const timeOfDay = getTimeOfDay(selectedTime);
  const bgClass = bgGradients[timeOfDay];
  const tempBarPercent =
    windChill !== null
      ? Math.min(Math.max(((windChill + 20) / 60) * 100, 0), 100)
      : 50;

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${bgClass} transition-all duration-1000 relative overflow-hidden`}
    >
      {mounted && <ParticleLayer />}

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-12">
        <div
          className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <h1 className="text-center text-white/70 text-sm font-medium tracking-[0.2em] uppercase">
            현재 날씨
          </h1>
          <div className="flex gap-2 justify-center flex-wrap">
            {availableDays.map((day) => (
              <button
                key={day.offset}
                onClick={() => setSelectedDayOffset(day.offset)}
                className={[
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                  day.offset === selectedDayOffset
                    ? "bg-white text-slate-800 shadow-lg scale-105"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105",
                ].join(" ")}
              >
                {day.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={[
                  "px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200",
                  time === selectedTime
                    ? "bg-white/30 text-white shadow ring-1 ring-white/40"
                    : "bg-white/5 text-white/40 hover:bg-white/15 hover:text-white/80",
                ].join(" ")}
              >
                {time.substring(0, 2)}:{time.substring(2, 4)}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <span className="text-5xl animate-pulse">⛅</span>
              <p className="text-white/50 text-sm animate-pulse">
                날씨 정보를 받아오고 있습니다...
              </p>
            </div>
          ) : weatherInfo ? (
            <div
              key={`${selectedDayOffset}-${selectedTime}`}
              className="flex flex-col gap-5 animate-fade-in-up"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-6xl animate-float">
                  {timeIcons[timeOfDay]}
                </span>
                <div
                  className={`text-7xl font-black tracking-tight animate-count-in ${getTempColorClass(windChill)}`}
                >
                  {windChill !== null ? `${windChill}°` : "--"}
                </div>
                <p className="text-white/50 text-xs tracking-widest">체감온도</p>
              </div>
              <div className="flex flex-col gap-1">
                <div
                  className="relative w-full h-2 rounded-full overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(to right, #93c5fd, #34d399, #fde68a, #fb923c, #ef4444)",
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-[left] duration-700"
                    style={{ left: `calc(${tempBarPercent}% - 6px)` }}
                  />
                </div>
                <div className="flex justify-between text-white/30 text-xs">
                  <span>-20°</span>
                  <span>40°</span>
                </div>
              </div>

              <div className="h-px bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors duration-200">
                  <span className="text-2xl">🌡️</span>
                  <span className="text-white text-xl font-bold">{weatherInfo.tmp}°</span>
                  <span className="text-white/40 text-xs">기온</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors duration-200">
                  <span className="text-2xl">💨</span>
                  <span className="text-white text-xl font-bold">{weatherInfo.wsd} m/s</span>
                  <span className="text-white/40 text-xs">풍속</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-6">
              날씨 정보를 불러올 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
