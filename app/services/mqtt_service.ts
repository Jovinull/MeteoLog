import mqtt from 'mqtt'
import WeatherDatum from '#models/weather_datum'
import { DateTime } from 'luxon'
import logService from '#services/log_service'

class MqttService {
  private client
  private topic = 'weather/station/data'

  constructor() {
    this.client = mqtt.connect('mqtt://SEU_BROKER_URL')
    this.setupListeners()
  }

  private setupListeners() {
    this.client.on('connect', () => {
      logService.info('MQTT conectado com sucesso!')
      this.client.subscribe(this.topic, (err) => {
        if (err) logService.error(`Erro ao inscrever-se no tópico ${this.topic}: ${err.message}`)
      })
    })

    this.client.on('message', async (topic, message) => {
      if (topic !== this.topic) return

      try {
        const data = JSON.parse(message.toString())

        if (
          typeof data.temperature !== 'number' ||
          typeof data.humidity !== 'number' ||
          typeof data.pressure !== 'number'
        ) {
          logService.warning(`Dados MQTT inválidos recebidos: ${JSON.stringify(data)}`)
          return
        }

        const weatherData = new WeatherDatum()
        weatherData.recordedAt = DateTime.local()
        weatherData.temperature = data.temperature
        weatherData.humidity = data.humidity
        weatherData.pressure = data.pressure
        weatherData.windSpeed = data.wind_speed || 0
        weatherData.windDirection = data.wind_direction || 'N/A'
        weatherData.rainfall = data.rainfall || 0
        weatherData.rained = (data.rainfall || 0) > 0

        await weatherData.save()
        logService.info('Dados do clima salvos com sucesso!')
      } catch (error) {
        logService.error(`Erro ao processar mensagem MQTT: ${error}`)
      }
    })
  }

  public consumeData() {
    console.log('Iniciando consumo manual de dados MQTT...')
    this.client.publish(this.topic, '')
  }
}

export default new MqttService()
