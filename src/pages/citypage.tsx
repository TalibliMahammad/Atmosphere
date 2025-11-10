
import CurrentWeather from '@/components/current-weather';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FavoriteButton from '@/components/ui/favorite-button';
import HourlyTemprature from '@/components/ui/hourly-temp';
import WeatherSkeleton from '@/components/ui/loadSkelet';
import WeatherDetails from '@/components/weatherdetail';
import WeatherForecast from '@/components/weatherforecast';
import { useForecastQuery, useWeather, } from '@/hooks/useWeather';
import { AlertTriangle } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';

const Citypage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams()

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };
  const weatherQuery = useWeather(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p> </p>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>{params.cityName},{weatherQuery.data.sys.country}</h1>
      </div>
      <div>
        <FavoriteButton data={{...weatherQuery.data,name: params.cityName}} />
      </div>
      <div className='grid gap-6'>
        <div className='flex flex-col gap-4'>
          <CurrentWeather data={weatherQuery.data} />
          <HourlyTemprature data={forecastQuery.data} />

        </div>
        <div className='grid gap-6 md:grid-cols-2 items-start'>

          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default Citypage