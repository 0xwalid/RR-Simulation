
function Process() {
  arrival: 0;
  name: 'a';
  totalBurst: 0;
  remainingBurst: 0;
  id : 0;
  waitingTime:0;
}

function compare(a,b) {
  if (a.arrival < b.arrival)
     return -1;
  if (a.arrival > b.arrival)
    return 1;
  return 0;
}

var q = new Queue();
var original = [];
var tempArr = [];

var container = document.getElementById('visualization');

var a = new Date();
var b = new Date();
var now = a.toGMTString();
a.setMilliseconds(0);
b.setMilliseconds(2);
var items = new vis.DataSet([
  {id: 1, content: 'Welcome To Round Robin Simulation', start: a, end: b},
]);

// Configuration for the Timeline
var options = {
  'zoomMax': 1000
};

// Create a Timeline
var timeline = new vis.Timeline(
  container,
  items,
  options
  );


$(document).ready(function() {
  $(document).on('click', '#add-process', function() {
    time= 0;
    p = new Process();
    p.name = $('#name').val();
    p.arrival = parseInt($('#arrive').val());
    p.totalBurst = parseInt($('#cpu').val());
    p.remainingBurst = parseInt($('#cpu').val());
    p.waitingTime = 0;
    p.turnaround = 0;
    p.id = original.length +1;
    q = new Queue();
    original.push(p);
    tempArr = JSON.parse(JSON.stringify(original));
    tempArr.sort(compare);
    $('#name').val('');$('#arrive').val('');$('#cpu').val('');$('#cpu').val('');
    var quantom = parseInt($('#quantom').val());
    var i = 0;
    var tempP;
    var tempQ = 0;
    var time = 0;
    var avg = 0;
    var timeRanges = [];
    while (!q.isEmpty() || i != tempArr.length || tempP) {
      while (i < tempArr.length && time == tempArr[i].arrival) {
        q.enqueue(tempArr[i]);
        i++;
      }

      if (tempQ && tempP && tempP.remainingBurst != 0) {
        tempP.remainingBurst -= 1;
        tempQ--;
        console.log(time + ":" + tempP.name);
        console.log(tempP);
      } else {
        if (tempP && tempP.remainingBurst != 0) {
          q.enqueue(tempP);
        }

        tempP = q.dequeue();
        tempQ = quantom;
        if (tempP) {
          if (tempP.remainingBurst == tempP.totalBurst) {
            tempP.turnaround = time;
          }
          console.log(time + ":" + tempP.name);
          tempP.remainingBurst -= 1;
          tempQ--;
        }
      }
      if (tempP && tempP.remainingBurst == 0) {
        tempP.turnaround = time - tempP.turnaround +1;
      }
      if (!tempP) {
        if (timeRanges.length != 0 && timeRanges[timeRanges.length-1].idle) {
          timeRanges[timeRanges.length-1].end.setMilliseconds(timeRanges[timeRanges.length-1].end.getMilliseconds()+1);
        } else {
          var start = new Date(now);
          start.setMilliseconds(time);
          var end = new Date(now);
          end.setMilliseconds(time+1);
          timeRanges.push({start: start, end: end, idle: true, content:"Idle"});
        }
      } else {
        if (timeRanges.length != 0 && timeRanges[timeRanges.length-1].pid == tempP.id) {
          timeRanges[timeRanges.length-1].end.setMilliseconds(timeRanges[timeRanges.length-1].end.getMilliseconds()+1);
        } else {
          var start = new Date(now);
          start.setMilliseconds(time);
          var end = new Date(now);
          end.setMilliseconds(time+1);
          timeRanges.push({start: start, end: end, pid: tempP.id, idle: false, content: tempP.name});
        }
        for (var j = 0; j < tempArr.length; j++) {
          if (tempArr[j].id != tempP.id && tempArr[j].remainingBurst != 0 && tempArr[j].arrival <= time) {
            console.log("Time " + time + " current: " + tempP.id + " incr " + tempArr[j].id + " with burstrem "+ tempArr[j].remainingBurst);
            tempArr[j].waitingTime++;
            avg++;
          }
        };
      }
      time++;
    }
    timeline.clear();
    timeline.setItems(timeRanges);
    console.log(timeRanges);
    $('#results').html('');
    $('#results').append('<h4>Average Waiting Time: '+avg/tempArr.length+'</h4>');
    for (var k = 0; k < tempArr.length; k++) {
      $('#results').append('<h5>Process('+tempArr[k].name+'): Waiting Time: '+tempArr[k].waitingTime+' ------- Turnaround Time: '+(tempArr[k].turnaround)+'</h5>');
    };
  });
});

