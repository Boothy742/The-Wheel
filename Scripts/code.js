var radius = 195;
var originX = 200;
var originY = 200;

//Data
var questions = {
  1: "Question 1",
  2: "Question 2",
  3: "Question 3",
  4: "Question 4",
  5: "Question 5"
}

var answers = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5"
}

var players = {
  "bank": 0,
  "p1": 1,
  "p2": 2,
  "p3": 3
}

var scores = {
  0: 30.001,
  1: 10.001,
  2: 20.001,
  3: 5.001
}

var playerAngles = {
  0: 30.001,
  1: 10.001,
  2: 20.001,
  3: 5.001
}

// Questions
var questionId = 1;
var question = document.getElementById("question");

function loadQuestion(id) {
  question.innerText = questions[id];
}

// Scores
var bank = document.getElementById("bank");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");

function updateScores() {
  bank.innerText = "Bank: £" + scores[players["bank"]].toFixed(2);
  p1.innerText = "Player 1: £" + scores[players["p1"]].toFixed(2);
  p2.innerText = "Player 2: £" + scores[players["p2"]].toFixed(2);
  p3.innerText = "Player 3: £" + scores[players["p3"]].toFixed(2);
}

// Pie chart
var chart = document.getElementById("pie-chart");
var context = chart.getContext("2d");

function drawOuterCircle(x, y)
{
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

function drawAngle(degrees) {
  console.log(degrees);
  // Convert to radians
  var radians = degrees / (180 / Math.PI);
  x = radius * Math.sin(radians) + originX;
  y = radius * -Math.cos(radians) + originY;
  console.log(x, y);
  drawLine(x, y);
}

// Main logic
loadQuestion(questionId);
updateScores();
drawOuterCircle(200, 200, radius - 5);

// Angle drawing
var totalScore = 0.0;
for (var player in scores)
{
  totalScore += scores[player];
}
var degreesPerPoint = 360.0 / totalScore;

var degrees = 0.0;
for (var playerId = 0; playerId < Object.keys(players).length; playerId++) {
  degrees += scores[playerId] * degreesPerPoint;
  drawAngle(degrees);
}