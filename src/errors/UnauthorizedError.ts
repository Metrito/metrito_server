import APIError from './APIError';

export default class UnauthorizedError extends APIError {
  constructor(message?: string) {
    super(message || 'Você não está autenticado para isso.', 401);
  }
}
