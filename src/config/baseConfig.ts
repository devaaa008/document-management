import * as process from 'process';

export default () => ({
  jwtSecret: process.env.JWT_SECRET,
});
