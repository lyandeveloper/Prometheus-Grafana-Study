const promClient = require('prom-client');

const register = new promClient.Registry();

const routeDuration = new promClient.Histogram({
  name: 'http_route_duration_seconds',
  help: 'Duration of HTTP routes',
  labelNames: ['label', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 5, 10], // Defina os buckets conforme sua preferência
  registers: [register],
});

const request_total_counter = new promClient.Counter({
  name: 'request_total',
  help: 'Contador de Requisições',
  labelNames: ['method', 'statusCode'],
  registers: [register],
});

module.exports = {
  register,
  request_total_counter,
  routeDuration,
};
