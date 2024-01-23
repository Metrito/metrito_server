import type { Express } from 'express';

export function listen(app: Express, port: string | number) {
  if (!port) {
    throw new Error('Port is not provided');
  }

  return new Promise((resolve) => {
    app.listen(port, () => resolve(undefined));
  });
}
