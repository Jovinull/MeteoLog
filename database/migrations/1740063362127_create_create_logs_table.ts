import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('level').notNullable()
      table.text('message').notNullable()
      table.timestamp('created_at').defaultTo(this.now()).index()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
