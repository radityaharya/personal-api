import { z } from 'zod';

const commemorativeCoinSchema = z.object({
  num: z.number(),
  name: z.string(),
  sort: z.number(),
  url: z.string().url(),
});

const avatarSchema = z.object({
  id: z.number(),
  level: z.number(),
  name_mi18n: z.string(),
  full_name_mi18n: z.string(),
  element_type: z.number(),
  camp_name_mi18n: z.string(),
  avatar_profession: z.number(),
  rarity: z.string(),
  group_icon_path: z.string().url(),
  hollow_icon_path: z.string().url(),
  rank: z.number(),
  is_chosen: z.boolean(),
  role_square_url: z.string().url(),
});

const buddySchema = z.object({
  id: z.number(),
  name: z.string(),
  rarity: z.string(),
  level: z.number(),
  star: z.number(),
  bangboo_rectangle_url: z.string().url(),
});

const catNoteSchema = z.object({
  name: z.string(),
  icon: z.string().url(),
  num: z.number(),
});

const statsSchema = z.object({
  active_days: z.number(),
  avatar_num: z.number(),
  world_level_name: z.string(),
  cur_period_zone_layer_count: z.number(),
  buddy_num: z.number(),
  commemorative_coins_list: z.array(commemorativeCoinSchema),
  achievement_count: z.number(),
  climbing_tower_layer: z.number(),
  next_hundred_layer: z.string(),
});

const RecordsResponseSchema = z.object({
  stats: statsSchema,
  avatar_list: z.array(avatarSchema),
  cur_head_icon_url: z.string().url(),
  buddy_list: z.array(buddySchema),
  cat_notes_list: z.array(catNoteSchema),
});

type IRecordsResponse = z.infer<typeof RecordsResponseSchema>;


const EnergyProgressSchema = z.object({
  max: z.number(),
  current: z.number(),
});

const EnergySchema = z.object({
  progress: EnergyProgressSchema,
  restore: z.number(),
  day_type: z.number(),
  hour: z.number(),
  minute: z.number(),
});

const VitalitySchema = z.object({
  max: z.number(),
  current: z.number(),
});

const VhsSaleSchema = z.object({
  sale_state: z.enum(["SaleStateDoing", "SaleStateDone"]),
});

const BountyCommissionSchema = z.object({
  num: z.number(),
  total: z.number(),
});

const SurveyPointsSchema = z.object({
  num: z.number(),
  total: z.number(),
  is_max_level: z.boolean(),
});

const WeeklyTaskSchema = z.object({
  refresh_time: z.number(),
  cur_point: z.number(),
  max_point: z.number(),
});

const RecordNoteResponseSchema = z.object({
  energy: EnergySchema,
  vitality: VitalitySchema,
  vhs_sale: VhsSaleSchema,
  card_sign: z.enum(["CardSignDone", "CardSignNo"]),
  bounty_commission: BountyCommissionSchema,
  survey_points: SurveyPointsSchema,
  abyss_refresh: z.number(),
  coffee: z.nullable(z.object({}).passthrough()),
  weekly_task: WeeklyTaskSchema,
});

type IRecordNoteResponse = z.infer<typeof RecordNoteResponseSchema>;

const AbyssLevelSchema = z.object({
  cur_level: z.number(),
  max_level: z.number(),
  icon: z.string().url(),
});

const AbyssPointSchema = z.object({
  cur_point: z.number(),
  max_point: z.number(),
});

const AbyssDutySchema = z.object({
  cur_duty: z.number(),
  max_duty: z.number(),
});

const AbyssTalentSchema = z.object({
  cur_talent: z.number(),
  max_talent: z.number(),
});

const AbyssCollectSchema = z.object({
  type: z.number(),
  cur_collect: z.number(),
  max_collect: z.number(),
});

const AbyssNestSchema = z.object({
  is_nest: z.boolean(),
  is_hard_nest: z.boolean(),
});

const AbyssThroneSchema = z.object({
  is_throne: z.boolean(),
  max_damage: z.string().optional(),
});

const RecordHollowZeroResponseSchema = z.object({
  abyss_level: AbyssLevelSchema,
  abyss_point: AbyssPointSchema,
  abyss_duty: AbyssDutySchema,
  abyss_talent: AbyssTalentSchema,
  refresh_time: z.number(),
  abyss_collect: z.array(AbyssCollectSchema),
  abyss_nest: AbyssNestSchema,
  abyss_throne: AbyssThroneSchema,
  unlock: z.boolean(),
});

type IRecordHollowZeroResponse = z.infer<typeof RecordHollowZeroResponseSchema>;

const ShiyuAvatarSchema = z.object({
  id: z.number(),
  level: z.number(),
  rarity: z.string(),
  element_type: z.number(),
  avatar_profession: z.number(),
  rank: z.number(),
  role_square_url: z.string().url(),
});

const ShiyuBuddySchema = z.object({
  id: z.number(),
  rarity: z.string(),
  level: z.number(),
  bangboo_rectangle_url: z.string().url(),
});

const monsterInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  weak_element_type: z.number(),
  ice_weakness: z.number(),
  fire_weakness: z.number(),
  elec_weakness: z.number(),
  ether_weakness: z.number(),
  physics_weakness: z.number(),
  icon_url: z.string().url(),
});

const nodeSchema = z.object({
  avatars: z.array(ShiyuAvatarSchema),
  buddy: ShiyuBuddySchema,
  element_type_list: z.array(z.number()),
  monster_info: z.object({
    level: z.number(),
    list: z.array(monsterInfoSchema),
  }),
});

const buffSchema = z.object({
  title: z.string(),
  text: z.string(),
});

const floorDetailSchema = z.object({
  layer_index: z.number(),
  rating: z.string(),
  layer_id: z.number(),
  buffs: z.array(buffSchema),
  node_1: nodeSchema,
  node_2: nodeSchema,
  challenge_time: z.string(),
  zone_name: z.string(),
  floor_challenge_time: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
  }),
});

const dateTimeSchema = z.object({
  year: z.number(),
  month: z.number(),
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  second: z.number(),
});


const RecordShiyuDefenseSchema = z.object({
  schedule_id: z.number(),
  begin_time: z.string(),
  end_time: z.string(),
  rating_list: z.array(z.object({
    times: z.number(),
    rating: z.string(),
  })),
  has_data: z.boolean(),
  all_floor_detail: z.array(floorDetailSchema),
  fast_layer_time: z.number(),
  max_layer: z.number(),
  hadal_begin_time: dateTimeSchema,
  hadal_end_time: dateTimeSchema,
});
type RecordShiyuDefense = z.infer<typeof RecordShiyuDefenseSchema>;


export { RecordsResponseSchema, IRecordsResponse, RecordNoteResponseSchema, IRecordNoteResponse, RecordHollowZeroResponseSchema, IRecordHollowZeroResponse, RecordShiyuDefenseSchema, RecordShiyuDefense };
