function niceDateString(date) {
	var hours = date.getHours();
	var ampm = "AM";
	if (hours >= 12) {
		ampm = "PM";
		if (hours > 12)
			hours = hours - 12;
	}
	if (hours == 0)
		hours = 12;
	var minutes = date.getMinutes()
	if (minutes < 10)
		minutes = "0"+minutes
	return (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+hours+":"+minutes+" "+ampm;
}
