import chalk from 'chalk';
import { ZodError, z } from 'zod';

const envVariablesSchema = z.object({
  MONGODB_URI: z.string(),
  TOKEN_KEY: z.string(),
  API_TOKEN_SECRET: z.string(),
  JWP_EXPIRES_IN: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_DEVELOPER_TOKEN: z.string(),
  GC_CLIENT_EMAIL: z.string(),
  GC_CLIENT_PRIVATE_KEY: z.string(),
  FB_APP_ID: z.string(),
  FB_APP_SECRET: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
  AWS_SECRET_KEY: z.string(),
  REDIS_URL: z.string(),
  STRIPE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  BULL_BOARD: z.string(),
  OPEN_AI_KEY: z.string(),
  META_API_VERSION: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_PORT: z.string(),
  CLICKHOUSE_USERNAME: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  ZAPITO_TOKEN: z.string(),
  ZAPITO_BOT_ID: z.string(),
  AZURE_SPEECH_RESOURCE_KEY: z.string(),
  AZURE_SPEECH_RESOURCE_REGION: z.string(),
  NO_AUTH: z.string(),
  AIRBYTE_USER: z.string(),
  AIRBYTE_PASS: z.string(),
  AIRBYTE_URL: z.string(),
  METRITO_WORKSPACE_ID: z.string(),
  DESTINATION_ID: z.string(),
  SNOWFLAKE_DESTINATION_ID: z.string(),
  DATA_SOURCE_ADAPTER_KEY: z.string(),
  DEFAULT_DATA_SET: z.string(),
  COMMIT_TRACKER_URL: z.string(),
  ENABLE_COMMIT_TRACKER: z.string(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  ACCESS_TOKEN_KEY: z.string(),
  ACCESS_TOKEN_KEY_EXPIRES_IN: z.string(),
  MAGIC_LINK_TOKEN_KEY: z.string(),
  MAGIC_LINK_TOKEN_KEY_EXPIRES_IN: z.string(),
  DATA_DESTINATION_ADAPTER_KEY: z.string(),
  BIGQUERY_ADMIN_DATASET: z.string(),
  AIRBYTE_ADMIN_WORKSPACE: z.string(),
  CUBE_API_TOKEN: z.string(),
  CUBE_API_URL: z.string(),
  GCP_CREDENTIALS: z.string(),
  GOOGLE_BIGQUERY_PROJECT_ID: z.string(),
  EMAIL_SERVICE_DONTREPLY_ADDRESS: z.string(),
  EMAIL_SERVICE_HOST: z.string(),
  EMAIL_SERVICE_PORT: z.string(),
  JSONBIN_TOKEN: z.string(),
  UPSTASH_KAFKA_BROKER: z.string(),
  UPSTASH_KAFKA_SASL_MECHANISM: z.string(),
  UPSTASH_KAFKA_SASL_USERNAME: z.string(),
  UPSTASH_KAFKA_SASL_PASSWORD: z.string(),
  METRITO_WEBHOOK_SECRET: z.string(),
  METRITO_WEBHOOK_EXPIRES_IN: z.string(),
});

try {
  envVariablesSchema.parse(process.env);

  console.info('Environment variables loaded.');
} catch (err: Error | unknown) {
  if (err instanceof ZodError) {
    const variables: { env: string; message: string }[] = err.issues.map(
      (issue) => ({ env: issue.path.join('.'), message: issue.message }),
    );

    console.error(chalk.red.bold('\nWrong environment variables:'));

    variables.forEach((variable) => {
      console.error(
        chalk.gray('-'),
        chalk.white(`${variable.env}:`),
        variable.message,
      );
    });

    process.exit(1);
  }

  throw err;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariablesSchema> {}
  }
}
