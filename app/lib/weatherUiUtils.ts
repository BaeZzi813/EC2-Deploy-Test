export type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(fcstTime: string | null): TimeOfDay {
  if (!fcstTime) return "afternoon";
  const hour = parseInt(fcstTime.substring(0, 2));
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

export function getTempColorClass(temp: number | null): string {
  if (temp === null) return "text-white/60";
  if (temp <= -10) return "text-blue-300";
  if (temp <= 0)   return "text-blue-400";
  if (temp <= 5)   return "text-cyan-300";
  if (temp <= 10)  return "text-teal-300";
  if (temp <= 15)  return "text-green-300";
  if (temp <= 20)  return "text-yellow-300";
  if (temp <= 28)  return "text-orange-400";
  return "text-red-400";
}

export const bgGradients: Record<TimeOfDay, string> = {
  dawn:      "from-purple-900 via-pink-900 to-orange-700",
  morning:   "from-sky-500 via-blue-400 to-yellow-200",
  afternoon: "from-sky-600 via-blue-500 to-cyan-400",
  evening:   "from-orange-500 via-pink-900 to-purple-700",
  night:     "from-indigo-950 via-blue-950 to-slate-900",
};

export const timeIcons: Record<TimeOfDay, string> = {
  dawn:      "🌅",
  morning:   "🌤️",
  afternoon: "☀️",
  evening:   "🌇",
  night:     "🌙",
};
