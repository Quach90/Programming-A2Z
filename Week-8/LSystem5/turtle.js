// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

function Turtle(s, l, t) {
  this.todo = s;
  this.len = l;
    this.theta = t;

  this.render = function() {
    stroke(255);
    for (var i = 0; i < this.todo.length; i++) {
      var c = this.todo.charAt(i);
      if (c === 'F' || c === 'G') {
        line(0,0,0,this.len);
        translate(0,this.len);
      } else if (c === 'O') {
        this.changeLen(0.5);
      } else if (c === 'P') {
        this.changeLen(2);
      }
      else if (c === 'E') {
        noFill();
        ellipse(0,0,this.len*2,this.len*2)
      }
      else if (c === 'M') {
        translate(0,this.len);
      }
      else if (c === '+') {
        rotate(this.theta);
      }
      else if (c === '-') {
        rotate(-this.theta);
      }
      else if (c === '*') {
        random() > 0.5 ? rotate(this.theta) : rotate(-this.theta);
      }
      else if (c === '[') {
        push();
      }
      else if (c === ']') {
        pop();
      }
    }
  };

  this.setLen = function(l) {
    this.len = l;
  };

  this.changeLen = function(percent) {
    this.len *= percent;
  };

  this.setToDo = function(s) {
    this.todo = s;
  };
}
