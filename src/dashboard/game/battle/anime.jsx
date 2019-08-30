/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import anime from 'animejs';
import RESOURCE from '../../resource';
import CharacterData from '../anime/character';
import maps from './map.json';
import { convertEquippedListToMap } from '../../../utils/hero';


export default class Anime extends Component {
  spineCleanData

  app

  characterFromData

  characterToData

  finish = false

  state = {
    ready: false,
    id: 'battle_' + parseInt(Math.random() * 1000, 10),
    mapInfo: maps[parseInt(Math.random() * maps.length, 10)],
  }

  constructor(props) {
    super(props);
    this.initCharactors(props);
  }

  componentDidMount() {
    const { id, mapInfo } = this.state;
    const { PIXI } = window;
    const container = document.getElementById(id);
    const app = new PIXI.Application({
      width: window.innerWidth * 2,
      height: 200 * 2,
      // transparent: true,
      antialias: true,
    });
    this.app = app;
    container.appendChild(app.view);
    app.view.style.height = '200px';
    app.view.style.width = `${window.innerWidth}px`;
    app.loader
      .add('spineCharacter', 'assets/data/skeleton.json')
      .add('map', RESOURCE.MAP[mapInfo.code])
      .add('shadow', RESOURCE.UI.BATTLE_SHADOW)
      .load((_, resources) => {
        const { map, spineCharacter, shadow } = resources;
        const { spineData } = spineCharacter;
        this.spineCleanData = spineData;
        this.map = map;
        this.shadow = shadow;

        const containers = this.renderCanvas();

        app.start();

        this.startBattleAnimation(containers);
      });
  }

  initCharactors(props) {
    this.characterFromData = new CharacterData();
    this.characterToData = new CharacterData();
    const { data } = props;
    this.initCharactorData(this.characterFromData, {
      sex: 'f',
      hairstyle: 1,
    }, convertEquippedListToMap(data.from.equipped));
    this.initCharactorData(this.characterToData, {
      sex: 'f',
      hairstyle: 1,
    }, convertEquippedListToMap(data.to.equipped));
  }

  initCharactorData(characterData, heroInfo, equipped) {
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
  }

  startBattleAnimation(containers) {
    const {
      stage, charactorFromContainer, charactorFromSprite, charactorToSprite, charactorToContainer,
    } = containers;
    const { data } = this.props;
    charactorFromContainer.x = -100;

    // 攻击方动画，从-100到1500
    anime({
      targets: null,
      easing: 'linear',
      duration: 6000,
      update(anim) {
        charactorFromContainer.x = anim.progress / 100 * 1600 - 100;
      },
      begin: () => {
        const code = this.characterFromData.getAnimationCode('run');
        if (charactorFromSprite.state.hasAnimation(code)) {
          charactorFromSprite.state.setAnimation(0, code, true);
          charactorFromSprite.state.timeScale = 1;
        }
      },
      complete: () => {
        // 判定结束，winer攻击10次
        let attackCount = 8;
        // 开始战斗，切换动作
        let codeFrom = this.characterFromData.getAnimationCode('attack');
        if (charactorFromSprite.state.hasAnimation(codeFrom)) {
          charactorFromSprite.state.setAnimation(0, codeFrom);
          charactorFromSprite.state.timeScale = data.winer === 'from' ? 1.3 : 1;
        }
        charactorFromSprite.state.addListener({
          // event: function(entry, event) { console.log('event fired '+event.data+' at track' + entry.trackIndex) },
          complete: () => {
            if (data.winer === 'from') {
              attackCount -= 1;
            }
            if (attackCount > 0) {
              codeFrom = this.characterFromData.getAnimationCode('attack');
              if (charactorFromSprite.state.hasAnimation(codeFrom)) {
                charactorFromSprite.state.setAnimation(0, codeFrom);
              }
            } else {
              this.handleFinish(containers);
            }
          },
        });
        let codeTo = this.characterToData.getAnimationCode('attack');
        if (charactorToSprite.state.hasAnimation(codeTo)) {
          charactorToSprite.state.setAnimation(0, codeTo);
          charactorToSprite.state.timeScale = data.winer === 'from' ? 1 : 1.3;
        }
        charactorToSprite.state.addListener({
          // event: function(entry, event) { console.log('event fired '+event.data+' at track' + entry.trackIndex) },
          complete: () => {
            if (data.winer === 'to') {
              attackCount -= 1;
            }
            if (attackCount > 0) {
              codeTo = this.characterToData.getAnimationCode('attack');
              if (charactorToSprite.state.hasAnimation(codeTo)) {
                charactorToSprite.state.setAnimation(0, codeTo);
              }
            } else {
              this.handleFinish(containers);
            }
          },
        });
      },
    });

    // 防守方动画，从2050到1650
    charactorToContainer.x = 2050;
    const toAnime = anime({
      targets: null,
      easing: 'linear',
      duration: 1500,
      autoplay: false,
      update(anim) {
        charactorToContainer.x = 2050 - anim.progress / 100 * (2050 - 1650);
      },
      begin: () => {
        const code = this.characterToData.getAnimationCode('run');
        if (charactorToSprite.state.hasAnimation(code)) {
          charactorToSprite.state.setAnimation(0, code, 1);
          charactorToSprite.state.timeScale = 1;
        }
      },
      complete: () => {
        const code = this.characterToData.getAnimationCode('idle');
        if (charactorToSprite.state.hasAnimation(code)) {
          charactorToSprite.state.setAnimation(0, code, 1);
          charactorToSprite.state.timeScale = 1;
        }
      },
    });

    // 镜头移动
    const finalStageX = 2000 - window.innerWidth * 2;
    // anime的bug，没有target属性，delay不生效
    anime({
      targets: null,
      easing: 'linear',
      duration: 2000,
      update(anim) {
        const { progress } = anim;
        if (progress > 80) {
          stage.x = -(progress - 80) / 20 * finalStageX;
        }
      },
      complete() {
        toAnime.play();
      },
    });
  }

  handleFinish(containers) {
    if (this.finish) return;
    this.finish = true;
    const {
      charactorFromSprite, charactorToSprite,
    } = containers;
    const { data, onFinish } = this.props;
    // 胜利失败
    const codeFrom = this.characterFromData.getAnimationCode(data.winer === 'from' ? 'victory' : 'pinch');
    if (charactorFromSprite.state.hasAnimation(codeFrom)) {
      charactorFromSprite.state.setAnimation(0, codeFrom, true);
      charactorFromSprite.state.timeScale = 1;
    }
    const toFrom = this.characterToData.getAnimationCode(data.winer === 'to' ? 'victory' : 'pinch');
    if (charactorToSprite.state.hasAnimation(toFrom)) {
      charactorToSprite.state.setAnimation(0, toFrom, true);
      charactorToSprite.state.timeScale = 1;
    }
    setTimeout(() => {
      onFinish();
    }, 3000);
  }

  renderCharactor(characterData) {
    const { PIXI } = window;
    const { spineCleanData } = this;
    const characterContainer = new PIXI.Container();
    characterContainer.width = 0;
    characterContainer.height = 0;
    characterContainer.scale.set(1, 1);

    // 阴影
    const shadow = new PIXI.Sprite(this.shadow.texture);
    shadow.height = 50;
    shadow.width = 100;
    shadow.x = -50;
    shadow.y = -25;
    characterContainer.addChild(shadow);
    // const circle = new PIXI.Graphics();
    // circle.beginFill(0x9966FF);
    // circle.drawCircle(0, 0, 40);
    // circle.endFill();
    // circle.x = 0;
    // circle.y = 0;

    // 人物
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
    character.x = 0;
    character.y = 0;
    character.scale.set(1, 1);
    characterContainer.addChild(character);


    // TODO: remove debug code
    // const rectangle1 = new PIXI.Graphics();
    // rectangle1.beginFill(0x66CCFF);
    // rectangle1.drawRect(-2, -2, 4, 4);
    // rectangle1.endFill();
    // characterContainer.addChild(rectangle1);

    return {
      container: characterContainer,
      character,
    };
  }

  renderCanvas() {
    const { PIXI } = window;
    const { Container, Sprite } = PIXI;
    const stage = new Container();
    stage.height = 400;
    stage.width = 2000;
    // 增加背景
    const bg = new Sprite(this.map.texture);
    stage.addChild(bg);
    // 增加人物1
    const { container: charactorFromContainer, character: charactorFromSprite } = this.renderCharactor(this.characterFromData);
    charactorFromContainer.x = 100;
    charactorFromContainer.y = 290;
    stage.addChild(charactorFromContainer);
    // 增加人物2
    const { container: charactorToContainer, character: charactorToSprite } = this.renderCharactor(this.characterToData);
    charactorToContainer.x = 400;
    charactorToContainer.y = 290;
    charactorToContainer.scale.set(-1, 1);
    stage.addChild(charactorToContainer);

    this.app.stage.addChild(stage);

    return {
      stage,
      charactorFromContainer,
      charactorFromSprite,
      charactorToContainer,
      charactorToSprite,
    };
  }

  render() {
    const { id, mapInfo } = this.state;

    return (
      <>
        <div id={id} className="battle-anime-container" />
        <div className="battle-anime-mapinfo">{mapInfo.name}</div>
      </>
    );
  }
}
