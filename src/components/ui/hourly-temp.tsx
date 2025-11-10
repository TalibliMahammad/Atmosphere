import type { ForecastData } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ResponsiveContainer, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts'
import { formatDate } from 'date-fns';



interface HourlyTempratureProps {
    data: ForecastData;
}


const HourlyTemprature = ({ data }: HourlyTempratureProps) => {



    const chartData = data.list.slice(0, 8).map(item => ({
        time: formatDate(new Date(item.dt * 1000), "HH:mm"),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like)
    }));




    return (
        <Card className='flex-1'>
            <CardHeader>
                <CardTitle>Today's Temprature</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='h-[200px] w-full'>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}

                            />
                            <YAxis
                                stroke="#888888"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={(value) => `${value}°`}
                            />

                            <Tooltip content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className='rounded-lg border bg-background p-2 shadow-sm'>
                                            <div className='grid grid-cols-2 gap-2'>
                                                <div className='flex flex-col '>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground'>Temprature</span>
                                                    <span className='font-bold'>{payload[0].value}</span>
                                                </div>
                                                <div className='flex flex-col '>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground' >Feels Like</span>
                                                    <span className='font-bold'>{payload[1].value}</span>
                                                </div>
                                            </div>


                                        </div>
                                    )
                                }
                                return null
                            }} />

                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke="#888888"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="feels_like"
                                stroke="#64748b"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

    )
}

export default HourlyTemprature