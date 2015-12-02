// implicit:
// if (Meteor.isClient) {
// golly isn't meteor such dandy software?

Template.eggtimer.helpers({
  marks: [ '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am',
           '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
           '6pm', '7pm', '8pm', '9pm', '10pm', '11pm' ]
});

Template.barchart.onRendered(_ => {
  var mockdata = `State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over
AL,310504,552339,259034,450818,1231572,1215966,641667
AK,52083,85640,42153,74257,198724,183159,50277
AZ,515910,828669,362642,601943,1804762,1523681,862573
AR,202070,343207,157204,264160,754420,727124,407205
CA,2704659,4499890,2159981,3853788,10604510,8819342,4114496
CO,358280,587154,261701,466194,1464939,1290094,511094
CT,211637,403658,196918,325110,916955,968967,478007
DE,59319,99496,47414,84464,230183,230528,121688
DC,36352,50439,25225,75569,193557,140043,70648
FL,1140516,1938695,925060,1607297,4782119,4746856,3187797
GA,740521,1250460,557860,919876,2846985,2389018,981024
HI,87207,134025,64011,124834,356237,331817,190067
ID,121746,201192,89702,147606,406247,375173,182150
IL,894368,1558919,725973,1311479,3596343,3239173,1575308
IN,443089,780199,361393,605863,1724528,1647881,813839
IA,201321,345409,165883,306398,750505,788485,444554
KS,202529,342134,155822,293114,728166,713663,366706
KY,284601,493536,229927,381394,1179637,1134283,565867
LA,310716,542341,254916,471275,1162463,1128771,540314
ME,71459,133656,69752,112682,331809,397911,199187
MD,371787,651923,316873,543470,1556225,1513754,679565
MA,383568,701752,341713,665879,1782449,1751508,871098
MI,625526,1179503,585169,974480,2628322,2706100,1304322
MN,358471,606802,289371,507289,1416063,1391878,650519
MS,220813,371502,174405,305964,764203,730133,371598
MO,399450,690476,331543,560463,1569626,1554812,805235
MT,61114,106088,53156,95232,236297,278241,137312
NE,132092,215265,99638,186657,457177,451756,240847
NV,199175,325650,142976,212379,769913,653357,296717
NH,75297,144235,73826,119114,345109,388250,169978
NJ,557421,1011656,478505,769321,2379649,2335168,1150941
NM,148323,241326,112801,203097,517154,501604,260051
NY,1208495,2141490,1058031,1999120,5355235,5120254,2607672
NC,652823,1097890,492964,883397,2575603,2380685,1139052
ND,41896,67358,33794,82629,154913,166615,94276
OH,743750,1340492,646135,1081734,3019147,3083815,1570837
OK,266547,438926,200562,369916,957085,918688,490637
OR,243483,424167,199925,338162,1044056,1036269,503998
PA,737462,1345341,679201,1203944,3157759,3414001,1910571
RI,60934,111408,56198,114502,277779,282321,147646
SC,303024,517803,245400,438147,1193112,1186019,596295
SD,58566,94438,45305,82869,196738,210178,116100
TN,416334,725948,336312,550612,1719433,1646623,819626
TX,2027307,3277946,1420518,2454721,7017731,5656528,2472223
UT,268916,413034,167685,329585,772024,538978,246202
VT,32635,62538,33757,61679,155419,188593,86649
VA,522672,887525,413004,768475,2203286,2033550,940577
WA,433119,750274,357782,610378,1850983,1762811,783877
WV,105435,189649,91074,157989,470749,514505,285067
WI,362277,640286,311849,553914,1487457,1522038,750146
WY,38253,60890,29314,53980,137338,147279,65614`;
  // is there a way to not hardcode widths?
  var margin = { top: 20, right: 20, bottom: 30, left: 40 };
  var width  = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);
  var y = d3.scale.linear()
    .rangeRound([height, 0]);
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(d3.format('.2s'));

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var svg = d3.select('#barchart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var data = d3.csv.parse(mockdata);

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.State; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});

Template.landing.helpers({
  tasks: _ => {
    if (Session.get("hideCompleted")) {
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 }});
    } else {
      return Tasks.find({}, { sort: { createdAt: -1 } });
    }
  },
  hideCompleted: function() {
    return Session.get("hideCompleted");
  }
});

Template.landing.events({
  "submit .new-task": event => {
    event.preventDefault();
    var text = event.target.text.value;

    Tasks.insert({
      text,
      createdAt: new Date()
    });

    event.target.text.value = "";
  },
  "change .hide-completed input": event => {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.task.events({
  "click .toggle-checked": function() {
    Tasks.update(this._id, {
      $set: { checked: ! this.checked }
    });
  },
  "click .delete": function() {
    Tasks.remove(this._id);
  }
});
