import { NextResponse } from "next/server";
import axiosinstance from "../axiosinstance";

interface getWeatherProps {
    base_date: string;
    base_time: string;
    nx: number;
    ny: number;
}

async function getWeather ({base_date, base_time, nx, ny}:getWeatherProps) {
    const {data} = await axiosinstance.get('/getVilageFcst', {
        params: {
            ServiceKey: process.env.WEATHER_API_KEY,
            pageNo: 1,
            numOfRows: 1000,
            dataType: 'JSON',
            base_date,
            base_time,
            nx,
            ny,
        }
    });
    return data;
}

export async function GET (request:Request) {
    const {searchParams} = new URL(request.url)

    const base_date = searchParams.get('base_date');
    const base_time = searchParams.get('base_time');
    const nx = searchParams.get('nx')
    const ny = searchParams.get('ny')

    if(!base_date || !base_time || !nx || !ny) {
        return NextResponse.json(
            {error: "Missing required parameters"},
            {status: 400}
        )
    }

    try {
        const weatherData = await getWeather({base_date, base_time, nx:Number(nx), ny:Number(ny)})
        return NextResponse.json(weatherData)
    } catch (error: any) {
        console.error("기상청 API 호출 오류:", error.message)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}