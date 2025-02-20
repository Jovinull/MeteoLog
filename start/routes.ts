import router from '@adonisjs/core/services/router'
import WeatherDatum from '#models/weather_datum'
import { DateTime } from 'luxon'

router.get('/weather', async () => {
  return await WeatherDatum.all()
})

router.get('/weather/latest', async () => {
  return await WeatherDatum.query().orderBy('recorded_at', 'desc').first()
})

router.get('/weather/history', async ({ request }) => {
  const { start, end } = request.qs()

  if (!start || !end) {
    return { error: 'Parâmetros "start" e "end" são obrigatórios' }
  }

  const startDate = DateTime.fromISO(start).startOf('day').toISO()
  const endDate = DateTime.fromISO(end).endOf('day').toISO()

  if (!startDate || !endDate) {
    return { error: 'Formato de data inválido. Use YYYY-MM-DD.' }
  }

  const weatherData = await WeatherDatum.query()
    .whereBetween('recorded_at', [startDate, endDate])
    .orderBy('recorded_at', 'asc')

  if (weatherData.length === 0) {
    return { message: 'Nenhum dado encontrado para o período selecionado.', data: [] }
  }

  return { message: 'Dados encontrados.', data: weatherData }
})
