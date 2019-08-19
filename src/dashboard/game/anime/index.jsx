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
    console.log('BASE_LOG 1');
    app.loader
      .add('spineCharacter', '/assets/data/skeleton.json')
      .load((_, resources) => {
        console.log('BASE_LOG 2');
        const { spineData } = resources.spineCharacter;
        this.spineCleanData = spineData;
        this.ready = true;
        console.log('BASE_LOG 3,' + typeof this.spineCleanData);
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
    if (heroInfo) {
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
      console.log('BASE_LOG 4,');
      this.updateCharacter();
    }
  }

  updateCharacter() {
    const { PIXI } = window;
    const { app, spineCleanData, characterData } = this;
    app.stage.removeChild(this.character);
    // 清空插槽数据
    console.log('BASE_LOG 5,');
    spineCleanData.slots.forEach(slot => slot.attachmentName = null);
    // 将定制插槽插入数据
    const slotAttachments = characterData.getSlots();
    console.log('BASE_LOG 6,');
    Object.keys(slotAttachments).forEach((slotName) => {
      const slot = spineCleanData.slots.find(s => s.name === slotName);
      if (slot) {
        slot.attachmentName = slotAttachments[slotName];
      }
    });
    console.log('BASE_LOG 7,');
    const character = new PIXI.spine.Spine(spineCleanData);
    this.character = character;
    character.x = this.size.width;
    character.y = 290;
    character.scale.set(1.5, 1.5);
    app.stage.addChild(character);
    console.log('BASE_LOG 8,');
  }

  render() {
    const { id } = this.state;
    return (
      <div id={id} />
    );
  }
}
