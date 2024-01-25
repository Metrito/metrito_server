import { z } from 'zod';

const logVariable = z.enum(['true', 'false', 'auto']).transform((variable) => {
  if (variable === 'true') {
    return true;
  }

  if (variable === 'false') {
    return false;
  }

  return variable;
});

export const logsEnvSchema = z.object({
  SHOW_DEBUG_LOGS: logVariable.default('auto'),
  STORE_ACTIVITY_LOGS: logVariable.default('auto'),
  STORE_ERROR_LOGS: logVariable.default('auto'),
  STORE_HTTP_ERROR_LOGS: logVariable.default('auto'),
  DATABASE_STORE_ACTIVITY_LOGS: logVariable.default('auto'),
  DATABASE_STORE_ERROR_LOGS: logVariable.default('auto'),
  DATABASE_STORE_HTTP_ERROR_LOGS: logVariable.default('auto'),
});

export type LogsEnvSchema = z.infer<typeof logsEnvSchema>;
