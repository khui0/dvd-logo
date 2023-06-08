const block = document.getElementById("block");

const keys = {};

// Acceleration
const gravity = 0;
const friction = 0;

let velocityX = 0.5;
let velocityY = 0.5;

let time = Date.now();

// Game loop
setInterval(() => {
    // Calculate delta time
    const deltaT = Date.now() - time;
    time = Date.now();

    // Game bounds 
    const bounds = document.body.getBoundingClientRect();
    const rect = block.getBoundingClientRect();

    const collision = [
        getInverseCollision(rect, bounds)
    ];

    // Gravity
    if (!hasCollision("bottom")) {
        velocityY += gravity * deltaT;
        block.style.top = rect.y + velocityY * deltaT + "px";
    }
    else {
        // velocityY = 0;
    }

    // Friction
    if (!hasCollision("left") && !hasCollision("right")) {
        const direction = velocityX / Math.abs(velocityX);
        velocityX = Math.abs(velocityX) - friction * deltaT;
        if (velocityX < 0) {
            velocityX = 0;
        }
        velocityX *= direction;
        block.style.left = rect.x + velocityX * deltaT + "px";
    }

    if (hasCollision("bottom") || hasCollision("top")) {
        velocityY *= -1;
    }
    if (hasCollision("left") || hasCollision("right")) {
        velocityX *= -1;
    }

    if (rect.y < bounds.y) {
        block.style.top = bounds.y;
        console.log("outside top");
    }
    if (rect.y + rect.height > bounds.y + bounds.height) {
        block.style.top = bounds.y + bounds.height - rect.height;
        console.log("outside bottom");
    }
    if (rect.x < bounds.x) {
        block.style.left = bounds.x;
        console.log("outside left");
    }
    if (rect.x + rect.width > bounds.x + bounds.width) {
        block.style.left = bounds.x + bounds.width - rect.width;
        console.log("outside right");
    }

    function getInverseCollision(rect1, rect2) {
        return {
            "bottom": rect1.y + rect1.height + velocityY * deltaT >= rect2.y + rect2.height,
            "top": rect1.y + velocityY * deltaT <= rect2.y,
            "left": rect1.x + velocityX * deltaT <= rect2.x,
            "right": rect1.x + rect1.width + velocityX * deltaT >= rect2.x + rect2.width,
        }
    }

    function getCollision(rect1, rect2) {
        // If rect1 is above rect2
        const above = rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width;
        // If rect1 is beside rect2
        const beside = rect1.y + rect1.height > rect2.y && rect1.y + 1 < rect2.y + rect2.height;
        return {
            "bottom": rect1.y + rect1.height + velocityY * deltaT >= rect2.y && rect1.y + rect1.height <= rect2.y + rect2.height && above,
            "top": rect1.y + velocityY * deltaT <= rect2.y + rect2.height && rect1.y + velocityY * deltaT >= rect2.y && above,
            "left": rect1.x + rect1.width + velocityX * deltaT >= rect2.x && rect1.x + rect1.width + velocityX * deltaT <= rect2.x + rect2.width && beside,
            "right": rect1.x + velocityX * deltaT <= rect2.x + rect2.width && rect1.x + velocityX * deltaT >= rect2.x && beside,
        }
    }

    function hasCollision(direction) {
        return collision.some(item => item[direction] == true);
    }
}, 1);

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});