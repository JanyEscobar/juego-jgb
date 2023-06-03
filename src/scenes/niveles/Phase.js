export class Phase {
    constructor(scene) {
      this.relatedScene = scene;
    }
  
    configureColisions() {
      this.relatedScene.physics.add.collider(
        this.relatedScene.player,
        this.pills,
        this.eatPill,
        null,
        this
      );
    }

    eatPill(player, pill) {
      this.relatedScene.answer = pill.answer;
      this.relatedScene.pillCollition = true;
      this.relatedScene.sideCollition = player.x > pill.x ? 1 : 0;
      this.relatedScene.swallow.play();
      this.relatedScene.bg_audio.pause();
      pill.destroy();
      this.relatedScene.goright = false;
      this.relatedScene.goleft = false;
    }
  }