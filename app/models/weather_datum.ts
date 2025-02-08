import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WeatherDatum extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare recordedAt: DateTime

  @column()
  declare temperature: number

  @column()
  declare humidity: number

  @column()
  declare pressure: number

  @column()
  declare windSpeed: number

  @column()
  declare windDirection: string

  @column()
  declare rainfall: number

  @column()
  declare rained: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
