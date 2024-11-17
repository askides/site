import path from 'node:path';
import { Liquid } from 'liquidjs';

export const liquid = new Liquid({
  root: path.resolve('./app/shared/emails'),
  extname: '.liquid',
});
