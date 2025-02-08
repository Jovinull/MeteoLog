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
    this.client.on('connect', () => {
      console.log('MQTT conectado!')
      this.client.subscribe(this.topic, (err) => {
        if (err) console.error(`Erro ao inscrever-se no tópico ${this.topic}:`, err)
      })
    })

    this.client.on('message', async (topic, message) => {
      if (topic !== this.topic) return // Ignorar mensagens de outros tópicos

      try {
        const data = JSON.parse(message.toString())

        const weatherData = new WeatherDatum()
        weatherData.recordedAt = DateTime.local()
        weatherData.temperature = data.temperature
        weatherData.humidity = data.humidity
        weatherData.pressure = data.pressure
        weatherData.windSpeed = data.wind_speed
        weatherData.windDirection = data.wind_direction
        weatherData.rainfall = data.rainfall
        weatherData.rained = data.rainfall > 0

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
