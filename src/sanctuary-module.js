import { create, env } from 'sanctuary';

export default create({
  checkTypes: process.env.NODE_ENV !== 'production',
  env
});
