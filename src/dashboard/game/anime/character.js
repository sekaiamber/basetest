// import characterList from './characterList.json';

import { imagesPools, equipmentsPools } from './item';
import animation from './animations/weapon.json';


export default class Character {
  sex = 'f'

  hairstyle = 1

  emotion = 1

  images = {
    head: imagesPools.head.default,
    emotion: imagesPools.emotion.default,
  }

  equipments = {}

  weapons = {
    right: null,
    left: null,
  }

  animations = animation.dagger.animations

  constructor(sex = 'f') {
    this.sex = sex;
    this.cleanImages();
    this.cleanEquipments();
  }

  cleanImages() {
    this.items = {};
  }

  cleanEquipments() {
    this.equipments = {};
  }

  updateEquipment(eid) {
    const position = eid.split('_')[1];
    const e = equipmentsPools[position].items.find(i => i.itemId === eid);
    this.equipments[position] = e;
  }

  updateWeapon(eid) {
    const e = equipmentsPools.weapon.items.find(i => i.itemId === eid);
    if (!e) return;
    if (e.hand === 'left') {
      this.weapons.left = e;
      if (e.hold === 'double') {
        this.weapons.right = null;
      }
    } else if (!(this.weapons.left && this.weapons.left.hold === 'double')) {
      this.weapons.right = e;
    }
    if (e.type !== 'shild' && animation[e.type]) {
      this.animations = animation[e.type].animations;
    }
  }

  cleanEquipment(position) {
    this.equipments[position] = null;
  }

  cleanWeapon() {
    this.weapons = {
      right: null,
      left: null,
    };
  }

  // 获得slot
  getSlots() {
    const { images, equipments } = this;
    let ret = {};
    Object.keys(images).forEach((key) => {
      const item = images[key];
      if (item) {
        ret = {
          ...ret,
          ...item.getSlot(this),
        };
      }
    });
    Object.keys(equipments).forEach((key) => {
      const item = equipments[key];
      if (item) {
        ret = {
          ...ret,
          ...item.getSlot(this),
        };
      }
    });
    if (this.weapons.left) {
      ret = {
        ...ret,
        ...this.weapons.left.getSlot(this),
      };
    }
    if (this.weapons.right) {
      ret = {
        ...ret,
        ...this.weapons.right.getSlot(this),
      };
    }
    return ret;
  }

  getAnimationCode(event, code = -1) {
    const animationSet = this.animations[event];
    if (animationSet) {
      let i = code;
      if (i === -1) {
        const { length } = animationSet;
        i = parseInt(Math.random() * length, 10);
      }
      return animationSet[i];
    }
    return null;
  }

  export() {
    const images = {};
    Object.keys(this.images).forEach((key) => {
      images[key] = this.images[key].itemId;
    });
    const equipments = {};
    Object.keys(this.equipments).forEach((key) => {
      equipments[key] = this.equipments[key].itemId;
    });
    const weapons = {
      right: null,
      left: null,
    };
    if (this.weapons.right) {
      weapons.right = this.weapons.right.itemId;
    }
    if (this.weapons.left) {
      weapons.left = this.weapons.left.itemId;
    }
    return {
      sex: this.sex,
      hairstyle: this.hairstyle,
      emotion: this.emotion,
      images,
      equipments,
      weapons,
    };
  }
}
