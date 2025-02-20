import mqtt from 'mqtt'
import WeatherDatum from '#models/weather_datum'
import { DateTime } from 'luxon'

class MqttService {
  private client
  private topic = 'weather/station/data' // Defina o tópico corretamente

  constructor() {
    this.client = mqtt.connect('mqtt://SEU_BROKER_URL')
    this.setupListeners()
  }

  private setupListeners() {
    this.client.on('message', async (topic, message) => {
      if (topic !== this.topic) return // Ignorar mensagens de outros tópicos

      try {
        const data = JSON.parse(message.toString())

        if (
          typeof data.temperature !== 'number' ||
          typeof data.humidity !== 'number' ||
          typeof data.pressure !== 'number'
        ) {
          console.error('Dados MQTT inválidos recebidos:', data)
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
        console.log('Dados do clima salvos com sucesso!')
      } catch (error) {
        console.error('Erro ao processar mensagem MQTT:', error)
      }
    })
  }

  public consumeData() {
    console.log('Iniciando consumo manual de dados MQTT...')
    this.client.publish(this.topic, '')
  }
}

export default new MqttService()
