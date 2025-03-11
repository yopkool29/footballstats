import type { ApiResponse, LeagueMatches, Match } from '~/types'

export const useLeagueData = () => {
    const config = useRuntimeConfig()

    const allLeagues = [
        { key: config.public.premierLeagueId, label: 'Premier League' },
        { key: config.public.ligue1Id, label: 'Ligue 1' },
        { key: config.public.bundesligaId, label: 'Bundesliga' },
        { key: config.public.serieAId, label: 'Serie A' },
        { key: config.public.laLigaId, label: 'La Liga' },
        { key: config.public.eredivisieId, label: 'Eredivisie' },
        { key: config.public.primeiraLigaId, label: 'Primeira Liga' },
    ]

    const leagues = ref<LeagueMatches[]>([])
    const matchesByLeague = ref<Match[][]>([]) // Tableau de tableau de matchs
    const isLoading = ref(true)
    const error = ref<Error | null>(null)

    const fetchAllLeaguesMatches = async () => {
        try {
            const leaguesData = allLeagues.map((league) => ({ id: league.key, name: league.label }))

            if (leaguesData) {
                // Récupération parallèle pour chaque ligue
                const leaguesPromises = leaguesData.map(async (league) => {
                    const response = await $fetch<ApiResponse<LeagueMatches>>(`/api/matches/${league.id}`, {
                        query: {
                            from_cache: true,
                            force: false,
                        },
                    })
                    response.data.matches

                    return {
                        leagueId: response.data.leagueId,
                        matches: response.data.matches,
                    }
                })

                const results = await Promise.all(leaguesPromises)

                // Mise à jour des références réactives
                leagues.value = results.map((r) => r)
                matchesByLeague.value = results.map((r) => r.matches)
            }
        } catch (err) {
            error.value = err as Error
            console.error('Erreur de récupération:', err)
        } finally {
            isLoading.value = false
        }
    }

    return {
        leagues, // Liste des ligues
        matchesByLeague, // Matchs groupés par ligue [ [matchs-ligue1], [matchs-ligue2], ... ]
        isLoading,
        error,
        fetchAllLeaguesMatches,
        allLeagues, // Ajout de allLeagues pour pouvoir l'utiliser dans les composants
    }
}
