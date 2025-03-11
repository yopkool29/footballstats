import type { Team, MatchTeam, Match } from '../types'

export const useLeagueStats = () => {
    const leagueData = ref<{ topTeams: Team[]; bottomTeams: Team[] }>({ topTeams: [], bottomTeams: [] }); 

    const isTopTeam = (team: Team | MatchTeam): boolean => {
        return leagueData.value?.topTeams.some((t: Team | MatchTeam) => t.id === team.id) ?? false;
    };

    const isBottomTeam = (team: Team | MatchTeam): boolean => {
        return leagueData.value?.bottomTeams.some((t: Team | MatchTeam) => t.id === team.id) ?? false;
    };

    const getTeamForm = (position: number): string => {
        if (position <= 4) return 'Excellente forme';
        if (position <= 8) return 'Très bonne forme';
        if (position <= 12) return 'Bonne forme';
        if (position <= 16) return 'Forme moyenne';
        return 'En difficulté';
    };

    const isCloseMatch = (match: Match): boolean => {
        const positionDiff = Math.abs(match.homeTeam.position - match.awayTeam.position);
        return positionDiff <= 3;
    };

    const getPointsDifference = (match: Match): number => {
        const diff = Math.abs(match.homeTeam.points - match.awayTeam.points);
        return diff;
    };

    const isKeyMatch = (match: Match): boolean => {
        const isHomeTeamTop4 = match.homeTeam.position <= 4;
        const isAwayTeamTop4 = match.awayTeam.position <= 4;
        const isHomeTeamBottom4 = match.homeTeam.position >= 17;
        const isAwayTeamBottom4 = match.awayTeam.position >= 17;

        return (isHomeTeamTop4 && isAwayTeamBottom4) || (isAwayTeamTop4 && isHomeTeamBottom4);
    };

    return {
        isTopTeam,
        isBottomTeam,
        getTeamForm,
        isCloseMatch,
        getPointsDifference,
        isKeyMatch,
    };
};
