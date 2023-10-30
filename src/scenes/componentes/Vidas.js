export class Vidas {
    constructor(scene, initialLives) {
        this.relatedScene = scene;
        this.initialLives = initialLives;
    }

    create() {
        this.crearVidas(this.initialLives - 1);
    }

    accionVidas(muerteTotal = false) {
        if (this.vidasActuales.countActive() == 0 || muerteTotal) {
            return true;
        }
        let currentLiveLost = this.vidasActuales.getFirstAlive();
        currentLiveLost.disableBody(true, true);
        return false;
    }

    agregarVida() {
        let cantidad = this.vidasActuales.countActive() + 1;
        this.vidasActuales.clear(true, true);
        this.crearVidas(cantidad);
    }

    crearVidas(cantidad) {
        let displacement = 50;
        let firstPosition = (this.relatedScene.cameras.main.width) - (cantidad * displacement);
        this.vidasActuales = this.relatedScene.physics.add.staticGroup({
            setScale: { x: 0.5, y: 0.5 },
            key: 'vidas',
            frameQuantity: cantidad,
            gridAlign: {
                width: cantidad,
                height: 1,
                cellWidth: displacement,
                cellHeight: 30,
                x: firstPosition,
                y: 4
            }
        }).setDepth(1);

        this.agregarNombreVida();
    }

    agregarNombreVida(eliminar = false){
        if (eliminar) {
            this.eliminarNombreVida();
        }
        let cantidadVidas = this.vidasActuales.countActive();
        // Asigna texto a cada elemento del grupo
        this.vidasActuales.getChildren().forEach(function(element, index) {
            if (element.active) {
                element.setScale(window.innerWidth * 0.001, window.innerHeight * 0.0006);
                element.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                element.texto = this.add.text(element.x - 9, element.y - 9, `B${cantidadVidas}`, { fontFamily: 'Arial', fontSize: '16px', color: "#FFFFFF", fontStyle: 'normal' })
                    .setDepth(10).setScale(element.x * 0.003, element.y * 0.04);
                cantidadVidas--;
            }
        }, this.relatedScene);
    }

    eliminarNombreVida(){
        // Eliminar texto a cada elemento del grupo
        this.vidasActuales.getChildren().forEach(function(element, index) {
            if (element.texto) {
                element.texto.destroy();
                delete element.texto;
            }
        }, this.relatedScene);
    }
}