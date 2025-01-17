import {
  Variable,
  VariableAttr,
  StoreID,
  VariableProf,
  VariableStore,
  VariableType,
  VariableValue,
  VariableNum,
} from '@typing/variables';
import {
  isAttributeValue,
  isProficiencyType,
  isVariableAttr,
  isVariableBool,
  isVariableNum,
  isVariableProf,
  isVariableStr,
  maxProficiencyType,
  newVariable,
  isListStr,
  isVariableListStr,
  isExtendedProficiencyType,
  nextProficiencyType,
  prevProficiencyType,
  isProficiencyValue,
  isExtendedProficiencyValue,
} from './variable-utils';
import * as _ from 'lodash-es';
import { throwError } from '@utils/notifications';

const DEFAULT_VARIABLES: Record<string, Variable> = {
  ATTRIBUTE_STR: newVariable('attr', 'ATTRIBUTE_STR'),
  ATTRIBUTE_DEX: newVariable('attr', 'ATTRIBUTE_DEX'),
  ATTRIBUTE_CON: newVariable('attr', 'ATTRIBUTE_CON'),
  ATTRIBUTE_INT: newVariable('attr', 'ATTRIBUTE_INT'),
  ATTRIBUTE_WIS: newVariable('attr', 'ATTRIBUTE_WIS'),
  ATTRIBUTE_CHA: newVariable('attr', 'ATTRIBUTE_CHA'),

  SAVE_FORT: newVariable('prof', 'SAVE_FORT', {
    value: 'U',
    attribute: 'ATTRIBUTE_CON',
  }),
  SAVE_REFLEX: newVariable('prof', 'SAVE_REFLEX', {
    value: 'U',
    attribute: 'ATTRIBUTE_DEX',
  }),
  SAVE_WILL: newVariable('prof', 'SAVE_WILL', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),

  SKILL_ACROBATICS: newVariable('prof', 'SKILL_ACROBATICS', {
    value: 'U',
    attribute: 'ATTRIBUTE_DEX',
  }),
  SKILL_ARCANA: newVariable('prof', 'SKILL_ARCANA', {
    value: 'U',
    attribute: 'ATTRIBUTE_INT',
  }),
  SKILL_ATHLETICS: newVariable('prof', 'SKILL_ATHLETICS', {
    value: 'U',
    attribute: 'ATTRIBUTE_STR',
  }),
  SKILL_CRAFTING: newVariable('prof', 'SKILL_CRAFTING', {
    value: 'U',
    attribute: 'ATTRIBUTE_INT',
  }),
  SKILL_DECEPTION: newVariable('prof', 'SKILL_DECEPTION', {
    value: 'U',
    attribute: 'ATTRIBUTE_CHA',
  }),
  SKILL_DIPLOMACY: newVariable('prof', 'SKILL_DIPLOMACY', {
    value: 'U',
    attribute: 'ATTRIBUTE_CHA',
  }),
  SKILL_INTIMIDATION: newVariable('prof', 'SKILL_INTIMIDATION', {
    value: 'U',
    attribute: 'ATTRIBUTE_CHA',
  }),
  SKILL_MEDICINE: newVariable('prof', 'SKILL_MEDICINE', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),
  SKILL_NATURE: newVariable('prof', 'SKILL_NATURE', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),
  SKILL_OCCULTISM: newVariable('prof', 'SKILL_OCCULTISM', {
    value: 'U',
    attribute: 'ATTRIBUTE_INT',
  }),
  SKILL_PERFORMANCE: newVariable('prof', 'SKILL_PERFORMANCE', {
    value: 'U',
    attribute: 'ATTRIBUTE_CHA',
  }),
  SKILL_RELIGION: newVariable('prof', 'SKILL_RELIGION', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),
  SKILL_SOCIETY: newVariable('prof', 'SKILL_SOCIETY', {
    value: 'U',
    attribute: 'ATTRIBUTE_INT',
  }),
  SKILL_STEALTH: newVariable('prof', 'SKILL_STEALTH', {
    value: 'U',
    attribute: 'ATTRIBUTE_DEX',
  }),
  SKILL_SURVIVAL: newVariable('prof', 'SKILL_SURVIVAL', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),
  SKILL_THIEVERY: newVariable('prof', 'SKILL_THIEVERY', {
    value: 'U',
    attribute: 'ATTRIBUTE_DEX',
  }),
  SKILL_LORE____: newVariable('prof', 'SKILL_LORE____', {
    value: 'U',
    attribute: 'ATTRIBUTE_INT',
  }),

  SPELL_ATTACK: newVariable('prof', 'SPELL_ATTACK'), // TODO: add attribute
  SPELL_DC: newVariable('prof', 'SPELL_DC'), // TODO: add attribute
  CASTING_SOURCES: newVariable('list-str', 'CASTING_SOURCES'),
  SPELL_SLOTS: newVariable('list-str', 'SPELL_SLOTS'),

  LIGHT_ARMOR: newVariable('prof', 'LIGHT_ARMOR'),
  MEDIUM_ARMOR: newVariable('prof', 'MEDIUM_ARMOR'),
  HEAVY_ARMOR: newVariable('prof', 'HEAVY_ARMOR'),
  UNARMORED_DEFENSE: newVariable('prof', 'UNARMORED_DEFENSE'),

  SIMPLE_WEAPONS: newVariable('prof', 'SIMPLE_WEAPONS'),
  MARTIAL_WEAPONS: newVariable('prof', 'MARTIAL_WEAPONS'),
  ADVANCED_WEAPONS: newVariable('prof', 'ADVANCED_WEAPONS'),
  UNARMED_ATTACKS: newVariable('prof', 'UNARMED_ATTACKS'),

  PERCEPTION: newVariable('prof', 'PERCEPTION', {
    value: 'U',
    attribute: 'ATTRIBUTE_WIS',
  }),
  CLASS_DC: newVariable('prof', 'CLASS_DC'),
  LEVEL: newVariable('num', 'LEVEL'),
  SIZE: newVariable('str', 'SIZE'),
  CORE_LANGUAGE_NAMES: newVariable('list-str', 'CORE_LANGUAGE_NAMES'),
  //FOCUS_POINTS: newVariable('num', 'FOCUS_POINTS'),

  MAX_HEALTH_ANCESTRY: newVariable('num', 'MAX_HEALTH_ANCESTRY'),
  MAX_HEALTH_CLASS_PER_LEVEL: newVariable('num', 'MAX_HEALTH_CLASS_PER_LEVEL'),
  MAX_HEALTH_BONUS: newVariable('num', 'MAX_HEALTH_BONUS'),
  HEALTH: newVariable('num', 'HEALTH'),
  TEMP_HEALTH: newVariable('num', 'TEMP_HEALTH'),

  AC_BONUS: newVariable('num', 'AC_BONUS'),
  // AC: newVariable('num', 'AC'),
  // ARMOR_CHECK_PENALTY: newVariable('num', 'ARMOR_CHECK_PENALTY'),
  // ARMOR_SPEED_PENALTY: newVariable('num', 'ARMOR_SPEED_PENALTY'),
  // DEX_CAP: newVariable('num', 'DEX_CAP'),
  UNARMORED: newVariable('bool', 'UNARMORED'),

  SPEED: newVariable('num', 'SPEED'),
  SPEED_FLY: newVariable('num', 'SPEED_FLY'),
  SPEED_CLIMB: newVariable('num', 'SPEED_CLIMB'),
  SPEED_BURROW: newVariable('num', 'SPEED_BURROW'),
  SPEED_SWIM: newVariable('num', 'SPEED_SWIM'),

  // Senses // use <NAME>-30 to indicate a range
  SENSES_PRECISE: newVariable('list-str', 'SENSES_PRECISE', ['NORMAL_VISION']),
  SENSES_IMPRECISE: newVariable('list-str', 'SENSES_IMPRECISE', ['HEARING']),
  SENSES_VAGUE: newVariable('list-str', 'SENSES_VAGUE', ['SMELL']),

  // Resistances, Weaknesses, and Immunities // use <NAME>-30 to indicate an amount, TODO: can include variable math
  RESISTANCES: newVariable('list-str', 'RESISTANCES'),
  WEAKNESSES: newVariable('list-str', 'WEAKNESSES'),
  IMMUNITIES: newVariable('list-str', 'IMMUNITIES'),

  // List variables, just storing the names
  SENSE_NAMES: newVariable('list-str', 'SENSE_NAMES'),
  CLASS_NAMES: newVariable('list-str', 'CLASS_NAMES'),
  ANCESTRY_NAMES: newVariable('list-str', 'ANCESTRY_NAMES'),
  BACKGROUND_NAMES: newVariable('list-str', 'BACKGROUND_NAMES'),
  HERITAGE_NAMES: newVariable('list-str', 'HERITAGE_NAMES'),
  FEAT_NAMES: newVariable('list-str', 'FEAT_NAMES'),
  SPELL_NAMES: newVariable('list-str', 'SPELL_NAMES'),
  LANGUAGE_NAMES: newVariable('list-str', 'LANGUAGE_NAMES'),
  CLASS_FEATURE_NAMES: newVariable('list-str', 'CLASS_FEATURE_NAMES'),
  PHYSICAL_FEATURE_NAMES: newVariable('list-str', 'PHYSICAL_FEATURE_NAMES'),
  //
  // List variables, storing the IDs
  SENSE_IDS: newVariable('list-str', 'SENSE_IDS'),
  CLASS_IDS: newVariable('list-str', 'CLASS_IDS'),
  ANCESTRY_IDS: newVariable('list-str', 'ANCESTRY_IDS'),
  BACKGROUND_IDS: newVariable('list-str', 'BACKGROUND_IDS'),
  HERITAGE_IDS: newVariable('list-str', 'HERITAGE_IDS'),
  FEAT_IDS: newVariable('list-str', 'FEAT_IDS'),
  SPELL_IDS: newVariable('list-str', 'SPELL_IDS'),
  LANGUAGE_IDS: newVariable('list-str', 'LANGUAGE_IDS'),
  CLASS_FEATURE_IDS: newVariable('list-str', 'CLASS_FEATURE_IDS'),
  PHYSICAL_FEATURE_IDS: newVariable('list-str', 'PHYSICAL_FEATURE_IDS'),

  SPELL_DATA: newVariable('list-str', 'SPELL_DATA'),

  // BULK_LIMIT: newVariable("num", "BULK_LIMIT"),
  // INVEST_LIMIT: newVariable("num", "INVEST_LIMIT"),

  // ATTACKS: newVariable("num", "ATTACKS"),
  // ATTACKS_DMG_DICE: newVariable("str", "ATTACKS_DMG_DICE"),
  // ATTACKS_DMG_BONUS: newVariable("num", "ATTACKS_DMG_BONUS"),

  // MELEE_ATTACKS: newVariable("num", "MELEE_ATTACKS"),
  // MELEE_ATTACKS_DMG_DICE: newVariable("str", "MELEE_ATTACKS_DMG_DICE"),
  // MELEE_ATTACKS_DMG_BONUS: newVariable("num", "MELEE_ATTACKS_DMG_BONUS"),
  // AGILE_MELEE_ATTACKS_DMG_BONUS: newVariable("num", "AGILE_MELEE_ATTACKS_DMG_BONUS"),
  // NON_AGILE_MELEE_ATTACKS_DMG_BONUS: newVariable("num", "NON_AGILE_MELEE_ATTACKS_DMG_BONUS"),

  // RANGED_ATTACKS: newVariable("num", "RANGED_ATTACKS"),
  // RANGED_ATTACKS_DMG_DICE: newVariable("str", "RANGED_ATTACKS_DMG_DICE"),
  // RANGED_ATTACKS_DMG_BONUS: newVariable("num", "RANGED_ATTACKS_DMG_BONUS"),

  ATTACK_ROLLS_BONUS: newVariable('num', 'ATTACK_ROLLS_BONUS'),
  ATTACK_DAMAGE_BONUS: newVariable('num', 'ATTACK_DAMAGE_BONUS'),

  DEX_ATTACK_ROLLS_BONUS: newVariable('num', 'DEX_ATTACK_ROLLS_BONUS'),
  DEX_ATTACK_DAMAGE_BONUS: newVariable('num', 'DEX_ATTACK_DAMAGE_BONUS'),
  STR_ATTACK_ROLLS_BONUS: newVariable('num', 'STR_ATTACK_ROLLS_BONUS'),
  STR_ATTACK_DAMAGE_BONUS: newVariable('num', 'STR_ATTACK_DAMAGE_BONUS'),

  RANGED_ATTACK_ROLLS_BONUS: newVariable('num', 'RANGED_ATTACK_ROLLS_BONUS'),
  RANGED_ATTACK_DAMAGE_BONUS: newVariable('num', 'RANGED_ATTACK_DAMAGE_BONUS'),

  MELEE_ATTACK_ROLLS_BONUS: newVariable('num', 'MELEE_ATTACK_ROLLS_BONUS'),
  MELEE_ATTACK_DAMAGE_BONUS: newVariable('num', 'MELEE_ATTACK_DAMAGE_BONUS'),

  WEAPON_GROUP_AXE: newVariable('prof', 'WEAPON_GROUP_AXE'),
  WEAPON_GROUP_BOMB: newVariable('prof', 'WEAPON_GROUP_BOMB'),
  WEAPON_GROUP_BOW: newVariable('prof', 'WEAPON_GROUP_BOW'),
  WEAPON_GROUP_BRAWLING: newVariable('prof', 'WEAPON_GROUP_BRAWLING'),
  WEAPON_GROUP_CLUB: newVariable('prof', 'WEAPON_GROUP_CLUB'),
  WEAPON_GROUP_CROSSBOW: newVariable('prof', 'WEAPON_GROUP_CROSSBOW'),
  WEAPON_GROUP_DART: newVariable('prof', 'WEAPON_GROUP_DART'),
  WEAPON_GROUP_FLAIL: newVariable('prof', 'WEAPON_GROUP_FLAIL'),
  WEAPON_GROUP_HAMMER: newVariable('prof', 'WEAPON_GROUP_HAMMER'),
  WEAPON_GROUP_KNIFE: newVariable('prof', 'WEAPON_GROUP_KNIFE'),
  WEAPON_GROUP_PICK: newVariable('prof', 'WEAPON_GROUP_PICK'),
  WEAPON_GROUP_POLEARM: newVariable('prof', 'WEAPON_GROUP_POLEARM'),
  WEAPON_GROUP_SHIELD: newVariable('prof', 'WEAPON_GROUP_SHIELD'),
  WEAPON_GROUP_SLING: newVariable('prof', 'WEAPON_GROUP_SLING'),
  WEAPON_GROUP_SPEAR: newVariable('prof', 'WEAPON_GROUP_SPEAR'),
  WEAPON_GROUP_SWORD: newVariable('prof', 'WEAPON_GROUP_SWORD'),
  // WEAPON_GROUP____: newVariable('prof', 'WEAPON_GROUP____'),
  // WEAPON____: newVariable('prof', 'WEAPON____'),

  ARMOR_GROUP_CHAIN: newVariable('prof', 'ARMOR_GROUP_CHAIN'),
  ARMOR_GROUP_COMPOSITE: newVariable('prof', 'ARMOR_GROUP_COMPOSITE'),
  ARMOR_GROUP_LEATHER: newVariable('prof', 'ARMOR_GROUP_LEATHER'),
  ARMOR_GROUP_PLATE: newVariable('prof', 'ARMOR_GROUP_PLATE'),
  // ARMOR_GROUP____: newVariable('prof', 'ARMOR_GROUP____'),
  // ARMOR____: newVariable('prof', 'ARMOR____'),

  PAGE_CONTEXT: newVariable('str', 'PAGE_CONTEXT', 'OUTSIDE'),
  PRIMARY_BUILDER_TABS: newVariable('list-str', 'PRIMARY_BUILDER_TABS', [
    'skills-actions',
    'inventory',
    'feats-features',
    'details',
    'notes',
  ]),
};

const variableMap = new Map<string, VariableStore>();

// let variables = _.cloneDeep(DEFAULT_VARIABLES);
// let variableBonuses: Record<
//   string,
//   { value?: number; type?: string; text: string; source: string; timestamp: number }[]
// > = {};
// let variableHistory: Record<
//   string,
//   { to: VariableValue; from: VariableValue | null; source: string; timestamp: number }[]
// > = {};

// 2_status_
// +2 status bonus
// Map<string, { value?: number, type: string, text: string }[]>

function getVariableStore(id: StoreID) {
  if (!variableMap.has(id)) {
    variableMap.set(id, {
      variables: _.cloneDeep(DEFAULT_VARIABLES),
      bonuses: {},
      history: {},
    });
  }
  return variableMap.get(id)!;
}

/**
 * Gets all variables
 * @returns - all variables
 */
export function getVariables(id: StoreID) {
  return getVariableStore(id).variables;
}

/**
 * Gets a variable
 * @param name - name of the variable to get
 * @returns - the variable
 */
export function getVariable<T = Variable>(id: StoreID, name: string): T | null {
  return _.cloneDeep(getVariables(id)[name]) as T | null;
}

/**
 * Gets the bonuses for a variable
 * @param name - name of the variable to get
 * @returns - the bonus array
 */
export function getVariableBonuses(id: StoreID, name: string) {
  return _.cloneDeep(getVariableStore(id).bonuses[name]) ?? [];
}

export function addVariableBonus(
  id: StoreID,
  name: string,
  value: number | undefined,
  type: string | undefined,
  text: string,
  source: string
) {
  if (!getVariableStore(id).bonuses[name]) {
    getVariableStore(id).bonuses[name] = [];
  }
  getVariableStore(id).bonuses[name].push({
    value,
    type,
    text,
    source,
    timestamp: Date.now(),
  });
}

/**
 * Gets the history for a variable
 * @param name - name of the variable to get
 * @returns - the bonus array
 */
export function getVariableHistory(id: StoreID, name: string) {
  return _.cloneDeep(getVariableStore(id).history[name]) ?? [];
}

function addVariableHistory(
  id: StoreID,
  name: string,
  to: VariableValue,
  from: VariableValue,
  source: string
) {
  if (from === to) return;
  if (!getVariableStore(id).history[name]) {
    getVariableStore(id).history[name] = [];
  }
  getVariableStore(id).history[name].push({
    to: _.cloneDeep(to),
    from: _.cloneDeep(from),
    source,
    timestamp: Date.now(),
  });
}

/**
 * Adds a variable
 * @param type - type of the variable
 * @param name - name of the variable
 * @param defaultValue - optional, default value of the variable
 * @returns - the variable that was added
 */
export function addVariable(
  id: StoreID,
  type: VariableType,
  name: string,
  defaultValue?: VariableValue,
  source?: string
) {
  const variable = newVariable(type, name, defaultValue);
  getVariables(id)[variable.name] = variable;

  // Add to history
  //addVariableHistory(variable.name, variable.value, null, source ?? 'Created');

  return _.cloneDeep(variable);
}

/**
 * Removes a variable
 * @param name - name of the variable to remove
 */
export function removeVariable(id: StoreID, name: string) {
  delete getVariables(id)[name];
}

/**
 * Resets all variables to their default values
 */
export function resetVariables() {
  variableMap.clear();
}

/**
 * Sets a variable to a given value
 * @param name - name of the variable to set
 * @param value - VariableValue
 */
export function setVariable(id: StoreID, name: string, value: VariableValue, source?: string) {
  let variable = getVariables(id)[name];
  if (!variable) {
    throwError(`Invalid variable name: ${name}`);
  }
  const oldValue = _.cloneDeep(variable.value);

  if (!variable) throwError(`Invalid variable name: ${name}`);
  if (isVariableNum(variable) && _.isNumber(+value)) {
    variable.value = parseInt(`${value}`);
  } else if (isVariableStr(variable) && _.isString(value)) {
    variable.value = value;
  } else if (isVariableBool(variable) && _.isBoolean(value)) {
    variable.value = value;
  } else if (isVariableListStr(variable) && isListStr(value)) {
    if (_.isString(value)) {
      value = JSON.parse(value);
    }
    variable.value = _.uniq(value as string[]);
  } else if (isVariableAttr(variable) && isAttributeValue(value)) {
    variable.value.value = value.value;
    variable.value.partial = value.partial;
  } else if (isVariableProf(variable) && isProficiencyValue(value)) {
    if (isProficiencyType(value.value)) {
      variable.value.value = value.value;
    }
    if (value.attribute) {
      variable.value.attribute = value.attribute;
    }
  } else {
    throwError(`Invalid value for variable: ${name}, ${value}`);
  }

  // Add to history
  addVariableHistory(id, variable.name, variable.value, oldValue, source ?? 'Updated');
}

/**
 * Adjusts a variable by a given amount
 * @param name - name of the variable to adjust
 * @param amount - new value to adjust by
 */
export function adjVariable(id: StoreID, name: string, amount: VariableValue, source?: string) {
  let variable = getVariables(id)[name];
  if (!variable) {
    throwError(`Invalid variable name: ${name}`);
  }
  const oldValue = _.cloneDeep(variable.value);

  if (!variable) throwError(`Invalid variable name: ${name}`);
  if (isVariableProf(variable)) {
    if (isProficiencyValue(amount) || isExtendedProficiencyValue(amount)) {
      const { value, attribute } = amount;
      if (isProficiencyType(value)) {
        variable.value.value = maxProficiencyType(variable.value.value, value);
      } else if (isExtendedProficiencyType(value)) {
        if (value === '1') {
          variable.value.value = nextProficiencyType(variable.value.value) ?? variable.value.value;
        } else if (value === '-1') {
          variable.value.value = prevProficiencyType(variable.value.value) ?? variable.value.value;
        } else {
          throwError(`Invalid adjust amount for extended prof: ${name}, ${JSON.stringify(amount)}`);
        }
      }
      if (attribute) {
        variable.value.attribute = attribute;
      }
    } else {
      throwError(`Invalid adjust amount for prof: ${name}, ${JSON.stringify(amount)}`);
    }
  } else if (isVariableAttr(variable) && isAttributeValue(amount)) {
    if (_.isNumber(+amount.value)) {
      const value = parseInt(`${amount.value}`);
      if (value !== 0 && value !== 1 && value !== -1) {
        throwError(
          `Invalid variable adjustment amount for attribute: ${value} (must be 0, 1, or -1)`
        );
      }
      // Add boosts or flaws, use partial if it's a boost and value is 4+
      if (variable.value.value >= 4 && value === 1) {
        if (variable.value.partial) {
          variable.value.value += 1;
          variable.value.partial = false;
        } else {
          variable.value.partial = true;
        }
      } else {
        variable.value.value += value;
      }
    }
    if (amount.partial) {
      variable.value.partial = amount.partial;
    }
  } else if (isVariableNum(variable) && _.isNumber(+amount)) {
    variable.value += parseInt(`${amount}`);
  } else if (isVariableStr(variable) && _.isString(amount)) {
    variable.value += amount;
  } else if (isVariableBool(variable) && _.isBoolean(amount)) {
    variable.value = variable.value && amount;
  } else if (isVariableListStr(variable) && _.isString(amount)) {
    variable.value = _.uniq([...variable.value, amount]);
  } else {
    throwError(`Invalid adjust amount for variable: ${name}, ${JSON.stringify(amount)}`);
  }

  // Add to history
  addVariableHistory(id, variable.name, variable.value, oldValue, source ?? 'Adjusted');
}

export function getAllSkillVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (variable.name.startsWith('SKILL_') && variable.type === 'prof') {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllSaveVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (variable.name.startsWith('SAVE_') && variable.type === 'prof') {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllAttributeVariables(id: StoreID): VariableAttr[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (variable.name.startsWith('ATTRIBUTE_') && variable.type === 'attr') {
      variables.push(variable);
    }
  }
  return variables as VariableAttr[];
}

export function getAllWeaponGroupVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (variable.name.startsWith('WEAPON_GROUP_') && variable.type === 'prof') {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllArmorGroupVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (variable.name.startsWith('ARMOR_GROUP_') && variable.type === 'prof') {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllWeaponVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (
      variable.name.startsWith('WEAPON_') &&
      !variable.name.startsWith('WEAPON_GROUP_') &&
      variable.type === 'prof'
    ) {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllArmorVariables(id: StoreID): VariableProf[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (
      variable.name.startsWith('ARMOR_') &&
      !variable.name.startsWith('ARMOR_GROUP_') &&
      variable.type === 'prof'
    ) {
      variables.push(variable);
    }
  }
  return variables as VariableProf[];
}

export function getAllSpeedVariables(id: StoreID): VariableNum[] {
  const variables = [];
  for (const variable of Object.values(getVariables(id))) {
    if (
      (variable.name.startsWith('SPEED_') || variable.name === 'SPEED') &&
      variable.type === 'num'
    ) {
      variables.push(variable);
    }
  }
  return variables as VariableNum[];
}
