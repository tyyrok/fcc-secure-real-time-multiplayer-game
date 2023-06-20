import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


socket.on('new game', (obj, coin, users) => {
    //console.log(obj);
    //console.log(coin);
    
    let player = new Player({
        x: obj.x,
        y: obj.y,
        score: obj.score,
        id: obj.id
    });

    let collectible = new Collectible({
        x: coin.x,
        y: coin.y,
        value: coin.value,
        id: coin.id
    });

    player.draw(canvas, context, collectible);
    player.calculateRank(users);
    console.log(player.calculateRank(users));

    document.addEventListener('keydown', (event) => {

        let key = event.key.toUpperCase();

        if (key == 'W' || key == 'A' || key == 'S' || key == 'D') {
            socket.emit('movement', {key} );
        }
    })
    socket.on('newPosition', (obj) => {
                
        console.log(obj);
        player.x = obj.x;
        player.y = obj.y;

        player.draw(canvas, context, collectible);
    });

    socket.on('new round', (score, coin, users) => {
        // Initialize new score and new coin!!!
        console.log(score, collectible, users);
        player.score = score;
        player.calculateRank(users);

        collectible = new Collectible({
            x: coin.x,
            y: coin.y,
            value: coin.value,
            id: coin.id
        });
        player.draw(canvas, context, collectible);

    });

    
})