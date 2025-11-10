import React, { useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Button } from './ui/button'
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react'
import { useLocationSearch } from '@/hooks/useWeather'
import { data, useNavigate } from 'react-router-dom'
import { useSearchHistory } from '@/hooks/userSearchHIstory'
import { format } from 'date-fns'
import { useFavorite } from '@/hooks/useFavorite'

const CitySearch = () => {

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const { data: locations, isLoading } = useLocationSearch(query);
    const { history, clearHistory, addToHistory } = useSearchHistory();



    const navigate = useNavigate();

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split('|').map(s => s?.trim());


        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);

        if (isNaN(parsedLat) || isNaN(parsedLon) || !name || !country) {
            console.error("Invalid cityData, cannot use API:", { lat, lon, name, country });
            return;
        }
        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        })
        navigate(`/city/${name}?lat=${parsedLat}&lon=${parsedLon}`);
        setOpen(false)


    }

    const { favorites } = useFavorite();

    return (

        <>
            <Button
                variant="outline"
                className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
                onClick={() => { setOpen(true) }}>
                <Search className="mr-2 h-4 w-4" />
                Search cities...</Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search cities...." />

                <CommandList>
                    {query.length > 2 && !isLoading && <CommandEmpty>No results found.</CommandEmpty>}

                    {favorites.length > 0 && (
                        <>

                            <CommandSeparator />
                            <CommandGroup>
                                <div className='flex items-center justify-between px-2 my-2'>
                                    <p className='text-xs text-muted-foreground'>
                                        Recent searches
                                    </p>
                                    <Button variant="ghost" size="sm" onClick={() => { clearHistory.mutate() }}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>
                                {favorites.map((city) => {
                                    return (
                                        <CommandItem

                                            value={`${city.lat}|${city.lon}|${city.name}|${city.country ?? 'Unknown'}`}

                                            onSelect={handleSelect}
                                            key={city.id}>

                                            <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                            <span>{city.name}</span>
                                            {city.state && (
                                                <span className='text-sm text-muted-foreground'>,{city.state}</span>
                                            )}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                        </>

                    )}
            

                {history.length > 0 && (
                    <>

                        <CommandSeparator />
                        <CommandGroup>
                            <div className='flex items-center justify-between px-2 my-2'>
                                <p className='text-xs text-muted-foreground'>
                                    Recent searches
                                </p>
                                <Button variant="ghost" size="sm" onClick={() => { clearHistory.mutate() }}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                            {history.map((city) => {
                                return (
                                    <CommandItem

                                        value={`${city.lat}|${city.lon}|${city.name}|${city.country ?? 'Unknown'}`}

                                        onSelect={handleSelect}
                                        key={`${city.lat}-${city.lon}}`}>

                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>{city.name}</span>
                                        {city.state && (
                                            <span className='text-sm text-muted-foreground'>,{city.state}</span>
                                        )}
                                        <span className='text-sm text-muted-foreground'>, {city.country}</span>
                                        <span className='ml-auto text-xs text-muted-foreground'>
                                            {format(city.searchedAt, "MMM dd, yyyy")}
                                        </span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        <CommandSeparator />
                    </>

                )}


                {locations && locations.length > 0 && (<CommandGroup heading="Suggestions">
                    {isLoading && (
                        <div className='flex items-center justify-center p-4'>
                            <Loader2 className="animate-spin h-4 w-4" />
                        </div>
                    )}

                    {locations.map((location) => {

                        return (
                            <CommandItem
                                value={`${location.lat}|${location.lon}|${location.name}|${location.country ?? 'Unknown'}`}

                                onSelect={handleSelect}
                                key={`${location.lat}-${location.lon}}`}>
                                <Search className="mr-2 h-4 w-4" />
                                <span>{location.name}</span>
                                {location.state && (
                                    <span className='text-sm text-muted-foreground'>,{location.state}</span>
                                )}
                                <span className='text-sm text-muted-foreground'>, {location.country}</span>
                            </CommandItem>
                        )

                    })}


                </CommandGroup>)}
            </CommandList>
        </CommandDialog >
        </>
    )
}

export default CitySearch