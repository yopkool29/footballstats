import type { League, LeagueData, ApiResponse } from '~/types'
import { getTeams } from '~/utils/api'
import { getCachedTeams, cacheTeams } from '~/utils/cache'

export default defineEventHandler(async (event): Promise<ApiResponse<LeagueData>> => {
    const league = getRouterParam(event, 'league') as League
    const query = getQuery(event)
    const force = query.force === 'true'

    try {
        // Si force n'est pas activé, essayer de récupérer depuis le cache d'abord
        if (!force) {
            const cachedData = await getCachedTeams(league)
            if (cachedData) {
                return {
                    data: cachedData,
                    fromCache: true
                }
            }
        }

        // Si force est activé ou pas de cache, appeler l'API
        const data = await getTeams(league)
        
        // Sauvegarder dans le cache même si force est activé
        await cacheTeams(league, data)
        
        return {
            data: data,
            fromCache: false
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error)
        throw createError({
            statusCode: 500,
            message: 'Erreur lors de la récupération des équipes'
        })
    }
})
