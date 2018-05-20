var radius = 198;
var originX = 200;
var originY = 200;

var money = 100;

//Data
var questions = {
  1: "Question 1: What is 2 + 2 ?",
  2: "Question 2: Where is Big Ben?",
  3: "Question 3: How many moons does Earth have?",
  4: "Question 4: Who lives in a pineapple under the sea?",
  5: "Question 5: Which is harder, diamond or chalk?"
}

var answers = {
  1: "4",
  2: "London",
  3: "1",
  4: "Spongebob",
  5: "Diamond"
}

var players = {
  "bank": 0,
  "p1": 1,
  "p2": 2,
  "p3": 3
}

var colours = {
  0: "black",
  1: "red",
  2: "green",
  3: "blue"
}

var scores = {
  0: 1,
  1: 1,
  2: 1,
  3: 1
}

// Questions
var questionId = 1;
var question = document.getElementById("question");
var answer = document.getElementById("answer");

function loadQuestion(id) {
  question.innerText = questions[id];
}

// Scores
var bank = document.getElementById("bank");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");

p1.parentElement.onclick = function () { submitAnswer(1); };
p2.parentElement.onclick = function () { submitAnswer(2); };
p3.parentElement.onclick = function () { submitAnswer(3); };

function updateScores() {
  bank.innerText = "Bank: £" + money.toFixed(2);
  // p1.innerText = "Player 1: £" + scores[players["p1"]].toFixed(2);
  // p2.innerText = "Player 2: £" + scores[players["p2"]].toFixed(2);
  // p3.innerText = "Player 3: £" + scores[players["p3"]].toFixed(2);
}

// Pie chart
var chart = document.getElementById("pie-chart");
var context = chart.getContext("2d");

function drawOuterCircle(x, y) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
}

function drawLine(x, y) {
  context.beginPath();
  context.moveTo(originX, originY);
  context.lineTo(x, y);
  context.stroke();
}

function drawSector(startAngle, endAngle, colour) {
  // Convert to radians
  var startRadians = (startAngle - 90) / (180 / Math.PI);
  var endRadians = (endAngle - 90) / (180 / Math.PI);
  context.beginPath();
  context.arc(originX, originY, radius, startRadians, endRadians)
  context.lineTo(originX, originY);
  context.fillStyle = colour;
  context.fill();
}

function drawAngleLine(degrees) {
  // Convert to radians
  var radians = degrees / (180 / Math.PI);
  x = radius * Math.sin(radians) + originX;
  y = radius * -Math.cos(radians) + originY;
  drawLine(x, y);
}

function submitAnswer(p123) {
  if (answer.value.length == 0) {
    return;
  }

  if (answer.value.toLowerCase() == answers[questionId].toLowerCase()) {
    scores[p123] += 1;
    money += 100;
  }
  else {
    scores[0] += 1;
  }

  answer.value = "";
  updateScores();
  updatePie();
  questionId += 1;
  if (questionId < Object.keys(questions).length) {
    loadQuestion(questionId);
  }
  else {
    spinWheel();
  }
}

function updatePie() {
  // Angle drawing
  var totalScore = 0.0;
  for (var player in scores) {
    totalScore += scores[player];
  }
  var degreesPerPoint = 360.0 / totalScore;

  var angle = 0.0;
  for (var playerId = 0; playerId < Object.keys(players).length; playerId++) {
    var angleAddition = scores[playerId] * degreesPerPoint;
    drawSector(angle, angle + angleAddition, colours[playerId]);
    angle += angleAddition;
    drawAngleLine(angle);
  }
}

var pieSegs = 0;
var spinN = 0;
var finalAngle = 0;
var spinDuration = 3000;
var t0 = 0;

function spinWheel() {
  pieSegs = 0;
  for (var score in scores) { // = 0; scoreId < Object.keys(scores).length; scoreId++) {
    pieSegs += scores[score];
  }
  spinN = Math.floor(Math.random() * pieSegs);
  finalAngle = 1080 + (2*spinN+1)*180/pieSegs;
  t0 = Date.now();
  animate();
}

function animate() {
  var t = Date.now() - t0;
  var a = 0;

  if (t <= spinDuration / 2) {
    a = finalAngle / 2 * Math.pow(2 * t / spinDuration, 2);
  }
  else if (t <= spinDuration) {
    t = spinDuration - t;
    a = finalAngle - (finalAngle / 2 * Math.pow(2 * t / spinDuration, 2));
  }
  else {
    alert("Thanks for playing The Wheel! Press F5 to play again...");
    return;
  }

  setAngle(a);
  setTimeout(animate, 16);
}

var contextAngle = 0;

function setAngle(angle) {
  context.clearRect(0, 0, chart.width, chart.height);
  context.translate(chart.width / 2, chart.height / 2);
  context.rotate((angle - contextAngle) * Math.PI / 180);
  context.translate(-chart.width / 2, -chart.height / 2);
  contextAngle = angle;
  updatePie();
}

// Main logic
loadQuestion(questionId);
updateScores();
drawOuterCircle(200, 200, radius - 5);
updatePie();