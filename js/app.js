'use strict';


// STUCK:
/* If I go the strategy of trying to render the object array of cookieNumPerHour, it says undefined, but is in the correct location. If I go the strategy of trying to move the code rendered in JQuery (the header and the locations, I can't get it to correctly line up with the cookie data) */

// array of hours
var time = ['6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];
var allLocations = [];
var tableEl = document.getElementById('table');
var totalOfTotals = 0;
var totalCookiesPerHour = [];


// constructor function for business locations
function BusinessLocation(name, minPerCust, maxPerCust, avgCookiePerSale) {
  this.name = name;
  this.min = minPerCust;
  this.max = maxPerCust;
  this.cookieAvg = avgCookiePerSale;
  this.avgCustomerNum = [];
  this.cookieNumPerHr = [];
  this.totalCookies = 0;
  // pushes contextual-this into array
  allLocations.push(this);
}


//======= PROTOTYPE FUNCTIONS ========
// calculates average customer number
BusinessLocation.prototype.generateCustomerNum = function(){
  this.avgCustomerNum = [];
  for (var i = 0; i < time.length; i++) {
    // uses helper function called makesRandomNumber
    var customerValue = makesRandomNumber(this.min, this.max);
    //console.log('customer value is ' + customerValue);
    this.avgCustomerNum.push(customerValue);
  }
};


// Calculates cookies per hour to fill array, and adds those up to get value for Location Total column
BusinessLocation.prototype.generateCookiesPerHour = function(){
  this.generateCustomerNum();
  this.cookieNumPerHr = [];
  this.totalCookies = 0;
  for (var i = 0; i < time.length; i++){
    var cookieValue = Math.ceil(this.cookieAvg * this.avgCustomerNum[i]);
    //console.log('cookie value', cookieValue);
    this.cookieNumPerHr.push(cookieValue);
    //add up cookies
    this.totalCookies += this.cookieNumPerHr[i];
  }
};


// Renders: location names
BusinessLocation.prototype.renderTableLocations = function(){
  var locationThis = this.name;
  $(function(){
    $('#table').append('<tr><td class = "location-data">' + locationThis + '</td></tr');
  });
};


// Renders: cookies per hour and cookie total per location
BusinessLocation.prototype.renderTableContent = function() {
  this.generateCookiesPerHour();
  this.renderTableLocations();

  var trEl = document.createElement('tr');
  trEl.setAttribute('class', 'cookie-data');
  tableEl.appendChild(trEl);

  // Render cookies per hour - fills in body of table with numbers
// Render cookies per hour - fills in body of table with numbers
for (var i = 0; i < this.cookieNumPerHr.length; i++){
  addElement('td', this.cookieNumPerHr[i], trEl);
}
// Render the cookie total per location - fills in bottom row for each column
addElement('td', this.totalCookies, trEl);
  
};




//======= INSTANCES ========
// make instances
new BusinessLocation('First and Pike', 23, 65, 6.3);
new BusinessLocation('SeaTac', 3, 24, 1.2);
new BusinessLocation('Seattle Center', 11, 38, 3.7);
new BusinessLocation('Capitol Hill', 20, 38, 2.3);
new BusinessLocation('Alki', 2, 16, 4.6);


//======= EVENT HANDLER ========
// Event handler
function handleClick(event){
  event.preventDefault();

  // target events
  var name = event.target.name.value;
  var minPerCust = event.target.minPerCust.value;
  var maxPerCust = event.target.maxPerCust.value;
  var avgCookiePerSale = event.target.avgCookiePerSale.value;
  console.log('here are the 4 input parameters from the form: ' + name, minPerCust, maxPerCust, avgCookiePerSale);

  // create instance for location - so user can add a location to table
  new BusinessLocation(name, minPerCust, maxPerCust, avgCookiePerSale);
  console.log('allLocations: ', allLocations);

  // removes original data from table, so table can refresh with updated location and data
  tableEl.innerHTML='';
  $(function(){
    $('#table').html('');
  });

  // re-render table
  renderAll();
}


//======= HELPER FUNCTION ========
// helper function to generate random number of customers
// got this function from MDN - math.random() doc

function makesRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// helper function to make a table
function addElement(childElType, childContent, parentEl){
  var childEl = document.createElement(childElType);
  childEl.textContent = childContent;
  parentEl.appendChild(childEl);
}


//======= EVENT LISTENER ========
// event listener
var formEl = document.getElementById('form');
formEl.addEventListener('submit', handleClick);


//======= FUNCTIONS ========
// makes table header
function makeHeader(){
  $(function(){
    $('#table').append('<tr id = "header-row"></tr>');
    for(var i = 0; i < time.length; i++){
      $('#header-row').append('<th>' + time[i] + '</th>');
    }
    $('#header-row').append('<th>' + 'Location Total' + '</th>').prepend('<th>' + '' + '</th>');
  });
}


// makes table footer - Hourly Totals row - which includes total of the location totals
function makeFooter(){
  calculateTotalCookiesEveryHour();
  calculateTotalofLocationTotals();

  var trEl = document.createElement('tr');
  tableEl.appendChild(trEl);

  // make title for row in column 1
  addElement('td', 'Hourly Totals', trEl);

  // iterate through array with totals to make new row
  for (var i = 0; i < totalCookiesPerHour.length; i ++){
    addElement('td', totalCookiesPerHour[i], trEl);
  }
  // render grand total for Location Total column
  addElement('td', totalOfTotals, trEl);

  // alert box for testing JQuery
  $(function(){
    var val = $('table').html();
    alert(val);
  });
}


// calculate the number of cookies produced from all stores each hour
function calculateTotalCookiesEveryHour(){
  totalCookiesPerHour = [];
  for (var i = 0; i < time.length; i++){
    var total = 0;
    for (var j = 0; j < allLocations.length; j++){
      total += allLocations[j].cookieNumPerHr[i];
      console.log('I am the total from allLocations[j].cookieNumPerHr[i]');
    }
    totalCookiesPerHour.push(total);
  }
  return totalCookiesPerHour;
}


// calculate the total from the totals column -> totalOfTotals is placed in lower right of table
function calculateTotalofLocationTotals(){
  totalOfTotals = 0;
  for (var i = 0; i < allLocations.length; i++){
    totalOfTotals += allLocations[i].totalCookies;
  }
  return totalOfTotals;
}


// Iterates through all instances to render table
function renderAll(){
  makeHeader();

  // Calls renderLocation prototype on each instance
  for (var i = 0; i < allLocations.length; i++){
    allLocations[i].renderTableContent();
  }
  makeFooter();
}

// Render Everything
renderAll();