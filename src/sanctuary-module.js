import { create, env } from 'sanctuary';
import { env as flutureEnv } from 'fluture-sanctuary-types';

export default create({
  checkTypes: process.env.NODE_ENV !== 'production',
  env: env.concat(flutureEnv)
});
