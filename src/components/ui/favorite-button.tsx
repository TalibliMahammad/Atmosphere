import type { WeatherData } from '@/api/types'
import { useFavorite } from '@/hooks/useFavorite';

import { Button } from './button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';


interface FavoriteButtonProps {
    data: WeatherData;
}



const FavoriteButton = ({ data }: FavoriteButtonProps) => {
    const { addToFavorite, isFavorite, removeFavorite } = useFavorite()
    const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon)

    const handleToogle = () => {

        if (isCurrentlyFavorite) {
            removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
            toast.error(`Removed ${data.name} from favorites`)
           
        } else {
            addToFavorite.mutate({
                lat: data.coord.lat,
                lon: data.coord.lon,
                name: data.name,
                country: data.sys.country,
                query: data.name,
            
            });
            toast.success(`Added ${data.name} to favorites`)
          
        }
    }

    console.log(isCurrentlyFavorite);

    return (
        <Button className={isCurrentlyFavorite ? "bg-yellow-500  hover:bg-yellow-600" : ""} size={"icon"} onClick={handleToogle}>

            <Star className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`} />
        </Button>
    )
}

export default FavoriteButton