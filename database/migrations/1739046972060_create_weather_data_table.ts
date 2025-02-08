import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weather_data'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('recorded_at').notNullable().index()

      // Sensores principais
      table.float('temperature').notNullable() // Temperatura externa (°C)
      table.float('humidity').notNullable() // Umidade relativa do ar (%)
      table.float('pressure').notNullable() // Pressão atmosférica (hPa)
      table.float('wind_speed').notNullable() // Velocidade do vento (km/h)
      table.string('wind_direction').notNullable() // Direção do vento (N, NE, E, SE, etc.)
      table.float('rainfall').notNullable().defaultTo(0) // Precipitação acumulada (mm)

      // Coluna para indicar se choveu no dia
      table.boolean('rained').notNullable().defaultTo(false) // True se houve precipitação > 0mm

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
