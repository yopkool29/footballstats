import type { League, LeagueData } from '~/types'

export const getFakeTeams = (league: League): LeagueData => ({
    name: 'Premier League',
    id: league,
    allTeams: [
        { id: 1, name: 'Arsenal', position: 1, points: 63, played: 27, won: 20, drawn: 3, lost: 4, goalsFor: 68, goalsAgainst: 24 },
        { id: 2, name: 'Liverpool', position: 2, points: 62, played: 27, won: 19, drawn: 5, lost: 3, goalsFor: 65, goalsAgainst: 25 },
        { id: 3, name: 'Man City', position: 3, points: 60, played: 27, won: 18, drawn: 6, lost: 3, goalsFor: 63, goalsAgainst: 26 },
        { id: 4, name: 'Tottenham', position: 4, points: 53, played: 27, won: 16, drawn: 5, lost: 6, goalsFor: 59, goalsAgainst: 39 },
        { id: 17, name: 'Everton', position: 17, points: 25, played: 27, won: 8, drawn: 7, lost: 12, goalsFor: 28, goalsAgainst: 39 },
        { id: 18, name: 'Luton', position: 18, points: 20, played: 27, won: 5, drawn: 5, lost: 17, goalsFor: 35, goalsAgainst: 55 },
        { id: 19, name: 'Burnley', position: 19, points: 13, played: 27, won: 3, drawn: 4, lost: 20, goalsFor: 25, goalsAgainst: 58 },
        { id: 20, name: 'Sheffield', position: 20, points: 13, played: 27, won: 3, drawn: 4, lost: 20, goalsFor: 22, goalsAgainst: 66 }
    ],
    topTeams: [
        { id: 1, name: 'Arsenal', position: 1, points: 63, played: 27, won: 20, drawn: 3, lost: 4, goalsFor: 68, goalsAgainst: 24 },
        { id: 2, name: 'Liverpool', position: 2, points: 62, played: 27, won: 19, drawn: 5, lost: 3, goalsFor: 65, goalsAgainst: 25 },
        { id: 3, name: 'Man City', position: 3, points: 60, played: 27, won: 18, drawn: 6, lost: 3, goalsFor: 63, goalsAgainst: 26 },
        { id: 4, name: 'Tottenham', position: 4, points: 53, played: 27, won: 16, drawn: 5, lost: 6, goalsFor: 59, goalsAgainst: 39 }
    ],
    bottomTeams: [
        { id: 17, name: 'Everton', position: 17, points: 25, played: 27, won: 8, drawn: 7, lost: 12, goalsFor: 28, goalsAgainst: 39 },
        { id: 18, name: 'Luton', position: 18, points: 20, played: 27, won: 5, drawn: 5, lost: 17, goalsFor: 35, goalsAgainst: 55 },
        { id: 19, name: 'Burnley', position: 19, points: 13, played: 27, won: 3, drawn: 4, lost: 20, goalsFor: 25, goalsAgainst: 58 },
        { id: 20, name: 'Sheffield', position: 20, points: 13, played: 27, won: 3, drawn: 4, lost: 20, goalsFor: 22, goalsAgainst: 66 }
    ],
    lastUpdated: new Date().toISOString()
})
