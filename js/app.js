(function() {

	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
	var timerUpdateDate = 0;
  var interval;

  function updateTime() {
      var timeHours = document.getElementById("time-hours");
      var timeMinutes = document.getElementById("time-minutes");
      var datetime = tizen.time.getCurrentDateTime();
      var hour = datetime.getHours();
      var minute = datetime.getMinutes();

      timeMinutes.innerHTML = minute;

      if (hour < 10) {
      	timeHours.innerHTML = "0" + hour;
      } else {
      	timeHours.innerHTML = hour;
      }

      if (minute < 10) {
      	timeMinutes.innerHTML = "0" + minute;
      }
  }

  function updateDate(prevDay) {

  	var nextInterval;
  	var datetime = tizen.time.getCurrentDateTime();
  	var getDay = datetime.getDay();
    var date = datetime.getDate();
    var month = datetime.getMonth();
    var year = datetime.getFullYear();

    if (prevDay !== null) {
        if (prevDay === getDay) {
            nextInterval = 1000;
        } else {
            nextInterval = (23 - datetime.getHours()) * 60 * 60 * 1000 + (59 - datetime.getMinutes()) * 60 * 1000 + (59 - datetime.getSeconds()) * 1000 + (1000 - datetime.getMilliseconds()) + 1;
        }
    }

    if (date < 10) {
        date = "0" + date;
    }

    var strDate = date + "/" + month + "/" + year;
    var dateDiv = document.getElementById("date");
    dateDiv.innerHTML = strDate;

    // If an updateDate timer already exists, clear the previous timer.
    if (timerUpdateDate) {
        clearTimeout(timerUpdateDate);
    }

    // Set next timeout for date update.
    timerUpdateDate = setTimeout(function() {
         updateDate(getDay);
    }, nextInterval);
  }

  function updateBattery() {
  	 var batteryLevel = Math.floor(battery.level * 100);
     var batteryFill = document.getElementById("battery-fill");
     var batteryPercent = document.getElementById("battery");
     var batteryIcon = document.getElementById("battery-icon");
     var batteryIcon2 = document.getElementById("battery-icon2");

     batteryLevel = batteryLevel + 1;

     batteryFill.style.width = batteryLevel + "%";
     batteryPercent.innerHTML = batteryLevel + "%";

     if(batteryLevel < 10) {
    	 batteryIcon.style.border = "1px solid red";
    	 batteryIcon2.style.backgroundColor = "red";
    	 batteryFill.style.backgroundColor = "red";
     } else {
    	 batteryIcon.style.border = "1px solid white";
    	 batteryIcon2.style.backgroundColor = "white";
    	 batteryFill.style.backgroundColor = "white";
     }
  }

  function callUpdateTime() {
  	setInterval(updateTime, 500);
  }

  function init() {
  	updateDate(0);
  	callUpdateTime();

  	// Battery stuff
  	battery.addEventListener("chargingchange", updateBattery);
  	battery.addEventListener("chargingtimechange", updateBattery);
    battery.addEventListener("dischargingtimechange", updateBattery);
    battery.addEventListener("levelchange", updateBattery);

    window.addEventListener("ambientmodechanged", function(e) {
        if (e.detail.ambientMode === true) {
            ambientWatch();
        } else {
            initWatch();
        }
    });
  }

  function ambientWatch() {
  	document.getElementById("terminal1").style.visibility = "hidden";
  	document.getElementById("info").style.visibility = "hidden";
  	document.getElementById("terminal2").style.visibility = "hidden";
  }

  function initWatch() {
  	document.getElementById("terminal1").style.visibility = "visible";
  	document.getElementById("time").style.visibility = "visible";
  	document.getElementById("info").style.visibility = "visible";
  	document.getElementById("terminal2").style.visibility = "visible";
  }

  var callback = function(){
  	init();
	};

	if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
	  callback();
	} else {
	  document.addEventListener("DOMContentLoaded", callback);
	}

}());
