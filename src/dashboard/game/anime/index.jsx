/* eslint-disable no-param-reassign */
import React from 'react';
import CharacterData from './character';

export default class Anime extends React.Component {
  app

  spineCleanData

  characterData

  character

  state = {
    id: 'hero_' + parseInt(Math.random() * 1000, 10),
  }

  size

  ready = false

  constructor(props) {
    super(props);
    const characterData = new CharacterData();
    this.characterData = characterData;
    setTimeout(() => {
      this.convertInfoToData();
    }, 0);
  }

  componentDidMount() {
    const { id } = this.state;
    const { PIXI } = window;
    const container = document.getElementById(id);
    const size = container.getClientRects()[0];
    this.size = size;
    const app = new PIXI.Application({
      width: parseInt(size.width, 10) * 2,
      height: 150 * 2,
      transparent: true,
      antialias: true,
    });
    this.app = app;
    container.appendChild(app.view);
    app.view.style.height = '150px';
    app.view.style.width = `${parseInt(size.width, 10)}px`;
    app.loader
      .add('spineCharacter', 'assets/data/skeleton.json')
      .load((_, resources) => {
        const { spineData } = resources.spineCharacter;
        this.spineCleanData = spineData;
        this.ready = true;
        this.convertInfoToData();
        // 初始化角色定制
        // initCharacterSlotSelect(spineData);
        // spineCleanData = spineData;
        // updateCharacter();

        // // // run
        // // var animation = new PIXI.spine.Spine(spineBoyData);
        // // if (character.state.hasAnimation('1SWORD_ATTACK_1')) {
        // //   // run forever, little boy!
        // //   character.state.setAnimation(0, '1SWORD_ATTACK_1', true);
        // //   // dont run too fast
        // //   character.state.timeScale = 0.3;
        // // }

        app.start();
      });
  }

  componentWillReceiveProps(newProps) {
    const { heroInfo } = newProps;
    // eslint-disable-next-line react/destructuring-assignment
    if (heroInfo && heroInfo !== this.props.heroInfo) {
      this.convertInfoToData(newProps);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  convertInfoToData(props = this.props) {
    const { characterData } = this;
    const { heroInfo, equipped } = props;
    characterData.sex = heroInfo.sex;
    characterData.hairstyle = heroInfo.hairstyle;
    // 清除数据
    characterData.updateEquipment('e_lower_1_0');
    characterData.updateEquipment('e_body_1_0');
    characterData.cleanEquipment('head');
    characterData.cleanEquipment('accessory');
    characterData.cleanWeapon();

    ['head', 'body', 'lower', 'accessory'].forEach((key) => {
      if (equipped[key]) {
        characterData.updateEquipment(equipped[key].meta.code);
      }
    });
    if (equipped.weapon) {
      characterData.updateWeapon(equipped.weapon.meta.code);
    }
    if (this.ready) {
      this.updateCharacter();
    }
  }

  updateCharacter() {
    const { PIXI } = window;
    const { app, spineCleanData, characterData } = this;
    app.stage.removeChild(this.character);
    // 清空插槽数据
    spineCleanData.slots.forEach(slot => slot.attachmentName = null);
    // 将定制插槽插入数据
    const slotAttachments = characterData.getSlots();
    Object.keys(slotAttachments).forEach((slotName) => {
      const slot = spineCleanData.slots.find(s => s.name === slotName);
      if (slot) {
        slot.attachmentName = slotAttachments[slotName];
      }
    });
    const character = new PIXI.spine.Spine(spineCleanData);
    this.character = character;
    character.x = this.size.width;
    character.y = 310;
    character.scale.set(1.7, 1.7);
    app.stage.addChild(character);
    const code = characterData.getAnimationCode('idle', 0);
    if (character.state.hasAnimation(code)) {
      character.state.setAnimation(0, code, 1);
      character.state.timeScale = 1;
    }
  }

  render() {
    const { id } = this.state;
    return (
      <div id={id} />
    );
  }
}
