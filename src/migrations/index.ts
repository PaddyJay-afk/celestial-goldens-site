import * as migration_20260628_205258_initial from './20260628_205258_initial';
import * as migration_20260702_023106_hero_image from './20260702_023106_hero_image';

export const migrations = [
  {
    up: migration_20260628_205258_initial.up,
    down: migration_20260628_205258_initial.down,
    name: '20260628_205258_initial',
  },
  {
    up: migration_20260702_023106_hero_image.up,
    down: migration_20260702_023106_hero_image.down,
    name: '20260702_023106_hero_image'
  },
];
