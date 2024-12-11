// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Define the dinosaur object
let dinosaur = {
    x: 100,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.5,
    jumpForce: -10,
    speed: 5
};

// Define the platforms array
let platforms = [
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
    { x: 300, y: canvas.height - 150, width: 200, height: 20 },
    { x: 600, y: canvas.height - 250, width: 200, height: 20 }
];

// Define the people array
let people = [
    { x: 200, y: canvas.height - 50, width: 20, height: 20, velocityX: 2, velocityY: 0, gravity: 0.5 },
    { x: 400, y: canvas.height - 150, width: 20, height: 20, velocityX: 2, velocityY: 0, gravity: 0.5 },
    { x: 600, y: canvas.height - 250, width: 20, height: 20, velocityX: 2, velocityY: 0, gravity: 0.5 }
];

// Function to draw a polygon
function fillPolygon(ctx, points, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

// Main game loop
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the dinosaur
    let bodyPoints = [
        { x: dinosaur.x, y: dinosaur.y },
        { x: dinosaur.x + dinosaur.width, y: dinosaur.y },
        { x: dinosaur.x + dinosaur.width / 2, y: dinosaur.y - dinosaur.height }
    ];
    fillPolygon(ctx, bodyPoints, 'green');

    let leg1Points = [
        { x: dinosaur.x, y: dinosaur.y + dinosaur.height },
        { x: dinosaur.x + dinosaur.width / 4, y: dinosaur.y + dinosaur.height },
        { x: dinosaur.x + dinosaur.width / 8, y: dinosaur.y + dinosaur.height * 2 }
    ];
    fillPolygon(ctx, leg1Points, 'green');

    let leg2Points = [
        { x: dinosaur.x + dinosaur.width * 3/4, y: dinosaur.y + dinosaur.height },
        { x: dinosaur.x + dinosaur.width, y: dinosaur.y + dinosaur.height },
        { x: dinosaur.x + dinosaur.width * 7/8, y: dinosaur.y + dinosaur.height * 2 }
    ];
    fillPolygon(ctx, leg2Points, 'green');

    // Draw the platforms
    for (let i = 0; i < platforms.length; i++) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }

    // Draw the people
    for (let i = 0; i < people.length; i++) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(people[i].x, people[i].y, people[i].width, people[i].height);
        
        // Update people position
        people[i].x += people[i].velocityX;
        people[i].y += people[i].velocityY;
        people[i].velocityY += people[i].gravity;
        
        // Check for collision with the dinosaur
        if (dinosaur.x + dinosaur.width > people[i].x &&
            dinosaur.x < people[i].x + people[i].width &&
            dinosaur.y + dinosaur.height > people[i].y &&
            dinosaur.y < people[i].y + people[i].height) {
            // Collision detected, remove the person
            people.splice(i, 1);
        }
        
        // Check for collision with platforms
        for (let j = 0; j < platforms.length; j++) {
            if (people[i] && people[i].x + people[i].width > platforms[j].x &&
                people[i].x < platforms[j].x + platforms[j].width &&
                people[i].y + people[i].height > platforms[j].y &&
                people[i].y < platforms[j].y + platforms[j].height) {
                // Collision detected, update person position
                people[i].y = platforms[j].y - people[i].height;
                people[i].velocityY = 0;
            }
        }
        
        // Check for collision with the edge of the screen
        if (people[i] && (people[i].x < 0 || people[i].x + people[i].width > canvas.width)) {
            people[i].velocityX = -people[i].velocityX;
        }
        
        // Make people jump randomly
        if (Math.random() < 0.01) {
            people[i].velocityY = -5;
        }
    }

    // Add new people when they are all removed
    if (people.length === 0) {
        for (let i = 0; i < 3; i++) {
            people.push({
                x: Math.random() * canvas.width,
                y: canvas.height - 50,
                width: 20,
                height: 20,
                velocityX: Math.random() * 2 - 1,
                velocityY: 0,
                gravity: 0.5
            });
        }
    }

    // Update the dinosaur position
    dinosaur.x += dinosaur.velocityX;
    dinosaur.y += dinosaur.velocityY;
    dinosaur.velocityY += dinosaur.gravity;

    // Check for collision with platforms
    for (let i = 0; i < platforms.length; i++) {
        if (dinosaur.x + dinosaur.width > platforms[i].x &&
            dinosaur.x < platforms[i].x + platforms[i].width &&
            dinosaur.y + dinosaur.height > platforms[i].y &&
            dinosaur.y < platforms[i].y + platforms[i].height) {
            // Collision detected, update dinosaur position
            dinosaur.y = platforms[i].y - dinosaur.height;
            dinosaur.velocityY = 0;
        }
    }

    // Check for collision with the edge of the screen
    if (dinosaur.x < 0) {
        dinosaur.x = 0;
    } else if (dinosaur.x + dinosaur.width > canvas.width) {
        dinosaur.x = canvas.width - dinosaur.width;
    }

    // Request the next frame
    requestAnimationFrame(update);
}

// Start the game loop
update();

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // Jump
        dinosaur.velocityY = dinosaur.jumpForce;
    } else if (event.key === 'ArrowLeft') {
        // Move left
        dinosaur.velocityX = -dinosaur.speed;
    } else if (event.key === 'ArrowRight') {
        // Move right
        dinosaur.velocityX = dinosaur.speed;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Stop moving
        dinosaur.velocityX = 0;
    }
});
