import router from '@adonisjs/core/services/router'
import WeatherDatum from '#models/weather_datum'

router.get('/weather', async () => {
  return await WeatherDatum.all()
})

router.get('/weather/latest', async () => {
  return await WeatherDatum.query().orderBy('recorded_at', 'desc').first()
})

router.get('/weather/history', async ({ request }) => {
  const { start, end } = request.qs()
  return await WeatherDatum.query()
    .whereBetween('recorded_at', [start, end])
    .orderBy('recorded_at', 'asc')
})
