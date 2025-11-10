import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";


interface FavoriteCity {
    id: string;
    query: string;
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
    addedAt: number;
}


export function useFavorite() {
    const [favorite, setFavorite] = useLocalStorage<FavoriteCity[]>('favorites', []);
    const queryClient = useQueryClient();
    const favoriteQuery = useQuery({
        queryKey: ["favorite"],
        queryFn: () => favorite,
        initialData: favorite,
        staleTime: Infinity,
    })

    const addToFavorite = useMutation({
        mutationFn: async (
            city: Omit<FavoriteCity, "id" | "addedAt">
        ) => {
            const newFavorite: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}-${Date.now()}`,
                addedAt: Date.now()
            }

            const existingFavorites = favorite.some((fav) => fav.id === newFavorite.id)
            if (existingFavorites) return favorite

            const newFavorites = [...favorite, newFavorite].slice(0, 10)

            setFavorite(newFavorites)
            return newFavorite
        },
        onSuccess: () => {

            queryClient.invalidateQueries(({
                queryKey: ["favorite"]
            }));
        }

    })

    const removeFavorite = useMutation({
        mutationFn: async (cityId: string) => {
            const newFavorite = favorite.filter((city) => city.id !== cityId);
            setFavorite(newFavorite);
            return newFavorite
        },
         onSuccess: () => {

            queryClient.invalidateQueries(({
                queryKey: ["favorite"]
            }));
        }
    });

    return {
        favorites: favoriteQuery.data || [],
        addToFavorite,
        removeFavorite,
        isFavorite:(lat:number, lon:number)=>favorite.some((city) => city.lat === lat && city.lon === lon),
    }

}

export const useSearchHistory = () => useFavorite();