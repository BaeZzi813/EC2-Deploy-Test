import WeatherView from "./lib/components/WeatherView";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className='min-h-screen w-full'>
      <WeatherView />
    </div>
  );
}
