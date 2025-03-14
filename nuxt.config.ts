// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxt/ui',
        '@nuxtjs/tailwindcss'
    ],
    ssr: false,
    tailwindcss: {
        cssPath: '~/assets/css/main.scss',
    },
    sourcemap: process.env.NODE_ENV === 'development' ? {
        server: true,
        client: true,
    } : false,
    app: {
        head: {
            title: 'Football Stats Analyzer',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    name: 'description',
                    content: 'Analysez les performances des équipes de Premier League et de Ligue 1',
                },
            ],
            link: [{ rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
        },
    },
    ui: {
        global: true
    },
    compatibilityDate: '2024-11-01',
    experimental: {
        payloadExtraction: false,
    },
    runtimeConfig: {
        // Variables privées côté serveur uniquement
        footballDataApiKey: process.env.FOOTBALL_DATA_API_KEY,
        footballDataApiUrl: process.env.FOOTBALL_DATA_API_URL,
        cacheDuration: parseInt(process.env.CACHE_DURATION || '3600'),
        // Variables publiques (exposées au client)
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
            premierLeagueId: process.env.PREMIER_LEAGUE_ID,
            ligue1Id: process.env.LIGUE_1_ID,
            bundesligaId: process.env.BUNDESLIGA_ID,
            serieAId: process.env.SERIE_A_ID,
            laLigaId: process.env.LA_LIGA_ID,
            eredivisieId: process.env.EREDIVISIE_ID,
            primeiraLigaId: process.env.PRIMEIRA_LIGA_ID,
        },
    },
})
