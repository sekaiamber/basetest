/* eslint-disable prefer-destructuring */
import headImageConfigs from './images/head.json';
import emotionImageConfigs from './images/emotion.json';
import headEquipmentItemConfig from './equipments/head.json';
import lowerEquipmentItemConfig from './equipments/lower.json';
import bodyEquipmentItemConfig from './equipments/body.json';
import accessoryEquipmentItemConfig from './equipments/accessory.json';
import weaponEquipmentItemConfig from './equipments/weapon.json';

export class Item {
  constructor(config) {
    this.name = config.name;
    this.position = config.position;
    this.itemId = config.id;
    this.styles = config.styles;
  }

  getSlot(character) {
    return {};
  }
}

export class HeadImageItem extends Item {
  getSlot(character) {
    const style = this.styles[character.sex].find(s => s.key === character.hairstyle.toString());
    return style ? style.slots : {};
  }
}

export class EmotionImageItem extends Item {
  getSlot(character) {
    const key = `${character.hairstyle}_${character.emotion}`;
    const style = this.styles[character.sex].find(s => s.key === key);
    return style ? style.slots : {};
  }
}

export class EquipmentItem extends Item {
  constructor(config) {
    super(config);
    this.clazz = config.clazz;
  }
}

export class HeadEquipmentItem extends EquipmentItem {
  getSlot(character) {
    const style = this.styles[character.sex].find(s => s.key === character.hairstyle.toString());
    return style ? style.slots : {};
  }
}

export class UpperEquipmentItem extends EquipmentItem {
  getSlot(character) {
    const sexStyle = this.styles[character.sex];
    const commonStyle = this.styles.c;
    const style = {
      ...commonStyle,
      ...sexStyle,
    };
    return style;
  }
}

export class LowerEquipmentItem extends EquipmentItem {
  getSlot(character) {
    const sexStyle = this.styles[character.sex];
    const commonStyle = this.styles.c;
    const style = {
      ...commonStyle,
      ...sexStyle,
    };
    return style;
  }
}

export class BodyEquipmentItem extends EquipmentItem {
  getSlot(character) {
    const sexStyle = this.styles[character.sex];
    const commonStyle = this.styles.c;
    const style = {
      ...commonStyle,
      ...sexStyle,
    };
    return style;
  }
}

export class Body2EquipmentItem extends EquipmentItem {
  getSlot(character) {
    const sexStyle = this.styles[character.sex];
    const commonStyle = this.styles.c;
    const style = {
      ...commonStyle,
      ...sexStyle,
    };
    return style;
  }
}

export class AccessoryEquipmentItem extends EquipmentItem {
  getSlot(character) {
    const sexStyle = this.styles[character.sex];
    const commonStyle = this.styles.c;
    const style = {
      ...commonStyle,
      ...sexStyle,
    };
    return style;
  }
}

export class WeaponEquipmentItem extends EquipmentItem {
  level = 1

  constructor(config) {
    super(config);
    this.type = config.type;
    this.hold = config.hold;
    this.hand = config.hand;
  }

  getSlot() {
    const style = this.styles[this.level];
    return style;
  }
}


const imagesPools = {
  head: {
    default: null,
    items: headImageConfigs.map(config => new HeadImageItem(config)),
  },
  emotion: {
    default: null,
    items: emotionImageConfigs.map(config => new EmotionImageItem(config)),
  },
};

imagesPools.head.default = imagesPools.head.items[0];
imagesPools.emotion.default = imagesPools.emotion.items[0];

const equipmentsPools = {
  head: {
    items: headEquipmentItemConfig.map(config => new HeadEquipmentItem(config)),
  },
  lower: {
    items: lowerEquipmentItemConfig.map(config => new LowerEquipmentItem(config)),
  },
  body: {
    items: bodyEquipmentItemConfig.map(config => new BodyEquipmentItem(config)),
  },
  accessory: {
    items: accessoryEquipmentItemConfig.map(config => new AccessoryEquipmentItem(config)),
  },
  weapon: {
    items: weaponEquipmentItemConfig.map(config => new WeaponEquipmentItem(config)),
  },
};

export {
  imagesPools,
  equipmentsPools,
};
