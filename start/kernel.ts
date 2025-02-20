/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
import { schedule } from 'node-cron'
import mqtt_service from '#services/mqtt_service'
import logService from '#services/log_service'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware')])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({})

/**
 * Schedule tasks to consume MQTT data at 07:00 and 19:00.
 */
schedule('0 7 * * *', () => {
  console.log('Executando consumo MQTT às 07:00...')
  mqtt_service.consumeData()
})

schedule('0 19 * * *', () => {
  console.log('Executando consumo MQTT às 19:00...')
  mqtt_service.consumeData()
})

/**
 * Schedule task to clean logs older than 24 hours.
 * This job runs daily at midnight (00:00) to ensure
 * that the system retains only the most recent logs.
 */

schedule('0 0 * * *', () => {
  logService.cleanOldLogs()
})
