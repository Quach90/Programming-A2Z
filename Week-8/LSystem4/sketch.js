// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// An L-System object
var lsys;
// A Turtle object
var turtle;
// How many times has recursion happened
var generations = 0;


function setup() {

  // Create the canvas and use parent to place on the HTML page
  var canvas = createCanvas(800, 800);
  canvas.parent('canvas');

  var ruleset = [];

  // Some other rules to try
  // // Fill with two rules (These are rules for the Sierpinksi Gasket Triangle)
  // ruleset[0] = new Rule('F',"F--F--F--G");
  // ruleset[1] = new Rule('G',"GG");
  // // Create LSystem with axiom and ruleset
  // lsys = new LSystem("F--F--F",ruleset);
  // turtle = new Turtle(lsys.getSentence(),width*2,TWO_PI/3);

  // ruleset[0] = new Rule('F',"F[F]-F+F[--F]+F-F");
  // ruleset[0] = new Rule('F',"FF+[+F-F-F]-[-F+F+F]");
  // lsys = new LSystem("F-F-F-F",ruleset);
  // turtle = new Turtle(lsys.getSentence(),width-1,PI/2);

  // ruleset[0] = new Rule('F', "FF+[+F-F-F]-[-F+F+F]");
  // lsys = new LSystem("F", ruleset);
  // turtle = new Turtle(lsys.getSentence(), height/3, radians(60));

  // ruleset[0] = new Rule('G', "F++F++F++F");
  // ruleset[0] = new Rule('F', "F*F*F*F*F");
  // lsys = new LSystem("[F]++[F]++[F]++[F]++[F]++[F]", ruleset);
  // turtle = new Turtle(lsys.getSentence(), 300, radians(30));

  // ruleset[0] = new Rule('F', "GG--[F]+++[F]+++[F]");
  // lsys = new LSystem("[F]++[F]++[F]++[F]++[F]++[F]", ruleset);
  // turtle = new Turtle(lsys.getSentence(), 50, radians(30));

  ruleset[0] = new Rule('B', "F[-B++N]");
  ruleset[1] = new Rule('N', "FF-OKP");
  ruleset[2] = new Rule('K', "E[-K++N]");

  // ruleset[1] = new Rule('B', "G[--H][++H]");
  // ruleset[2] = new Rule('H', "G[-H][+H]");
  lsys = new LSystem("B", ruleset);
  turtle = new Turtle(lsys.getSentence(), 50, radians(30));

  // Place the current sentence on the page
  var sentence = select('#sentence');
  sentence.style('width', windowWidth-width-100 +'px');
  sentence.html(lsys.getSentence());

  // Deal with generate button
  var button = select('#generate');
  button.mousePressed(generate);

  // No draw loop
  noLoop();
}

// Get the turtle drawing!
function draw() {
  background(51);
  fill(0);
  //text("Click mouse to generate", 10, height-10);

  translate(width/2, height/2);
  rotate(-PI/2);
  turtle.render();
}

// Every time the mouse is pressed generate and redraw
function generate() {
  // Stop after a certain point
  if (generations < 20) {

    // Generate and draw!
    lsys.generate();
    turtle.setToDo(lsys.getSentence());
    turtle.changeLen(1);
    redraw();

    // Update the DOM element
    var sentence = select('#sentence');
    sentence.html(lsys.getSentence());

    generations++;
  }
}

function windowResized() {
  var sentence = select('#sentence');
  sentence.style('width', windowWidth-width-100 +'px');
}
