import * as migration_20261118_101545_initial from './20261118_101545_initial';
import * as migration_20261120_065014_location_hero_video from './20261120_065014_location_hero_video';
import * as migration_20261120_070940_location_logo from './20261120_070940_location_logo';
import * as migration_20261127_060136___name from './20261127_060136___name';
import * as migration_20261127_063000_s3_media_prefix from './20261127_063000_s3_media_prefix';
import * as migration_20261127_070000_palatty_s3_prefix from './20261127_070000_palatty_s3_prefix';
import * as migration_20261127_074601_sync_s3_fields from './20261127_074601_sync_s3_fields';
import * as migration_20261127_123640_team_partners_section from './20261127_123640_team_partners_section';
import * as migration_20261127_125321_remove_partner_card_description from './20261127_125321_remove_partner_card_description';

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
    name: '20261120_070940_location_logo',
  },
  {
    up: migration_20261127_060136___name.up,
    down: migration_20261127_060136___name.down,
    name: '20261127_060136___name',
  },
  {
    up: migration_20261127_063000_s3_media_prefix.up,
    down: migration_20261127_063000_s3_media_prefix.down,
    name: '20261127_063000_s3_media_prefix',
  },
  {
    up: migration_20261127_070000_palatty_s3_prefix.up,
    down: migration_20261127_070000_palatty_s3_prefix.down,
    name: '20261127_070000_palatty_s3_prefix',
  },
  {
    up: migration_20261127_074601_sync_s3_fields.up,
    down: migration_20261127_074601_sync_s3_fields.down,
    name: '20261127_074601_sync_s3_fields',
  },
  {
    up: migration_20261127_123640_team_partners_section.up,
    down: migration_20261127_123640_team_partners_section.down,
    name: '20261127_123640_team_partners_section',
  },
  {
    up: migration_20261127_125321_remove_partner_card_description.up,
    down: migration_20261127_125321_remove_partner_card_description.down,
    name: '20261127_125321_remove_partner_card_description'
  },
];
