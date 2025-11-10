import { useFavorite } from '@/hooks/useFavorite'
import { useWeather } from '@/hooks/useWeather'
import { ScrollArea, ScrollAreaCorner } from '@radix-ui/react-scroll-area'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface FavoriteCityProps {
    id: string
    lat: number
    lon: number
    name: string
    onRemove: (id: string) => void

}
const FavoriteCity = () => {
const { favorites, removeFavorite } = useFavorite()

const scrollRef = useRef<HTMLDivElement | null>(null)

  // Mouse ilə sürükləmə üçün eventlər
  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current
    if (!slider) return
    slider.dataset.dragging = "true"
    slider.dataset.startX = e.pageX.toString()
    slider.dataset.scrollLeft = slider.scrollLeft.toString()
  }

  const handleMouseLeaveOrUp = () => {
    const slider = scrollRef.current
    if (slider) slider.dataset.dragging = "false"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = scrollRef.current
    if (!slider || slider.dataset.dragging !== "true") return

    const startX = Number(slider.dataset.startX)
    const scrollLeft = Number(slider.dataset.scrollLeft)
    const walk = (e.pageX - startX) * 1.5 // sürət
      slider.scrollLeft = scrollLeft - walk
  }

    if (!favorites.length) return null
    return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto pb-4 scroll-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex flex-nowrap gap-4">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


function FavoriteCityTablet({ id, name, lat, lon, onRemove }: FavoriteCityProps) {
    const navigate = useNavigate();
    const { data: weather, isLoading } = useWeather({ lat, lon })
    return (

        <div
            className='relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md'
            tabIndex={0} role='button' onClick={() => navigate(`/city/${name}?lat=&lon=${lon}`)}>
            <Button onClick={(e) => {
                e.stopPropagation()
                onRemove(id)
                toast.error(`Removed ${name} from Favorites`)
            }} variant={"ghost"} size={"icon"} className='absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100'>
                <X className='h-4 w-4' onClick={() => onRemove(id)} />
            </Button>
            {isLoading ? (
                <div className='flex h-8 items-center justify-center'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                </div>

            ) : weather ? (
                <>
                    <div className='flex items-center gap-2'>
                        <img className='h-8 w-8' src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
                    <div>
                        <p className='font-medium'>{name}</p>
                        <p className='font-xs text-muted-foreground'>
                            {weather.sys.country}
                        </p>
                    </div>
                    </div>
                    <div className='ml-auto text-right'>
                        <p className='text-xl font-bold'>{Math.round(weather.main.temp)}°</p>
                        <p className='text-xs capitalize text-muted-foreground'>
                            {weather.weather[0].description}
                        </p>
                    </div>
                </>
            ) : null}
        </div >
    )


}

export default FavoriteCity;