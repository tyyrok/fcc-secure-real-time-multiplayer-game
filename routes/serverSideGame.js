'use strict';

import Player from "../public/Player.mjs";
import Collectible  from "../public/Collectible.mjs";
import { canvasHeight, canvasWidth } from "../public/Player.mjs";
import { playerHeight, playerWidth } from "../public/Player.mjs";

const speed = 10;
const collectibleWidth = 20; //No good, this is repetion of constant from Collectible.mjs due to unresolved circular dependency
const collectibleHeight = 20; //The same stuff with dependency

module.exports = function(socket, io) {

    let usersNumber = 0;
    let usersMap = new Map();

    io.on('connection', (socket) => {
        usersNumber += 1;
        let player = new Player({
            x: getRandom(canvasWidth),
            y: getRandom(canvasHeight),
            score: 0,
            id: Date.now()
        });

        usersMap.set(player.id, player.score);
        //console.log(usersMap);

        let collectible = new Collectible({
            x: setCollectWOCollision(player, 'x'),
            y: setCollectWOCollision(player, 'y'),
            value: 1,
            id: Date.now()
        })
        socket.emit('new game', { x: player.x, 
                                    y: player.y,
                                    score: player.score,
                                    id: player.id }, collectible, Array.from(usersMap, ([name, value]) => ({name, value})) );
    
        socket.on('movement', (key) => {

            player.movePlayer(key.key, speed);

            // Checking for collision
            if (player.collision(collectible)) {
                // Add score to player
                player.score += collectible.value;
                usersMap.set(player.id, player.score);
                console.log(usersMap);
                // Destroy current collectible and create new collectible
                collectible = new Collectible({
                    x: setCollectWOCollision(player, 'x'),
                    y: setCollectWOCollision(player, 'y'),
                    value: 1,
                    id: Date.now()
                });
                socket.emit('newPosition', { x: player.x,
                    y: player.y });
                socket.emit('new round', player.score, collectible, Array.from(usersMap, ([name, value]) => ({name, value})));
            } else {

                socket.emit('newPosition', { x: player.x,
                                         y: player.y });
            }
            

        })

        socket.on('disconnect', () => {
            console.log('a user disconnected');
            --usersNumber;
            usersMap.delete(player.id);
            //socket.emit('user disconnected', { user: id })
        });
    });
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function setCollectWOCollision(player, coord) {
    if (coord == 'x') {
        let x = getRandom(canvasWidth - collectibleWidth);
        while ( ( ((x + collectibleWidth) > player.x) && ((x + collectibleWidth) < ( player.x + playerWidth) ) ) || 
                ( (x < (player.x + playerWidth) ) && (x > player.x))  ) {
            x = getRandom(canvasWidth - collectibleWidth);
        }
        return x;
        
    } else if (coord == 'y') {
        let y = getRandom(canvasHeight - collectibleHeight);
        while ( ( ((y + collectibleHeight) > player.y) && ((y + collectibleHeight) < ( player.y + playerHeight) ) ) || 
                ( (y < (player.y + playerHeight) ) && (y > player.xy))  ) {
            y = getRandom(canvasHeight - collectibleHeight);
        }
        return y;
    }
}