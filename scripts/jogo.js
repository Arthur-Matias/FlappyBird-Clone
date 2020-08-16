console.log('Criado seguindo os videos do [DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');
let globais = {};
let frames = 0;
const hit_sound = new Audio();
hit_sound.src = './assets/sounds/hit.wav'

const score_sound = new Audio();
score_sound.src = './assets/sounds/ponto.wav'

const jump_sound = new Audio();
jump_sound.src = './assets/sounds/pulo.wav'

const fall_sound = new Audio();
fall_sound.src = './assets/sounds/caiu.wav'

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
            jump_sound.play();
            this.speed = -this.jumpHeight;
        },
        refresh(){
            if(hits(flappyBird, globais.floor)){
                fall_sound.play();
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

//Canos
function createPipe(){
    const pipes = {
        width: 52,
        height: 400,
        pipeFloor: {
            sourceX: 0,
            sourceY: 169,
        },
        pipeSky: {
            sourceX: 52,
            sourceY: 169
        },
        space: 80,
        draw(){
            this.evens.forEach(function(even){
                const yRandom = even.y;
                const spaceBetweenPipes = 90;

                //Cano Céu
                const pipeSkyX = even.x;
                const pipeSkyY = yRandom;
                canvasContext.drawImage(
                    sprites,
                    pipes.pipeSky.sourceX, pipes.pipeSky.sourceY, //Sprite X, Sprite Y
                    pipes.width, pipes.height, //Tamanho do recorte na sprite
                    pipeSkyX, pipeSkyY,
                    pipes.width, pipes.height,
                );
                //Cano Chão
                const pipeFloorX = even.x;
                const pipeFloorY = pipes.height + spaceBetweenPipes + yRandom;
                canvasContext.drawImage(
                    sprites,
                    pipes.pipeFloor.sourceX, pipes.pipeFloor.sourceY, //Sprite X, Sprite Y
                    pipes.width, pipes.height, //Tamanho do recorte na sprite
                    pipeFloorX, pipeFloorY,
                    pipes.width, pipes.height,
                );
                even.pipeSky = {
                    x: pipeSkyX,
                    y: pipes.height + pipeSkyY
                }
                even.pipeFloor = {
                    x: pipeFloorX,
                    y: pipeFloorY
                }
            })
        },
        evens: [],
        collideWithFlappy(even){
            const flappyHead = globais.flappyBird.y;
            const flappyFoot = globais.flappyBird.y + globais.flappyBird.height;
            if(globais.flappyBird.x >= even.x){
                if(flappyHead <= even.pipeSky.y){
                    return true;
                }
                if(flappyFoot >= even.pipeFloor.y){
                    return true;
                }
                return false;
            }
        },
        refresh(){
            const is100fps = frames % 100 === 0;
            if(is100fps){
                pipes.evens.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            pipes.evens.forEach(function(even){
                even.x = even.x -2;

                if(pipes.collideWithFlappy(even)){
                    hit_sound.play();
                    changeScreen(Screens.start);
                    return
                }

                if(even.x + pipes.width <= 0){
                    pipes.evens.shift();
                }
            })
        }
    }
    return pipes;
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
            globais.pipes = createPipe();
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
            globais.pipes.draw();
            globais.floor.draw();
        },
        click(){
            globais.flappyBird.jump();
        },
        refresh(){
            globais.flappyBird.refresh();
            globais.pipes.refresh();
            globais.floor.refresh();
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

