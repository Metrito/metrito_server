import APIError from './APIError';

export default class ForbiddenError extends APIError {
  constructor(message?: string) {
    super(message || 'Você não está autorizado para isso.', 403);
  }
}
