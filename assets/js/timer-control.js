	var timeholder = document.getElementById('timeholder');
	// var arrIndex = Array.from(timeholder.children);
	var timeZones = {
		'London' : 0,
		'Dubai' : -4,
		'NYC' : 4,
		'Los Angeles' : 7,
		'Las Vegas' : 7,
		'Honolulu' : 10,
		'Sydney' : -11,
		'Tokyo' : -9,
		'Beijing' : -8,
		'Singapore' : -8,
		'Bangkok' : -7,
		'Moscow' : -3,
		'Delhi' : -5.5,
		'Maldives' : -5,
		'Cape Town' : -2,
		'San Paolo' : 3,
		'Mexico City': 6,
		'St Barts' : 4,
		'Mykonos' : -2,
		'Cannes' : -1,
		'Lima' : 5,
		'Viareggio' : -1,
		'Paisley' : 0
	};
	function dateGenerate(){
		var count = 0;
		
		var node = document.getElementsByClassName('zone');
		for(tzone in timeZones){
			var d = new Date();
			var UTCoffset = d.getTimezoneOffset();
			d.setMinutes(d.getMinutes() + UTCoffset);
			d.setMinutes(d.getMinutes() - (timeZones[tzone] * 60 ));		
			// console.log(d,tzone);
			
			var h = d.getHours();
			var m = d.getMinutes();
			var amOrpm = h >= 12 ? 'PM' : 'AM';
			if(h < 10){
				h = '0'+ h;
			}
			if(m < 10){
				m = '0' + m;
			}
			node[count].textContent = h +':'+ m + ' ' + tzone;
			count++;
		}
	}
	dateGenerate();
	setInterval(dateGenerate,60000);	