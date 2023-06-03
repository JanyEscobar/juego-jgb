export class Vidas {
    constructor(scene, initialLives) {
        this.relatedScene = scene;
        this.initialLives = initialLives;
    }

    create() {
        let displacement = 60;
        let firstPosition = 520 - ((this.initialLives - 1) * displacement);
        this.vidasActuales = this.relatedScene.physics.add.staticGroup({
          setScale: { x: 0.5, y: 0.5 },
          key: 'vidas',
          frameQuantity: this.initialLives - 1,
          gridAlign: {
            width: this.initialLives - 1,
            height: 1,
            cellWidth: displacement,
            cellHeight: 30,
            x: firstPosition,
            y: 4
          }
        }).setDepth(1);
    }

    accionVidas() {
        if (this.vidasActuales.countActive() == 0) {
            // this.relatedScene.endGame();
            return true;
        }
        let currentLiveLost = this.vidasActuales.getFirstAlive();
        currentLiveLost.disableBody(true, true);
        return false;
    }
}