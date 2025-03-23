import * as _Decimal from './external packages/break_eternity.mjs';

const Decimal = _Decimal.default;
const DECIMALTYPE = new Decimal(0);
const zero = new Decimal(0);
const one = new Decimal(1);
window.DECIMAL = Decimal;

// CONSTANTS
const THEMES = ['theme-energy','theme-r1','theme-r2', 'theme-white','theme-brown'];
const TU_UPGRADES = {
  'QT-1': ['Quick Training', 'increases TU gain by 1 per 15 seconds', 1],
  'QT-2': ['Quicker Training', 'increases TU gain by another 1 per 15 seconds', 10],
  'QT-3': ['Quickest Training', 'Doubles TU gain', 100],
  'Ease-1': ['Easier Training', 'Halves Energy Drain of Training', 100],
  'Auto-Leg': ['Auto Leg Training', 'unlocks Automation for Leg Training', 5],
}
const INVESTABLE_IDs = {
  'Legs': 'Legs',
  'Arm': 'Arm',
  'Neck': 'Neck',
  'Shoulder': 'Shoulder',
  'UpperAbdomen': 'UpperAbdomen',
  'LowerAbdomen': 'LowerAbdomen',
  'Facial': 'Facial',
  'Chewing': 'Chewing',
}
/** [name, description, cost, weight] */
const TU_INVESTABLE = {
  [INVESTABLE_IDs.Legs]: ['', '', 1e2, 1],
  [INVESTABLE_IDs.Arm]: ['', '', 1e5, 1e5],
  [INVESTABLE_IDs.Neck]: ['', '', 1e8, 1e8],
  [INVESTABLE_IDs.Shoulder]: ['', '', 1, 0],
  [INVESTABLE_IDs.UpperAbdomen]: ['', '', 1, 0],
  [INVESTABLE_IDs.LowerAbdomen]: ['', '', 1, 0],
  [INVESTABLE_IDs.Facial]: ['', '', 1, 0],
  [INVESTABLE_IDs.Chewing]: ['', '', 1, 0],
}

const ENUMS = {
  Layer: {
    Adventure: 1,
    Research: 2,
    Settings: 'Settings',
    Stats: 'Stats'
  },
  Training: {
    r1: 0,
    r2: 1,
  },
  SubLayer: {
    Map: 1,
    City: 2,
  },
  CityPart: {
    CityMap: 0,
    Guild: 1,
    Blacksmith: 2,
    Marketplace: 3,
    TrainingGrounds: 4
  },
  Region: {
    Baracuda: 1,
    Concord: 2,
  },
  City: {
    Vermillion: 1, // city in Baracuda
    Steppen: 2, // city in Concord
  },
  Story: { // immer wenn sich states im Spiel ändern, muss ich einen neuen Eintrag einfügen
    Tutorial__Before_Popup: 0,
    Tutorial__After_Welcome: 1,
    Tutorial__After_City_Intro: 2,
    Tutorial__After_Guild_Intro: 3,
    Tutorial__After_TrainingGrounds_Intro: 4,
  },
  POPUP: {
    HIDE: 0,
    Chapter_0_intro: 1,
    Chapter_0_welcome_to_city: 2,
    Chapter_0_welcome_to_guild: 3,
    Chapter_0_welcome_to_training: 4,
  },
}
const TRANSLATIONS = {
  Ressource: {
    [ENUMS.Training.r1]: 'Strength',
    [ENUMS.Training.r2]: 'Intelligence',
  },
  CityPart: {
    [ENUMS.CityPart.CityMap]: 'City Map',
    [ENUMS.CityPart.Guild]: 'Guild',
    [ENUMS.CityPart.Blacksmith]: 'Blacksmith',
    [ENUMS.CityPart.Marketplace]: 'Marketplace',
    [ENUMS.CityPart.TrainingGrounds]: 'Training Grounds',
  },
  investables: {
    [INVESTABLE_IDs.Legs]: 'Leg',
    [INVESTABLE_IDs.Arm]: 'Arm',
    [INVESTABLE_IDs.Neck]: 'Neck',
    [INVESTABLE_IDs.Shoulder]: 'Shoulder',
    [INVESTABLE_IDs.UpperAbdomen]: 'Upper Abdomen',
    [INVESTABLE_IDs.LowerAbdomen]: 'Lower Abdomen',
    [INVESTABLE_IDs.Facial]: 'Facial',
    [INVESTABLE_IDs.Chewing]: 'Chewing',
  }
}
/**
 * Represents an object with a property and a set method.
 * @typedef {object} DataObject
 * @property {Game} game - game
 * @property {World} world - infos about the game world
 * @property {Player} player - player
 * @property {Ui} ui
 * @property {Settings} settings
 * @returns {void}
 */

const RegionTranslate = {
  [ENUMS.Region.Baracuda]: 'Baracuda',
  [ENUMS.Region.Concord]: 'Concord',
}
const CityTranslate = {
  [ENUMS.City.Vermillion]: 'Vermillion',
  [ENUMS.City.Steppen]: 'Steppen',
}
const DEVELOP_SAVEGAME = {
  game: {
    story_state: ENUMS.Story.Tutorial__After_Guild_Intro,
    body_vars: {
      unlockedR1: 1,
      unlockedR11: 1,
      leftSidebar: 1
    }
  },
  player: {
    energy: {
      current: 15,
    },
    r1: {
      training: {
        units: 0
      },
      tu_invest: [[INVESTABLE_IDs.Legs, 0]]
    },
    training_info: {
      max_parallel_trainings: 1,
      training_active: [0]
    }
  },
  world: {
    currentLayer: [
      ENUMS.Layer.Adventure,
      ENUMS.SubLayer.City,
      ENUMS.CityPart.CityMap
    ]
  }
};
const HTMLDivElement = document.createElement('div');
const HTMLButtonElement = document.createElement('button');
const HTMLParagraphElement = document.createElement('p');
const HTMLHeadingElement = document.createElement('h1');

// HELPER
/** src https://jsfiddle.net/Stelios2020/ukmf5304/6/ */
function download(content, mimeType, filename){
  const a = document.createElement('a');
  const blob = new Blob([content], {type: mimeType});
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}
async function animate(el, ms, [style, to]) {
  el.style.transition = style +' '+ ms+'ms';
  el.style[style] = to;
  return new Promise(resolve => { setTimeout(() => resolve(), ms)});
}
/**
 * 
 * @param {Array<HTMLElement>} elements html elements to update
 * @param {string} value value to assign to el.attribute
 * @param {string} attribute attribute chain on the element, nested attributes connected with "."
 */
function updateElements(elements, value, attribute) {
  if (value === undefined) return;

  elements.forEach(el => {
    const nestedKeys = attribute.split('.');
    const lastKey = nestedKeys.slice(-1)[0];
    let accessAttr = undefined;
    if (nestedKeys.length > 1) {
      nestedKeys.slice(0,-1).forEach(nestedKey => {
        accessAttr = !accessAttr ? el[nestedKey] : accessAttr[nestedKey];
      });
    }
    accessAttr ??= el;
    if (accessAttr[lastKey] !== value) {
      accessAttr[lastKey] = value;
    }
  });
}
function clickListener(el, fn, thisCtx) {
  el.addEventListener('click', ev => fn.call(thisCtx ?? window,ev));
}

function getSavegame() {
  const savegame = Settings.getLocalSave();
  // return savegame;
  return DEVELOP_SAVEGAME;
}

function id(s) { return document.getElementById(s) }
function q(s) { return document.querySelector(s) }
function all(s) { return Array.from(document.querySelectorAll(s)); }
function getDifferences(obj1 = {}, obj2 = {}) {
  const diff = {};
  let equal = true;
  for (const key in obj2) {
    if (Array.isArray(obj2[key])) {
      if (!Array.isArray(obj1[key]) || JSON.stringify(obj1[key].sort()) !== JSON.stringify(obj2[key].sort())) {
        diff[key] = obj2[key];
        equal = false;
      }
    } else if (typeof obj2[key] === 'object') {
      const nestedDiff = getDifferences(obj1[key], obj2[key]);
      if (nestedDiff) {
        diff[key] = nestedDiff;
        equal = false;
      }
    } else if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key];
      equal = false;
    }
  }
  return !Object.keys(diff).length ? null : diff;
}
/** @this {typeof DECIMALTYPE} */
DECIMALTYPE.constructor.prototype.p = function (precision = 2) {
  if (this.lt('0.'.padEnd(precision+1,'0')+'1') && this.gte(0)) return '0';
  return this.toString().replace(new RegExp(`(?<=\\.\\d{${precision}})\\d+`),'');
}

// disable right click
document.addEventListener("contextmenu", ev => ev.preventDefault());


class World {
  _currentRegionAndCity = [];
  get currentRegionAndCity() {
    return this._currentRegionAndCity;
  }
  set currentRegionAndCity(val) {
    let [newRegion, newCity] = val ?? [];
    const [currRegion, currCity] = this._currentRegionAndCity;
    newRegion = newRegion ?? currRegion ?? ENUMS.Region.Baracuda;
    newCity = newCity ?? currCity ?? ENUMS.City.Vermillion;
    if (currRegion !== newRegion) {
      // region change html
      const regionText = RegionTranslate[newRegion];
      all('[current_region_name]').forEach(el => el.textContent = regionText);
    }
    if (currCity !== newCity) {
      // city change html
      const cityText = CityTranslate[newCity];
      all('[current_city_name]').forEach(el => el.textContent = cityText);
    }
    this._currentRegionAndCity = [newRegion, newCity];
  }
  _currentLayer = [];
  set currentLayer(val) {
    let [newLayer, newSubLayer, newCitypart] = val ?? [];
    const [currLayer, currSubLayer, currCitypart] = this._currentLayer;
    newLayer = newLayer ?? currLayer ?? ENUMS.Layer.Adventure;
    newSubLayer = newSubLayer ?? currSubLayer ?? ENUMS.SubLayer.City;
    newCitypart = newCitypart ?? currCitypart ?? ENUMS.CityPart.CityMap;
    if (newLayer !== currLayer) {
      // change html layer attr
      DATA.ui.Elements.layerEl.dataset.showLayer = String(newLayer);
    }
    if (newSubLayer !== currSubLayer) {
      // change html subLayer attr
      DATA.ui.Elements.layerEl.dataset.showSubLayer = String(newSubLayer);
    }
    if (newCitypart !== currCitypart) {
      // change html cityPart attr
      DATA.ui.Elements.layerEl.dataset.currentCityPart = String(newCitypart);
      const cityPartText = TRANSLATIONS.CityPart[newCitypart];
      all('[current_city_part]').forEach(el => el.textContent = cityPartText);
    }

    this._currentLayer = [newLayer, newSubLayer, newCitypart];
  }
  get currentLayer() {
    return this._currentLayer;
  }

  constructor(worldSave = {}) {
    this.loadSave(worldSave);
  }

  getSaveData() {
    return {
      currentLayer: this.currentLayer,
      currentRegionAndCity: this.currentRegionAndCity
    }
  }

  loadSave(worldSave) {
    this.currentLayer = worldSave.currentLayer;
    this.currentRegionAndCity = worldSave.currentRegionAndCity;
  }
}

class Encryption {
  static encoder = new TextEncoder();
  static decoder = new TextDecoder();

  static decrypt_encrypted_string_to_object(jsonString) {
    const obj = JSON.parse(jsonString);
    const encryptedUint8Array = new Uint8Array(Object.values(obj));
    return JSON.parse(Encryption.decoder.decode(encryptedUint8Array));
  }
  /** @returns {string} */
  static encrypt_object_to_string(object) {
    const encryptedUint8Array = Encryption.encoder.encode(JSON.stringify(object))
    return JSON.stringify(encryptedUint8Array);
  }
}

class Settings {
  saveInterval = 30; // in seconds
  constructor(savegameSettings = {}) {
    this.loadFromSavegame(savegameSettings);
    this.initUiListeners();
  }

  getSaveData() {
    return {
      saveInterval: this.saveInterval
    };
  }

  loadFromSavegame(savegameSettings = {}) {
    this.saveInterval = savegameSettings.saveInterval ?? this.saveInterval;
  }
  
  initUiListeners() {
    q('[data-save-local]').addEventListener('click', Settings.saveLocal, this);
    clickListener(q('[data-download-savefile]'), Settings.downloadSavefile, this);
    q('[data-load-savefile]').addEventListener('change', Settings.askUserToSelectASavefile.bind(this));
  }

  static askUserToSelectASavefile(event) {
    const file = event.target.files[0];
    event.target.value = null;
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      Settings.loadFromSavefile(e.target.result);
    };
    reader.readAsText(file);
  }

  static get_current_gameData_as_encrypted_string() {
    const data = {
      world: DATA.world.getSaveData(),
      game: DATA.game.getSaveData(),
      ui: DATA.ui.getSaveData(),
      player: DATA.player.getSaveData(),
      settings: DATA.settings.getSaveData()
    }
    return Encryption.encrypt_object_to_string(data);
  }

  static loadFromSavefile(saveFileAsEncryptedString) {
    try {
      const savefile = Encryption.decrypt_encrypted_string_to_object(saveFileAsEncryptedString);
      DATA.world.loadSave(savefile.world);
      DATA.game.loadFromSavegame(savefile.game);
      DATA.ui.loadFromSavegame(savefile.ui);
      DATA.player.loadFromSavegame(savefile.player);
      DATA.settings.loadFromSavegame(savefile.settings);
    } catch (e) {
      console.error('Error while loading savefile:', e);
    }
  }

  static downloadSavefile() {
    const filename = 'incremental-adventure-__' + new Date().toLocaleString() + '.saveFile';
    download(Settings.get_current_gameData_as_encrypted_string(), 'text/plain', filename);
  }

  /** TODO: maybe change to indexeddb */
  static saveLocal() { localStorage.setItem('incremental-adventure-save', Settings.get_current_gameData_as_encrypted_string()); }
  static getLocalSave() {
    const save = localStorage.getItem('incremental-adventure-save');
    if (!save) return null;
    return Encryption.decrypt_encrypted_string_to_object(save);
  }
}

/**
 * An instance of ObjectName.
 * @type {DataObject}
 */
const DATA = {
  world: undefined,
  game: undefined,
  ui: undefined,
  player: undefined,
  settings: undefined
};

class Game {
  __game_loop_id = 0;
  story_state = -1;
  body_vars = Game.defaultBodyVars;
  _previousViewValues = {};
  _gameLoopCounter = 0;
  _tickspeed = 20;

  static defaultBodyVars = {
    unlockedR1: 0,
    unlockedR11: 0,
    unlockedR11Milestones: 0,
    unlockedR12: 0,
    unlockedR13: 0,
    unlockedR14: 0,
    unlockedR15: 0,
    unlockedR16: 0,
    unlockedR17: 0,
    unlockedR18: 0,
    unlockedR2: 0,
    unlockedAdventureTab: 1,
    unlockedTrainingTab: 1,
    unlockedF2: 0,
    unlockedEnergyTGTab:0,
    tutorialStep: 0,
    leftSidebar: 0
  }

  constructor(savegame = {}) {
    this.loadFromSavegame(savegame);
  }

  getSaveData() {
    return {
      story_state: this.story_state,
      body_vars: this.body_vars
    }
  }
  
  loadFromSavegame(savegame = {}) {
    this.story_state = savegame.story_state ?? ENUMS.Story.Tutorial__Before_Popup;
    if (typeof savegame.body_vars === 'object') this.body_vars = { ...Game.defaultBodyVars, ...savegame.body_vars };

    this.init();
  }
  
  init() {
    this.onChangeBodyVars();
    this.check_for_one_time_popups();
    this.init_game_loop();
  }

  onChangeBodyVars() {
    DATA.ui.onChange_bodyVars(this.body_vars);
  }

  check_for_one_time_popups() {
    if (this.story_state === ENUMS.Story.Tutorial__Before_Popup) {
      DATA.ui.popup.showPopup(ENUMS.POPUP.Chapter_0_intro);
    }
  }

  init_game_loop() {
    if (this.__game_loop_id) clearInterval(this.__game_loop_id);
    this._gameLoopCounter = 0;
    this.__game_loop_id = setInterval(this.gameLoop.bind(this), this._tickspeed);
  }

  /**
   * @example msTick(1000) // returns true every second
   *  @returns {boolean} true, when gametime has passed x milliseconds
   * */
  msTick(x) { return this._gameLoopCounter % Math.ceil(x/this._tickspeed) === 0; }
  gameLoop() {
    this._gameLoopCounter++;
    this.calcOnEveryTick();
    if (this.msTick(DATA.settings.saveInterval*1000)) Settings.saveLocal();



    // if (this.msTick(100)) { console.log(_gameLoopCounter/5,' 100ms have passed...'); } 
    // if (this.msTick(1000)) console.log(_gameLoopCounter/50,' seconds have passed...');
    // if (this.msTick(10000)) console.log('another 10 seconds have passed...');
  }
  calcOnEveryTick() {
    DATA.player.calculate(100);
    const curr = DATA.player.getCurrentViewValues();
    const diffObject = getDifferences(this._previousViewValues, curr);
    if (diffObject) {
      DATA.ui.updatePlayerValuesInView(diffObject);
      this._previousViewValues = curr;
    }
  }
}

class Player {
  /** @type {Choices} */
  choices;
  status = {
    training_info: {
      max_parallel_trainings: 1,
      training_active: [0,0]
    }
  }

  constructor(savegame = {}) {
    this.loadFromSavegame(savegame);
    this.init();
  }

  getSaveData() {
    return {
      choices: this.choices.getSaveData(),
      energy: this.energy.getSaveData(),
      r1: this.r1.getSaveData(),
      training_info: this.status.training_info
    };
  }

  loadFromSavegame(savegame) {
    this.choices = new Choices(savegame.choices);
    this.energy = new Energy(savegame.energy);
    this.r1 = new R1(savegame.r1);
    this.setTrainingStatus(savegame.training_info);
  }

  init() {
    // local init
  }

  setTrainingStatus(training_info = {}) {
    if (typeof training_info !== 'object') return;
    this.status.training_info = {
      ...this.status.training_info,
      ...training_info
    };
    this.updateTrainingButtonLabels();
  }

  updateTrainingButtonLabels() {
    this.status.training_info.training_active.forEach((nr, index) => {
      this.updateTrainingButtonLabel(index);
    });
  }

  updateTrainingButtonLabel(index) {
    const disable = false; // maybe add a disabled state in the future
    const isActive = !!this.status.training_info.training_active[index];
    let state = isActive ? 'start':'stop';
    const stateLabel = !isActive ? 'begin ':'stop ';
    if (disable) state = 'disable';
    const label = stateLabel + TRANSLATIONS.Ressource[index] + ' training';
    DATA.ui.changeTrainingStatusButton(index, state, label);
  }

  isAllowedToToggleTraining(index) {
    const info = this.status.training_info;
    const isActive = info.training_active[index];
    if (!isActive) {
      const total_active = Object.values(info.training_active).filter(value => !!value).length;
      const isAllowed = info.max_parallel_trainings > total_active;
      if (!isAllowed) {
        // inform user somehow that the action is not allowed // floating bubble notifications... or tooltip?
        console.log('you can\'t train more than '+info.max_parallel_trainings+' trainings at once');
        return false;
      }
    }
    return true;
  }

  toggleTraining(index) {
    if (!this.isAllowedToToggleTraining(index)) return;
    const training_active = this.status.training_info.training_active;
    training_active[index] = training_active[index] ? 0 : 1;
    this.updateTrainingButtonLabel(index);
  }

  calculate(milliseconds) {
    // change data based on time passed
    this.energy.calculate(milliseconds);
    this.r1.calculate(milliseconds);
  }

  getCurrentViewValues() {
    /**
     * TODO: add tu per sec, tu-bar
     */
    const tu_perSec = !this.r1.isTrainingActive() ? zero : this.r1.getTUperSec();
    const r1costPerSec = !this.r1.isTrainingActive() ? zero : this.r1.getTrainingCostPerSec();
    const energyPerSec = this.energy.getEnergyPerSec().minus(r1costPerSec);
    return {
      r1: {
        nextUnlockable: this.r1.nextUnlockable(),
        total: this.r1.getTotal().p(),
        tu: this.r1.training.units.p(),
        tu_perSec: tu_perSec.p(),
        tu_bar: this.r1.training.bar_progress.times(100).p(),
        purchaseable: Object.values(this.r1.tu_invest).filter(invest => invest.isPurchaseable).map(invest => invest.id),
        [INVESTABLE_IDs.Legs]: this.r1.tu_invest[INVESTABLE_IDs.Legs].bought.p(),
        [INVESTABLE_IDs.Arm]: this.r1.tu_invest[INVESTABLE_IDs.Arm].bought.p(),
        [INVESTABLE_IDs.Neck]: this.r1.tu_invest[INVESTABLE_IDs.Neck].bought.p(),
        [INVESTABLE_IDs.Shoulder]: this.r1.tu_invest[INVESTABLE_IDs.Shoulder].bought.p(),
        [INVESTABLE_IDs.UpperAbdomen]: this.r1.tu_invest[INVESTABLE_IDs.UpperAbdomen].bought.p(),
        [INVESTABLE_IDs.LowerAbdomen]: this.r1.tu_invest[INVESTABLE_IDs.LowerAbdomen].bought.p(),
        [INVESTABLE_IDs.Facial]: this.r1.tu_invest[INVESTABLE_IDs.Facial].bought.p(),
        [INVESTABLE_IDs.Chewing]: this.r1.tu_invest[INVESTABLE_IDs.Chewing].bought.p(),
        investable_cost: {
          [INVESTABLE_IDs.Legs]: this.r1.tu_invest[INVESTABLE_IDs.Legs].cost,
          [INVESTABLE_IDs.Arm]: this.r1.tu_invest[INVESTABLE_IDs.Arm].cost,
          [INVESTABLE_IDs.Neck]: this.r1.tu_invest[INVESTABLE_IDs.Neck].cost,
          [INVESTABLE_IDs.Shoulder]: this.r1.tu_invest[INVESTABLE_IDs.Shoulder].cost,
          [INVESTABLE_IDs.UpperAbdomen]: this.r1.tu_invest[INVESTABLE_IDs.UpperAbdomen].cost,
          [INVESTABLE_IDs.LowerAbdomen]: this.r1.tu_invest[INVESTABLE_IDs.LowerAbdomen].cost,
          [INVESTABLE_IDs.Facial]: this.r1.tu_invest[INVESTABLE_IDs.Facial].cost,
          [INVESTABLE_IDs.Chewing]: this.r1.tu_invest[INVESTABLE_IDs.Chewing].cost,
        },
        milestoneInfo: Object.fromEntries(Object.values(this.r1.tu_invest).map(i => 
          [i.id, i.getMilestoneInfoForUi]
        )),
      },
      energy: {
        max: this.energy.max.p(),
        current: this.energy.current.p(),
        perSec: energyPerSec.p(),
        bar: this.energy.current.div(this.energy.max).times(100).p()
      }
    };
  }
}

class R1 {
  static DEFAULTS = {
    BASE: 1,
    TRAINING: {
      UNITS: 0,
      UNITS_PER_SEC: 10/100,
      COST_PER_SEC: 15/100
    }
  }

  /**
   * Upgrades for Training Units, which can be bought with R1 Upgrade Points
   */
  tu_upgrades = Object.fromEntries(Object.entries(TU_UPGRADES).map(([id, [name, description, cost, effect]]) => [id,new TUUpgrade(id, name, description, cost, effect)]));
  tu_invest = Object.fromEntries(Object.entries(TU_INVESTABLE).map(([id, [name, description, cost, weight]]) => [id,new TUInvest(id, name, description, cost, weight)]));

  base = DECIMALTYPE;
  training = {
    units: DECIMALTYPE,
    bar_progress: DECIMALTYPE,
    units_per_sec: DECIMALTYPE,
    cost_per_sec: DECIMALTYPE,
  };

  unlockableIndex = -1;
  unlockables = [
    { uiText: 'Reach 100 Leg Muscle Mass' },
  ]

  constructor(savegameR1 = {}) {
    this.loadFromSavegame(savegameR1);
    this.init();
  }

  /** @returns {DECIMALTYPE} */
  getTotal() {
    let total = new Decimal(0);
    Object.values(this.tu_invest).forEach(invest => {
      total = total.plus(invest.bought.times(invest.weight));
    });
    return this.base.plus(total);
  }

  nextUnlockable() {
    return this.unlockables[this.unlockableIndex+1]?.uiText ?? 'successfully unlocked all unlockables';
  }

  getSaveData() {
    return {
      training: {
        units: this.training.units.toString(),
      },
      unlockableIndex: this.unlockableIndex,
      tu_upgrades: Object.values(this.tu_upgrades).filter(upg => upg.isUnlocked).map(upg => upg.id),
      tu_invest: Object.values(this.tu_invest).map((invest) => [invest.id, invest.bought.p()]),
    }
  }

  /** @param {{tu_upgrades?: string[], tu_invest?:[string, number][]}} savegameR1 */
  loadFromSavegame(savegameR1 = {}) {
    this.unlockableIndex = savegameR1.unlockableIndex ?? -1;
    this.training.units = new Decimal(savegameR1.training?.units ?? R1.DEFAULTS.TRAINING.UNITS);
    this.training.bar_progress = new Decimal(savegameR1.training?.bar_progress ?? 0);
    // purchaseable upgrades
    Object.values(this.tu_invest).forEach(invest => {
      invest.isPurchaseable = this.training.units.gte(invest.cost)
    });
    if (savegameR1.tu_upgrades) {
      savegameR1.tu_upgrades.forEach((upgradeId) => {
        this.tu_upgrades[upgradeId].isUnlocked = true;
      });
    }
    if (savegameR1.tu_invest) {
      savegameR1.tu_invest.forEach(([upgradeId, bought]) => {
        const invest = this.tu_invest[upgradeId];
        invest.bought = new Decimal(bought);
      });
    }
  }

  init() {
    /** calculated, not saved to savegame */
    this.training.units_per_sec = new Decimal(R1.DEFAULTS.TRAINING.UNITS_PER_SEC);
    this.training.cost_per_sec = new Decimal(R1.DEFAULTS.TRAINING.COST_PER_SEC);
    this.base = new Decimal(R1.DEFAULTS.BASE);
  }

  getTrainingCostPerSec() {
    let cost = this.training.cost_per_sec;
    if (this.tu_upgrades['Ease-1'].isUnlocked) cost = cost.div(2);
    return cost;
  }

  minEffectiveness = new Decimal(0.01);
  trainingUnitStrain(tu, start = 10, upperLimit = 100, minEffectiveness = this.minEffectiveness, decayRate = 90) {
    return tu.lte(start) ? one :
           tu.lt(upperLimit) ? one.minus(tu.minus(start).div(decayRate).pow(2)) :
           minEffectiveness;
  }

  getTUperSec() {
    let tu_per_sec = this.training.units_per_sec;
    if (this.tu_upgrades['QT-1'].isUnlocked) tu_per_sec = tu_per_sec.plus(1/15);
    if (this.tu_upgrades['QT-2'].isUnlocked) tu_per_sec = tu_per_sec.plus(1/15);
    if (this.tu_upgrades['QT-3'].isUnlocked) tu_per_sec = tu_per_sec.times(2);

    // tu amount causes further tu gain to take more time = strain
    tu_per_sec = this.training.units_per_sec.times(this.trainingUnitStrain(this.training.units));

    return tu_per_sec;
  }

  calculate(milliseconds) {
    this.calculateTrainingEffectFor(milliseconds);
  }

  calculateTrainingEffectFor(milliseconds) {
    const isTrainingActive = this.isTrainingActive();
    if (!isTrainingActive) return;

    const energyCost = this.getTrainingCostPerSec().times(milliseconds/1000);
    const energy = DATA.player.energy;
    if (energy.current.gte(energyCost)) {
      // calc current energy - based on training cost
      energy.current = energy.current.minus(energyCost);

      // calc training units and bar progress
      this.training.bar_progress = this.training.bar_progress.plus(this.getTUperSec().times(milliseconds/1000));
      if (this.training.bar_progress.gte(1)) {
        const wholeNumberPart = this.training.bar_progress.floor();
        this.training.units = this.training.units.plus(wholeNumberPart);
        this.training.bar_progress = this.training.bar_progress.minus(wholeNumberPart);

        this.calculateEffectOfUnitGain();
      }
    } else {
      // not enough energy, stop training
      DATA.player.toggleTraining(ENUMS.Training.r1);
      DATA.ui.popup.notify(`⚡ out of energy ⚡

Trainings stopped`, 'theme-energy')
    }
  }

  calculateEffectOfUnitGain() {
    // calc if tu-invest buttons have become purchaseable after tu change
    this.tu_invest.Legs.isPurchaseable = this.training.units.gte(this.tu_invest.Legs.cost);
  }

  isTrainingActive() {
    return DATA.player.status.training_info.training_active[ENUMS.Training.r1];
  }
}

class Upgrade {
  isUnlocked = false;
  name = '';
  description = '';
  cost = 0;

  constructor(id, name, description, cost) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
  }
}
class TUInvest extends Upgrade {
  isPurchaseable = false;
  milestonesUnlocked = false; // TODO: At some point need to unlock milestones connect to r1
  baseWeight = DECIMALTYPE;
  get weight() {
    return this.baseWeight.times(this.currentMilestoneMulti);
  };
  /** immer wenn bought geändert wird, brauch ich den milestone check, daher getter/setter */
  _bought;
  get bought() { return this._bought ?? new Decimal(0) }
  set bought(val) {
    this._bought = val;
    this.newMilestoneReachedCheck();
  }

  /** @type {{ requirement: string, effect: string, reached: boolean }[]} */
  get getMilestoneInfoForUi() {
    const uiInfo = [];
    this.milestones.forEach(([requirement, effect], index) => {
      uiInfo.push({
        requirement: 'Reach a Leg Muscle Mass of ' + new Decimal(requirement).p(),
        effect: 'increases the multiplier to x' + effect,
        reached: index <= this.currentMilestoneIndex
      });
    });
    return uiInfo
  }

  /** [unlocked at, effective multiplier] */
  milestones = [[1,1], [10,2], [10**2,3], [10**4,4], [10**8,5], [10**16,6], [10**32,7], [10**64,8]];
  currentMilestoneMulti = 1; // could be linear increase or multiplied, thats why its seperated from index
  currentMilestoneIndex = 0;

  constructor(id, name, description, cost, baseWeight) {
    super(id, name, description, cost);
    this.baseWeight = new Decimal(baseWeight);
  }

  purchase() {
    if (DATA.player.r1.training.units.lt(this.cost)) return;

    DATA.player.r1.training.units = DATA.player.r1.training.units.minus(this.cost);
    this.isPurchaseable = DATA.player.r1.training.units.gte(this.cost);
    this.bought = this.bought.plus(1);

    this.checkEffectOfPurchase();
  }

  checkEffectOfPurchase() {
    this.checkIfSomethingUnlocked();
  }

  checkIfSomethingUnlocked() {
    switch(this.id) {
      case INVESTABLE_IDs.Legs: return this.checkLegUnlock();
    }
  }

  checkLegUnlock()  {
    if (DATA.player.r1.unlockableIndex !== -1) return;
    const conditionFulfilled = this.bought.gte(100);
    if (!conditionFulfilled) return;
    DATA.player.r1.unlockableIndex++;
    DATA.game.body_vars.unlockedR12 = 1;
    DATA.game.onChangeBodyVars();
    DATA.ui.popup.achievementNotify(0);
  }

  newMilestoneReachedCheck() {
    if (!this.milestonesUnlocked) return;
    let index = 0;
    this.milestones.forEach(([ms],i) => {
      if (this.bought.gte(ms)) index = i;
      else return;
    });
    this.currentMilestoneMulti = this.milestones[index][1];
    this.currentMilestoneIndex = index;
  }
}

class TUUpgrade extends Upgrade {
  isUnlocked = false;

  constructor(id, name, description, cost) {
    super(id, name, description, cost);
  }
}

class Energy {
  static DEFAULT_MAX = 15;
  static DEFAULT_REGEN = 5/100; // per sec

  /** @type {typeof DECIMALTYPE} */
  max; regen_per_second; current;

  constructor(savegameEnergy = {}) {
    this.loadFromSavegame(savegameEnergy);
    this.init();
  }

  getSaveData() {
    return {
      max: this.max.toString(),
      regen_per_second: this.regen_per_second.toString(),
      current: this.current.toString()
    }
  }

  getEnergyPerSec() {
    // future: apply boosts or something
    return this.regen_per_second;
  }

  loadFromSavegame(savegameEnergy) {
    this.current = new Decimal(savegameEnergy.current ?? Energy.DEFAULT_MAX);
  }

  init() {
    // vars that are static, and will not be saved in savegame
    this.max = new Decimal(Energy.DEFAULT_MAX);
    this.regen_per_second = new Decimal(Energy.DEFAULT_REGEN);
  }

  calculate(milliseconds) {
    this.current = this.current.plus(this.getEnergyPerSec().times(milliseconds/1000));
    if (this.current.gte(this.max)) this.current = this.max;
  }
}

class Choices {
  motivation = -1;
  constructor(choicesSavegame = {}) {
    this.loadFromSavegame(choicesSavegame);
    this.init();
  }

  getSaveData() {
    return { motivation: this.motivation };
  }

  loadFromSavegame(choicesSavegame) {
    if (Number.isInteger(choicesSavegame.motivation)) this.motivation = choicesSavegame.motivation;
  }

  init() {
    // console.log('Choices initialized'); 
  }
}

class Ui {
  popup = new Popup();
  Elements = {
    layerEl: HTMLDivElement,
    r1: {
      nextUnlockableEl: HTMLDivElement,
      base: [HTMLDivElement],
      tu: [HTMLDivElement],
      tu_perSec: [HTMLDivElement],
      tu_bar: [HTMLDivElement],
      investables: {
        [INVESTABLE_IDs.Legs]: {
          purchase_btn: HTMLDivElement,
          purchase_btn__label: HTMLDivElement,
          purchase_btn__cost: HTMLDivElement,
          /**[ms, req, effect] */
          milestones: [HTMLDivElement, HTMLDivElement,HTMLDivElement],
        }
      },
      investablesBought: {}
    },
    energy: {
      max: [HTMLDivElement],
      current: [HTMLDivElement],
      perSec: [HTMLDivElement],
      bar: [HTMLDivElement]
    },
    trainingButtons: {
      [ENUMS.Training.r1]: HTMLDivElement,
      [ENUMS.Training.r2]: HTMLDivElement,
    },
  }

  constructor(savegameUi = {}) {
    this.loadFromSavegame(savegameUi);
    this.initLocalVars();
    this.initUiListeners();
  }

  loadFromSavegame(savegameUi = {}) {
    // init local vars with savegame vars
  }

  getSaveData() {
    return {};
  }

  initLocalVars() {
    this.Elements.layerEl = id('layer');
    this.Elements.trainingButtons[ENUMS.Training.r1] = id('begin_training_r1');
    this.Elements.trainingButtons[ENUMS.Training.r2] = id('begin_training_r2');
    this.Elements.r1.total = all('[data-strength-total]');
    this.Elements.r1.tu = all('[data-r1-tu]');
    this.Elements.r1.tu_bar = all('[data-r1-tu-bar]');
    this.Elements.r1.tu_perSec = all('[data-r1-tu-per-sec]');
    this.Elements.r1.nextUnlockableEl = q('[data-next-r1-tui]');
    all('[data-r1-investable]').forEach(el => {
      const id = el.dataset.r1Investable;
      const purchase_btn = q('[data-r1-investable='+id+'] [data-purchase]');
      const milestones = [];
      const requirements = all('[data-r1-investable='+id+'] [data-milestone-requirement]');
      const effects = all('[data-r1-investable='+id+'] [data-milestone-effect]');
      const milestoneEls = all('[data-r1-investable='+id+'] [data-milestone]');
      milestoneEls.forEach((ms,index) => {
        milestones.push([ms,requirements[index],effects[index]]);
      });
      this.Elements.r1.investables[id] = {
        purchase_btn: purchase_btn,
        purchase_btn__label: q('[data-r1-investable='+id+'] [data-label]'),
        purchase_btn__cost: q('[data-r1-investable='+id+'] [data-cost]'),
        milestones
      };
      clickListener(purchase_btn, () => DATA.player.r1.tu_invest[id].purchase(), this);
    });
    all('[data-r1-investable-bought]').forEach(el => {
      const id = el.dataset.r1InvestableBought;
      if (this.Elements.r1.investablesBought[id]) {
        this.Elements.r1.investablesBought[id].push(el);
      } else {
        this.Elements.r1.investablesBought[id] = [el];
      }
    });
    this.Elements.energy.max = all('[data-energy-max]');
    this.Elements.energy.current = all('[data-energy-current]');
    this.Elements.energy.perSec = all('[data-energy-per-sec]');
    this.Elements.energy.bar = all('[data-energy-bar]');
  }

  updatePlayerValuesInView(valueDiff) {
    Object.entries(valueDiff).forEach(([key, value]) => {
      switch(key) {
        case 'r1': {
          updateElements([this.Elements.r1.nextUnlockableEl], value.nextUnlockable, 'textContent');
          updateElements(this.Elements.r1.total, value.total, 'textContent');
          updateElements(this.Elements.r1.tu, value.tu, 'textContent');
          updateElements(this.Elements.r1.tu_perSec, value.tu_perSec, 'textContent');
          updateElements(this.Elements.r1.tu_bar, value.tu_bar+'%', 'style.width');
          if (value.purchaseable) {
            const valSet = new Set(value.purchaseable);
            Object.entries(this.Elements.r1.investables).forEach(([id, {purchase_btn:el}]) => {
              if (valSet.has(id)) {
                el.classList.remove('not-allowed','theme-grey');
              } else {
                el.classList.add('not-allowed','theme-grey');
              }
            });
          }
          if (value.investable_cost) {
            Object.entries(this.Elements.r1.investables).forEach(([id, { purchase_btn__label, purchase_btn__cost }]) => {
              if (!value.investable_cost[id]) return;
              purchase_btn__label.textContent = TRANSLATIONS.investables[id] + ' Muscles';
              purchase_btn__cost.textContent = value.investable_cost[id];
            });
          }
          if (value.milestoneInfo) {
            Object.entries(this.Elements.r1.investables).forEach(([id, el]) => {
              if (!value.milestoneInfo[id]) return;
              el.milestones.forEach(([milestone, requirementEl, effectEl], index) => {
                if (!milestone) return console.error('milestone Element in HTML missing');
                const { requirement, effect, reached } = value.milestoneInfo[id][index]
                updateElements([requirementEl], requirement, 'textContent');
                updateElements([effectEl], effect, 'textContent');
                if (reached) milestone.classList.remove('theme-grey');
                else milestone.classList.add('theme-grey');
                
              });
            });
          }
          updateElements(this.Elements.r1.investablesBought.Legs, value.Legs, 'textContent');
          break;
        }
        case 'energy': {
          updateElements(this.Elements.energy.max, value.max, 'textContent');
          updateElements(this.Elements.energy.current, value.current, 'textContent');
          updateElements(this.Elements.energy.perSec, value.perSec, 'textContent');
          updateElements(this.Elements.energy.bar, value.bar+'%', 'style.width');
          break;
        }
      }
    });
  }

  /** @param {Game.defaultBodyVars} body_vars */
  onChange_bodyVars(body_vars) {
    if (typeof body_vars !== 'object') throw Error('body_vars type mismatch');
    Object.entries(body_vars).forEach(([key, value]) => {
      document.body.dataset[key] = value;
    });
    const a = new Decimal();
    a.abs;
  }

  initUiListeners() {
    // Layer Nav
    clickListener(id('navigate_to_1'), () => this.selectLayer(ENUMS.Layer.Adventure), this); // adventure Layer
    clickListener(id('navigate_to_2'), () => this.selectLayer(ENUMS.Layer.Research), this); // research Layer
    clickListener(id('navigate_to_Stats'), () => this.selectLayer(ENUMS.Layer.Stats), this); // settings Layer
    clickListener(id('navigate_to_Settings'), () => this.selectLayer(ENUMS.Layer.Settings), this); // settings Layer
    clickListener(id('nav_to_11'), () => this.selectLayer(ENUMS.Layer.Adventure, ENUMS.SubLayer.Map), this); // map, inside of adventure Layer
    clickListener(id('nav_to_12'), this.onPressCity, this); // city, inside of map
    
    // city Nav
    clickListener(id('nav_to_city_0'), () => this.selectCityPart(ENUMS.CityPart.CityMap), this); // city-map, inside of city
    clickListener(id('nav_to_city_1'), this.onPressGuild, this); // guild, inside of city
    clickListener(id('nav_to_city_2'), () => this.selectCityPart(ENUMS.CityPart.Blacksmith), this); // Blacksmith, inside of city
    clickListener(id('nav_to_city_3'), () => this.selectCityPart(ENUMS.CityPart.Marketplace), this); // Marketplace, inside of city
    clickListener(this.Elements.trainingButtons[ENUMS.Training.r1], () => DATA.player.toggleTraining(ENUMS.Training.r1), this);


  }

  changeTrainingStatusButton(index, state, label) {
    const btn = this.Elements.trainingButtons[index];
    const labelEl = btn.querySelector('label');
    if (labelEl) labelEl.textContent = label;
    else btn.textContent = label;
    btn.classList.remove('disabled');
    switch(state) {
      case 'start': return btn.classList.add('in-training');
      case 'stop': return btn.classList.remove('in-training');
      case 'disable': return btn.classList.add('disabled');
    }
  }

  selectCityPart(part) {
    this.selectLayer(ENUMS.Layer.Adventure, ENUMS.SubLayer.City, part);
  }

  onPressCity() {
    if (DATA.game.story_state === ENUMS.Story.Tutorial__After_Welcome) DATA.ui.popup.showPopup(ENUMS.POPUP.Chapter_0_welcome_to_city);
    this.selectCityPart(ENUMS.CityPart.CityMap);
  }

  onPressGuild() {
    if (DATA.game.story_state === ENUMS.Story.Tutorial__After_City_Intro) DATA.ui.popup.showPopup(ENUMS.POPUP.Chapter_0_welcome_to_guild);
    this.selectCityPart(ENUMS.CityPart.Guild);
  }
  
  selectLayer(layer, sublayer = ENUMS.SubLayer.Map, cityPart = ENUMS.CityPart.CityMap) {
    DATA.world.currentLayer = [layer, sublayer, cityPart];
  }
}

class Popup {
  // popup Elements
  popup_title_container = HTMLDivElement; popupElement = HTMLDivElement; popup_actions = HTMLDivElement;
  popup_paragraph = HTMLParagraphElement;
  popup_title = HTMLHeadingElement; 

  // notification Elements
  notificationContainer = HTMLDivElement;
  notificationEls = [HTMLDivElement];

  // Achievement Elements
  achievementEl = [HTMLDivElement];

  // PopupState
  currentState = [ENUMS.POPUP.HIDE, ENUMS.POPUP.HIDE];

  constructor() {
    this.popupElement = id('popup');
    this.popup_title_container = id('popup_title_container');
    this.popup_title = id('popup_title');
    this.popup_paragraph = id('popup_paragraph');
    this.popup_actions = id('popup_actions');
    this.notificationContainer = id('notification-container');
    this.notificationEls = all('.notification');
    this.achievementEl = [id('achievements'), q('#achievements [data-achievement-title]'), q('#achievements .body')];
    this.achievementEl[0].addEventListener('click', () => this.achievementEl[0].classList.add('d-none'));
    Array.from(this.popup_actions.querySelectorAll('.action-button')).forEach((btn, index) => {
      clickListener(btn, ev => this.actionButtonPressed(index, btn), this);
    });
    this.initNotifyQueueChecker();
    let test_number = 1;
    clickListener(id('test_notification'), () => {this.notify('test #'+test_number++)}, this);
  }

  currentVisibleNotifications = [];
  notifyQueue = [];
  lastElementUsedIndex = 0;
  notify(text, theme) { this.notifyQueue.push([text, theme]); }
  initNotifyQueueChecker() { setInterval(() => this.checkNotifyQueue(), 100); }
  checkNotifyQueue() {
    if (!this.notifyQueue.length) return;
    if (this.currentVisibleNotifications.length >= 4) return;
    const [nextNotification, theme] = this.notifyQueue.splice(0, 1)[0];
    this.currentVisibleNotifications.push(nextNotification);
    const nextNotificationElement = this.notificationEls[this.lastElementUsedIndex];
    this.removeThemes(nextNotificationElement);
    this.addTheme(nextNotificationElement, theme ?? 'theme-white');
    this.lastElementUsedIndex = this.lastElementUsedIndex === 3 ? 0 : this.lastElementUsedIndex+1;
    console.log(nextNotificationElement.id);
    nextNotificationElement.textContent = nextNotification;
    const [style, to, from] = ['opacity', '0', '1'];
    nextNotificationElement.classList.remove('d-none'); // turn visible
    setTimeout(() => {
      animate(nextNotificationElement, 1000, [style, to]).then(() => {
        nextNotificationElement.classList.add('d-none');
        this.currentVisibleNotifications.splice(0,1);
        nextNotificationElement.style[style] = from;
      });
    },5000);
  }

  addTheme(el, theme) { el.classList.add(theme); }
  removeThemes(el) { el.classList.remove(...THEMES) }

  achievements = [
    new Achievement('Never skip Leg Day!','Reach 100 Leg Muscle Mass'),
  ]
  achievementNotify(nr) {
    updateElements([this.achievementEl[1]],this.achievements[nr].title,'textContent');
    updateElements([this.achievementEl[2]],this.achievements[nr].body,'textContent');
    this.achievementEl[0].classList.remove('d-none');
  }

  actionButtonPressed(btnIndex, btn) {
    const [nr, subNr] = this.currentState;
    this.options[nr][subNr].actions[btnIndex].action.call(this);
  }

  options = {
    [ENUMS.POPUP.Chapter_0_intro]: { // Beginning of the game
      title: 'Chapter 0 - Becoming an Adventurer!',
      0: {
        text: 'Hello there!',
        actions: [ { text: 'Me...?', action: this.continueState } ]
      },
      1: {
        text: "Yes you! You want to be an adventurer, isn't that right?",
        actions: [ { text: 'Yeah...', action: this.continueState } ]
      },
      2: {
        text: "So you don't want to be a farmer like your parents?",
        actions: [ { text: 'No!', action: this.continueState } ]
      },
      3: {
        text: "So tell me, what is your motivation? What are you looking for?",
        preText: 'I want to',
        actions: [
          { text: 'be rich!', action: () => this.motivationChoice(1) },
          { text: 'be strong!', action: () => this.motivationChoice(2) },
          { text: 'find friends!', action: () => this.motivationChoice(3) },
          { text: 'learn new things!', action: () => this.motivationChoice(4) },
        ]
      },
      4: {
        text: "Alright!\n\n\nLet's not waste any more time, and head out there!\nFirst Stop: "+CityTranslate[ENUMS.City.Vermillion]+", the closest city in the region of "+RegionTranslate[ENUMS.Region.Baracuda]+".",
        actions: [ { text: 'Lets go!', action: this.endState } ]
      }
    },
    [ENUMS.POPUP.Chapter_0_welcome_to_city]: { // entering the city
      0: {
        text: 'you just entered '+CityTranslate[ENUMS.City.Vermillion]+'. It\'s a small city, but offers everything one might need.\nThe local adventurer guild outpost, might be small, but that should not matter to you.\nYou should go there right away, and ask to join.',
        actions: [ { text: 'Could it really be that easy?...', action: this.endState } ]
      }
    },
    [ENUMS.POPUP.Chapter_0_welcome_to_guild]: { // entering the guild
      0: {
        text: () => 'upon entering the guild, you are greeted by the receptionist.\n\n"Hey there, welcome to the adventurer guild of '+CityTranslate[ENUMS.City.Vermillion]+'!\nHow may i be of service?"',
        actions: [ { text: "I'd like to register as an adventurer", action: this.continueState } ]
      },
      1: {
        text: () => '"Sure! We are always looking for new recruits.\nYou just need to pass the entry exam. We don\'t want to put unfit contenders into danger, so we need to ensure, you can defend yourself."',
        actions: [ { text: "Sign me up then", action: this.continueState } ]
      },
      2: {
        text: () => '"Just head over to the trainings ground and talk with the training officer.\nHe will help you prepare for the exam, in case you don\'t meet the physical requirements yet."',
        actions: [ { text: "I'll head over there right away, thank you very much.", action: this.endState } ]
      }
    },
    [ENUMS.POPUP.Chapter_0_welcome_to_training]: { // entering the training grounds
      0: {
        text: "you arrive at the guild's training grounds. The guild's training officer approaches.\n\n\"You look puny, you've come to the right place to improve your weak physique.\"",
        actions: [ { text: "That was unnecessarily mean...", action: this.continueState } ]
      },
      1: {
        text: '"Haha", the old man laughs out loud, "No harm intended. I apologize. You can go over there and begin with some basic exercises."',
        actions: [ { text: "Lead the way, old man.", action: this.endState } ]
      },
    },
  }

  motivationChoice(nr) {
    DATA.player.choice.motivation = nr;
    this.continueState();
  }

  continueState() {
    this.currentState[1]++;
    this.fill(...this.currentState);
  }

  endState() {
    switch(this.currentState[0]) {
      case 1:
        DATA.game.story_state = ENUMS.Story.Tutorial__After_Welcome;
        break;
      case 2:
        DATA.game.story_state = ENUMS.Story.Tutorial__After_City_Intro;
        break;
      case 3:
        DATA.game.story_state = ENUMS.Story.Tutorial__After_Guild_Intro;
        break;
      case 4:
        DATA.game.story_state = ENUMS.Story.Tutorial__After_TrainingGrounds_Intro;
        break;
      default: throw Error('missing EndState');
    }
    this.closePopup();
  }

  showPopup(nr) {
    this.popupElement.classList.remove('hidden-i');
    this.fill(nr, 0);
  }

  fill(nr, subNr) {
    this.currentState = [nr, subNr];
    if (this.options[nr].title) {
      this.popup_title_container.classList.remove('hidden-i');
      this.popup_title.textContent = this.options[nr].title;
    } else {
      this.popup_title_container.classList.add('hidden-i');
    }
    const text = typeof this.options[nr][subNr].text === 'function' ? this.options[nr][subNr].text() : this.options[nr][subNr].text;
    this.popup_paragraph.textContent = text;

    Array.from(this.popup_actions.querySelectorAll('.action-button')).forEach((btn, index) => {
      const action = this.options[nr][subNr].actions[index];
      if (action) {
        btn.classList.remove('hidden');
        btn.textContent = action.text;
      } else {
        btn.classList.add('hidden');
      }
    });
  }

  closePopup() {
    this.currentState = [ENUMS.POPUP.HIDE, ENUMS.POPUP.HIDE];
    this.popupElement.classList.add('hidden-i');
  }
}

class Achievement {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savegame = getSavegame();
  DATA.ui = new Ui(savegame.ui);
  DATA.settings = new Settings(savegame.settings);
  DATA.world = new World(savegame.world);
  DATA.game = new Game(savegame.game);
  DATA.player = new Player(savegame.player);
});
