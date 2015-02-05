function IsError(json_obj) {
	if (json_obj.hasOwnProperty("ErrorId"))
		return true;
	else
		return false;
}
