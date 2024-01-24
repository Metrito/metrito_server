import CheckServerHealthController from '@application/controllers/CheckServerHealthController';

export default function makeCheckServerHealthController() {
  return new CheckServerHealthController();
}
