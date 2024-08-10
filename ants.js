const main = document.getElementById("main");
const canvas = document.getElementById("canvas");
const counter = document.getElementById("counter");
const double=document.getElementById("double");
const clear=document.getElementById("clear");
const add=document.getElementById("add");

// const antSvg = new Image();
// antSvg.src = "./ant.svg"

// const antBreedSvg = new Image();
// antBreedSvg.src = "./antBreed.svg"
// const canvas = document.createElement("canvas");
// document.main.appendChild(canvas);
// canvas.width = Math.max(window.innerWidth, window.innerWidth);
// canvas.width = "500";

//canvas.height = Math.max(window.innerWidth, window.innerWidth);

// canvas.height = window.innerHeight;
// canvas.height = "500";
// canvas.id="canvas"
document.body.style.overflow = "hidden";

// const canvas = document.getElementById('antCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * 2 * Math.PI;
    this.speed = 3;
    this.state = "searching";
  }

  move() {
    if (this.state === "searching") {
      this.moveTowardsFood();
    } else {
      this.moveTowardsBreedingAnt();
    }
    this.bounceOffWalls();
  }

  moveTowardsFood() {
    if (foods.length > 0) {
      const closestFood = foods.reduce((closest, food) => {
        const dist = Math.hypot(this.x - food.x, this.y - food.y);
        return dist < closest.dist ? { food, dist } : closest;
      }, { food: null, dist: Infinity }).food;

      if (closestFood) {
        const angle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
        this.angle = Math.random() < 0.1 ? angle : this.angle + (Math.random() - 0.5);
      }
    } else {
      this.angle += (Math.random() - 0.5) * 0.2;
    }

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  moveTowardsBreedingAnt() {
    const breedingAnts = ants.filter(ant => ant.state === "breeding" && ant !== this);
    if (breedingAnts.length > 0) {
      const closestAnt = breedingAnts.reduce((closest, ant) => {
        const dist = Math.hypot(this.x - ant.x, this.y - ant.y);
        return dist < closest.dist ? { ant, dist } : closest;
      }, { ant: null, dist: Infinity }).ant;

      if (closestAnt) {
        const angle = Math.atan2(closestAnt.y - this.y, closestAnt.x - this.x);
        this.angle = Math.random() < 0.1 ? angle : this.angle + (Math.random() - 0.5);
      }
    } else {
      this.angle += (Math.random() - 0.5) * 0.2;
    }

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  bounceOffWalls() {
    if (this.x <= 0 || this.x >= width) {
      this.angle = Math.PI - this.angle;
      this.x = Math.max(0, Math.min(this.x, width));
    }
    if (this.y <= 0 || this.y >= height) {
      this.angle = -this.angle;
      this.y = Math.max(0, Math.min(this.y, height));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = this.state === "breeding" ? "red" : "white";
    ctx.fill();

    // if(this.state==="breeding"){
    //   ctx.drawImage(antBreedSvg, this.x, this.y, 10, 10);
    // }else{
    //   ctx.drawImage(antSvg, this.x, this.y, 10, 10);
    // }
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
  }
}

let ants = [new Ant(width / 2, height / 2), new Ant(width / 2, height / 2),];
let foods = [];
// counter.innerText = `Total Ants : ${ants.length}`

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  foods.push(new Food(x, y));
});

function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ants.forEach(ant => {
    ant.move();
    ant.draw();

    foods.forEach((food, index) => {
      if (Math.hypot(ant.x - food.x, ant.y - food.y) < 5) {
        foods.splice(index, 1);
        ant.state = "breeding";
      }
    });
  });

  for (let i = 0; i < ants.length; i++) {
    if (ants[i].state === "breeding") {
      for (let j = i + 1; j < ants.length; j++) {
        if (ants[j].state === "breeding" && Math.hypot(ants[i].x - ants[j].x, ants[i].y - ants[j].y) < 5) {
          const newX = (ants[i].x + ants[j].x) / 2;
          const newY = (ants[i].y + ants[j].y) / 2;
          ants.push(new Ant(newX, newY));
          counter.innerText = `Total Ants : ${ants.length}`
          ants[i].state = "searching";
          ants[j].state = "searching";
          break;
        }
      }
      if (ants[i].state === "searching") break;
    }
  }

  
  foods.forEach(food => food.draw());
  
  requestAnimationFrame(update);
}


double.addEventListener("click",(event)=>{
  let total=ants.length;
  for(let i=0;i<total;i++){
    ants.push(new Ant(width/2, height/2))
  }
  counter.innerText = `Total Ants : ${ants.length}`
})

clear.addEventListener("click",(event)=>{
  ants=[];
  counter.innerText = `Total Ants : ${ants.length}`
})

add.addEventListener("click",(event)=>{
  ants.push(new Ant(width/2,height/2));
  counter.innerText = `Total Ants : ${ants.length}`
})

update();