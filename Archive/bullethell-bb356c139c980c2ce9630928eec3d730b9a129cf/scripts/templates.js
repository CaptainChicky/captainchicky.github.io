const AI = {};
const BULLET = {};
const MODEL = {};
const POWERUP = {};
const SPRITE = {};
const WEAPON = {};


// Models

MODEL.basicBullet = function(e) {
    fill('#ff0000');
    ellipse(e.pos.x, e.pos.y, e.radius, e.radius);
};

MODEL.player = function(e) {
    image.src = '..\sprites\player.png';
    image.onload = function(){
      context.drawImage(image, 0, 0);
    }
};


// AI


// Bullets

BULLET.basic = {
    // Display
    model: MODEL.basicBullet,
    // Physics
    radius: 5
};


// Powerups


// Sprites

SPRITE.player = {
    // Display
    model: MODEL.player,
    // Physics
    radius: 14,
    // Stats
    hp: 999
};


// Weapons