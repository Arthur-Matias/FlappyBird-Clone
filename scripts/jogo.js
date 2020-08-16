console.log('Criado seguindo os videos do [DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');
let globais = {};
let frames = 0;
const hit_sound = new Audio();
hit_sound.src = './assets/sounds/hit.wav'

const sprites = new Image();
sprites.src = './assets/sprites.png';

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
//Chão
function createFloor(){
    const floor = {
        sourceX: 0,
        sourceY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        refresh(){
            console.log('mexeu');
            const floorMovement = 1;
            const repeatIn = this.width/2;
            const movement = this.x - floorMovement;

            this.x = movement % repeatIn;
        },
        draw(){
            canvasContext.drawImage(
                sprites,
                this.sourceX, this.sourceY, //Sprite X, Sprite Y
                this.width, this.height, //Tamanho do recorte na sprite
                this.x, this.y,
                this.width, this.height,
            );
            canvasContext.drawImage(
                sprites,
                this.sourceX, this.sourceY, //Sprite X, Sprite Y
                this.width, this.height, //Tamanho do recorte na sprite
                (this.x + this.width), this.y,
                this.width, this.height,
            );
        }
    }
    return floor;
}

//Plano de fundo
const background = {
    sourceX: 390,
    sourceY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw(){
        canvasContext.fillStyle = '#70c5ce';
        canvasContext.fillRect(0,0,canvas.width, canvas.height);

        canvasContext.drawImage(
            sprites,
            this.sourceX, this.sourceY, //Sprite X, Sprite Y
            this.width, this.height, //Tamanho do recorte na sprite
            this.x, this.y,
            this.width, this.height,
        );
        canvasContext.drawImage(
            sprites,
            this.sourceX, this.sourceY, //Sprite X, Sprite Y
            this.width, this.height, //Tamanho do recorte na sprite
            (this.x + this.width), this.y,
            this.width, this.height,
        );
    }
}

//Tela de início
const startScreen = {
    sourceX: 134,
    sourceY: 0,
    width: 174,
    height: 152,
    x: (canvas.width/2)-174/2,
    y: 50,
    gravity: 0.15,
    speed: 0,
    draw(){
        canvasContext.drawImage(
            sprites,
            this.sourceX, this.sourceY, //Sprite X, Sprite Y
            this.width, this.height, //Tamanho do recorte na sprite
            this.x, this.y,
            this.width, this.height,
        );
    }
}

function hits(flappy, floor){
    const flappyPositionY = flappy.y + flappy.height;
    const floorY = floor.y
    if(flappyPositionY >= floorY){
        return true
    }
    false;
}

//Pássaro
function createNewFlappy(){
    const flappyBird = {
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        gravity: 0.15,
        speed: 0,
        jumpHeight: 4.6,
        movements: [
            {sourceX: 0, sourceY: 0}, //asa pra cima
            {sourceX: 0, sourceY: 26}, //asa no meio
            {sourceX: 0, sourceY: 52} //asa pra baixo
        ],
        actualFrame: 0,
        changeActualFrame(){
            const frameInterval = 10;
            const isInterval = frames % frameInterval === 0;
            if(isInterval){
                const iBase = 1;
                const i = iBase + this.actualFrame;
                const repeatBase = this.movements.length;
                this.actualFrame = i % repeatBase;
            }
            
        },
        jump(){
            this.speed = -this.jumpHeight;
        },
        refresh(){
            if(hits(flappyBird, globais.floor)){
                hit_sound.play();
                changeScreen(Screens.start);
                return
            }
            this.speed = this.speed + this.gravity;
            this.y = this.y + this.speed;
        },
        draw(){
            this.changeActualFrame();
            const { sourceX, sourceY} = this.movements[this.actualFrame];
            canvasContext.drawImage(
                sprites,
                sourceX, sourceY, //Sprite X, Sprite Y
                this.width, this.height, //Tamanho do recorte na sprite
                this.x, this.y,
                this.width, this.height,
            );
        }
    }
    return flappyBird;
    
}


//
//Telas
//
let activeScreen = {};
function changeScreen(newScreen){
    activeScreen = newScreen;
    if(activeScreen.startGame){
        activeScreen.startGame();
    }
};



const Screens = {
    start: {
        startGame(){
            globais.flappyBird = createNewFlappy();
            globais.floor = createFloor();
        },
        draw(){
            background.draw();
            globais.flappyBird.draw();
            globais.floor.draw();
            startScreen.draw();
        },
        click(){
            changeScreen(Screens.game);
        },
        refresh(){
            globais.floor.refresh();
        }
    },
    game: {
        draw(){
            background.draw();
            globais.flappyBird.draw();
            globais.floor.draw();
        },
        click(){
            globais.flappyBird.jump();
        },
        refresh(){
            globais.flappyBird.refresh();
        }        
    }
};

function loop(){

    activeScreen.draw();
    activeScreen.refresh();

    frames +=1;
    requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeScreen(Screens.start);

loop();

