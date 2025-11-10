import type { ForecastData } from '@/api/types'
import { format } from 'date-fns';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowDown, ArrowUp, Droplet, Droplets, Wind } from 'lucide-react';

interface WeatherForecastProps {
    data: ForecastData;
}

interface DailyForecast {
    temp_min: number;
    temp_max: number;
    humidity: number;
    wind: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
    date: number;
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {

    const dailyForecasts = data.list.reduce((acc, forecast) => {

        const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");


        if (!acc[date]) {
            acc[date] = {
                temp_min: forecast.main.temp_min,
                temp_max: forecast.main.temp_max,
                humidity: forecast.main.humidity,
                wind: forecast.wind.speed,
                weather: forecast.weather[0],
                date: forecast.dt

            }
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
        }


        return acc;
    }, {} as Record<string, DailyForecast>)

    const nextDays = Object.values(dailyForecasts).slice(0, 6)


    const formatTemp = (temp: number) => `${Math.round(temp)}°`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    5-day Forecast
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid gap-6'>
                    {
                        nextDays.map((day) => {
                            return (

                                <div className='grid  grid-cols-3  items-center  gap-4 rounded-lg border  p-4' key={day.date}>

                                    <div>
                                        <p className='font-medium'>{format(new Date(day.date * 1000), "EEE, MMM, d")}</p>
                                        <p className='text-sm text-muted-foreground capitalize'>{day.weather.description}</p>
                                    </div>


                                    <div className='flex  flex-col  gap-4 justify-center'>
                                        <span className='flex items-center text-blue-500'>
                                            <ArrowDown className='mr-2 h-4 w-4' />
                                            {formatTemp(day.temp_min)}
                                        </span>
                                        <span className='flex items-center text-red-500'>
                                            <ArrowUp className='mr-2 h-4 w-4' />
                                            {formatTemp(day.temp_max)}
                                        </span>
                                    </div>

                                    <div className=' flex  flex-col  gap-4 justify-center'>
                                        <span className='flex items-center text-blue-500'>
                                            <Droplets className='mr-2 h-4 w-4' />
                                            <span className='text-sm'>{day.humidity}%</span>
                                        </span>
                                        <span className='flex items-center text-red-500'>
                                            <Wind className='mr-2 h-4 w-4' />
                                            <span className='text-sm'>{day.wind} m/s</span>
                                        </span>
                                    </div>


                                </div>
                            )
                        })
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherForecast
