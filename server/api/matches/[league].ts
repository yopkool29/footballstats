import type { League, LeagueMatches, ApiResponse } from '~/types'
import { getMatches } from '~/utils/api'
import { getCachedMatches, cacheMatches } from '~/utils/cache'

export default defineEventHandler(async (event): Promise<ApiResponse<LeagueMatches>> => {
    const league = getRouterParam(event, 'league') as League
    const query = getQuery(event)
    const force = query.force === 'true'
    const from_cache = query.from_cache === 'true'

    try {
        // Si force n'est pas activé, essayer de récupérer depuis le cache d'abord
        if (!force) {
            const cachedData = await getCachedMatches(league, from_cache)
            if (cachedData) {
                return {
                    data: cachedData,
                    fromCache: true
                }
            }
        }

        // Si force est activé ou pas de cache, appeler l'API
        const data = await getMatches(league)
        
        // Sauvegarder dans le cache même si force est activé
        await cacheMatches(league, data)
        
        return {
            data: data,
            fromCache: false
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error)
        throw createError({
            statusCode: 500,
            message: 'Erreur lors de la récupération des matchs'
        })
    }
})
