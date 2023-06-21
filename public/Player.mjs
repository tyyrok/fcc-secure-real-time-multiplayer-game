export const playerWidth = 30;
export const playerHeight = 30;
export const canvasWidth = 640;
export const canvasHeight = 480;
//import { collectibleHeight, collectibleWidth } from "./Collectible.mjs";
// Circular dependency problem!!!
const collectibleHeight = 20;
const collectibleWidth = 20;
const gamerColor = 'red';
const coinColor = "blue";
const canvasColor = 'gray';

class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
      case 'W' :
        if ( (this.y - speed) < 0) {
          this.y = 0;
        } else {
          this.y -= speed;
        }
        break;
      case 'left':
      case 'A':
        if ( (this.x - speed) < 0) {
          this.x = 0;
        } else {
          this.x -= speed;
        }
        break;
      case 'down':
      case 'S':
        if ( (this.y + speed + playerHeight) >= canvasHeight) {
          this.y = canvasHeight - playerHeight;
        } else {
          this.y += speed;
        }
        break;
      case 'right':
      case 'D':
        if ( (this.x + speed + playerWidth) >= canvasWidth) {
          this.x = canvasWidth - playerWidth;
        } else {
          this.x += speed;
        }
        break;
    }
  }

  collision(item) {

    if ((item.x >= this.x) && (item.x <= this.x + playerWidth) && (item.y >= this.y) && (item.y <= this.y + playerHeight) ) {
      return true;
    
    } else if ( (item.x + collectibleWidth >= this.x) && (item.x + collectibleWidth <= this.x + playerWidth ) 
                                            && (item.y >= this.y) && (item.y <= this.y + playerHeight) ) {
      return true;

    } else if ((item.x >= this.x) && (item.x <= this.x + playerWidth) 
                && (item.y + collectibleHeight >= this.y) && (item.y + collectibleHeight <= this.y + playerHeight) ) {
      return true;

    } else if ( (item.x + collectibleWidth >= this.x) && (item.x + collectibleWidth <= this.x + playerWidth ) 
                && (item.y + collectibleHeight >= this.y) && (item.y + collectibleHeight <= this.y + playerHeight) ) {
      return true;

    } else return false;
  }

  calculateRank(arr) {

    let currentRanking = arr.reduce((rank, score) => {

      return this.score > score.score? rank + 1  : rank;
    }, 0);
    currentRanking = arr.length - currentRanking;
    //console.log(`Rank: ${currentRanking}/${arr.length}`);
    this.rank = currentRanking;
    return `Rank: ${currentRanking}/${arr.length}`;
  }

  draw(canvas, context, coin, img, usersArray, coinImg) {

    context.fillStyle = canvasColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight); 

    document.getElementsByTagName('h1')[0].innerHTML = `Secure Real Time Multiplayer   Game ${this.calculateRank(usersArray)}   Score ${this.score}` ;


    context.fillStyle = gamerColor;
    context.drawImage(img, this.x, this.y);
    //context.fillRect(this.x, this.y, playerWidth, playerHeight);

    context.fillStyle = coinColor;
    context.drawImage(coinImg, coin.x, coin.y)
    //context.fillRect(coin.x, coin.y, collectibleWidth, collectibleHeight);
  }
}

export default Player;
