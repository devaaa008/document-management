import * as process from 'process';

export default () => ({
  app: {
    appName: process.env.APP_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  aws: {
    region: process.env.AWS_REGION,
    s3: {
      bucket: process.env.AWS_BUCKET,
    },
  },
  swagger: {
    endpoint: 'swagger',
  },
  ingestion: {
    url: process.env.INGESTION_URL,
  },
});
