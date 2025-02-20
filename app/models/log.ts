import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare level: string // 'info', 'warning', 'error'

  @column()
  declare message: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
