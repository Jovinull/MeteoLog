import Log from '#models/log'
import { DateTime } from 'luxon'

class LogService {
  async info(message: string) {
    await this.storeLog('info', message)
  }

  async warning(message: string) {
    await this.storeLog('warning', message)
  }

  async error(message: string) {
    await this.storeLog('error', message)
  }

  private async storeLog(level: string, message: string) {
    try {
      await Log.create({ level, message, createdAt: DateTime.local() })
      console.log(`[${level.toUpperCase()}] ${message}`)
    } catch (err) {
      console.error('Erro ao salvar log:', err)
    }
  }

  /**
   * Limpa logs antigos com mais de 24h
   */
  async cleanOldLogs() {
    const yesterday = DateTime.local().minus({ hours: 24 })
    await Log.query().where('created_at', '<', yesterday.toSQL()).delete()
    console.log('🧹 Logs mais antigos que 24h foram removidos.')
  }
}

export default new LogService()
