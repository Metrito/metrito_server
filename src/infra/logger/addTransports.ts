import winston from 'winston';

export default function addTransports(
  logger: winston.Logger,
  transportOrTransports: winston.transport | winston.transport[],
) {
  const transports = Array.isArray(transportOrTransports)
    ? transportOrTransports
    : [transportOrTransports];

  transports.forEach((transport) => logger.add(transport));
}
