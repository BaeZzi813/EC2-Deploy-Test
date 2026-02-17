import WeatherView from "./lib/components/WeatherView";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className='w-xl mx-auto flex flex-col items-center mt-11'>
      <h1 className='text-4xl font-bold'>게시글 목록</h1>
      <WeatherView />
    </div>
  );
}
