import * as migration_20261118_101545_initial from './20261118_101545_initial';
import * as migration_20261120_065014_location_hero_video from './20261120_065014_location_hero_video';
import * as migration_20261120_070940_location_logo from './20261120_070940_location_logo';

export const migrations = [
  {
    up: migration_20261118_101545_initial.up,
    down: migration_20261118_101545_initial.down,
    name: '20261118_101545_initial',
  },
  {
    up: migration_20261120_065014_location_hero_video.up,
    down: migration_20261120_065014_location_hero_video.down,
    name: '20261120_065014_location_hero_video',
  },
  {
    up: migration_20261120_070940_location_logo.up,
    down: migration_20261120_070940_location_logo.down,
    name: '20261120_070940_location_logo'
  },
];
