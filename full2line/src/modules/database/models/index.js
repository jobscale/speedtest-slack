export const Models = {
  schema: 'full2way.db',
  size: 5 * 1024 * 1024,
  tables: {
    t_setting: {
      DDL:
      'CREATE TABLE IF NOT EXISTS `t_setting` (' +
      '  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
      '  `user_id` INTEGER NOT NULL,' +
      '  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
      '  `condition_id` INTEGER NOT NULL,' +
      '  `size_id` INTEGER NOT NULL,' +
      '  `light_id` INTEGER NOT NULL,' +
      '  `color_id` INTEGER NOT NULL,' +
      '  `memo` text NOT NULL,' +
      '  `snap` text NOT NULL,' +
      '  `create_at` timestamp DEFAULT CURRENT_TIMESTAMP,' +
      '  `update_at` timestamp DEFAULT CURRENT_TIMESTAMP,' +
      '  `delete_at` timestamp DEFAULT NULL' +
      ')',
    },
  },
};
export default {
  Models,
};
