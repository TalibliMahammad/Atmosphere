import CurrentWeather from '@/components/current-weather';
import FavoriteCity from '@/components/favorites-city';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button'
import HourlyTemprature from '@/components/ui/hourly-temp';
import WeatherSkeleton from '@/components/ui/loadSkelet';
import WeatherDetails from '@/components/weatherdetail';
import WeatherForecast from '@/components/weatherforecast';
import { useGeoLocation } from '@/hooks/use-geo';
import { useForecastQuery, useReverseGeocodeQuery, useWeather, } from '@/hooks/useWeather';
import { AlertCircleIcon, MapPin, RefreshCw } from 'lucide-react'
import React from 'react'

const WeatherDashboard = () => {

  const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeoLocation();






  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeather(coordinates);
  const forecastQuery = useForecastQuery(coordinates);




  const handleRefresh = () => {
    getLocation();


    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  }
  if (locationLoading) {
    return <WeatherSkeleton />
  }
  if (locationError) {
    return <Alert variant="destructive">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Location Error</AlertTitle>
      <AlertDescription className='flex flex-col gap-4'>
        <p>{locationError}</p>
        <Button onClick={getLocation} variant={"outline"} className='w-fit'>
          <MapPin className='h-4 w-4 mr-2' />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }
  if (!coordinates) {
    return <Alert variant="destructive">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className='flex flex-col gap-4'>
        <p>Please enable your location</p>
        <Button onClick={getLocation} variant={"outline"} className='w-fit'>
          <MapPin className='h-4 w-4 mr-2' />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }


  const locationName = locationQuery.data?.[0]



  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>Something went wrong. Please try again </p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  return (
    <div className='space-y-4'>
      <FavoriteCity />
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
        <Button disabled={weatherQuery.isFetching || forecastQuery.isFetching} variant={'outline'} size={"icon"} onClick={handleRefresh} >  <RefreshCw className={
          `h-4 w-4  ${weatherQuery.isFetching ? "animate-spin" : ""}`} />  </Button>
      </div>



      <div className='grid gap-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
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

export default WeatherDashboard