function User() {
	this.UserId = -1;
	this.Name = "";
	this.Username = "";
	this.Password = "";
	this.Email = "";
}

User.prototype.toJSON = function() {
	var json_obj = {};
	json_obj.UserId = this.UserId;
	json_obj.Name = this.Name;
	json_obj.Username = this.Username;
	json_obj.Password = this.Password;
	json_obj.Email = this.Email;
	return JSON.stringify(json_obj);
}

User.prototype.fromJSON = function(json_input) {
	var json_obj;
	if (typeof json_input == "string")
		json_obj = $.parseJSON(json_input)
	else if (typeof json_input == "object")
		json_obj = json_input;
	else
		console.error("Unable to parse json:", json_input);

	if (json_obj.hasOwnProperty("UserId"))
		this.UserId = json_obj.UserId
	if (json_obj.hasOwnProperty("Name"))
		this.Name = json_obj.Name
	if (json_obj.hasOwnProperty("Username"))
		this.Username = json_obj.Username
	if (json_obj.hasOwnProperty("Password"))
		this.Password = json_obj.Password
	if (json_obj.hasOwnProperty("Email"))
		this.Email = json_obj.Email
}

User.prototype.isUser = function() {
	var empty_user = new User();
	return this.UserId != empty_user.UserId ||
		this.Username != empty_user.Username;
}

function Session() {
	this.SessionId = -1;
	this.UserId = -1;
}

Session.prototype.toJSON = function() {
	var json_obj = {};
	json_obj.SessionId = this.SessionId;
	json_obj.UserId = this.UserId;
	return JSON.stringify(json_obj);
}

Session.prototype.fromJSON = function(json_input) {
	var json_obj;
	if (typeof json_input == "string")
		json_obj = $.parseJSON(json_input)
	else if (typeof json_input == "object")
		json_obj = json_input;
	else
		console.error("Unable to parse json:", json_input);

	if (json_obj.hasOwnProperty("SessionId"))
		this.SessionId = json_obj.SessionId
	if (json_obj.hasOwnProperty("UserId"))
		this.UserId = json_obj.UserId
}

Session.prototype.isSession = function() {
	var empty_session = new Session();
	return this.SessionId != empty_session.SessionId ||
		this.UserId != empty_session.UserId;
}

function Error() {
	this.ErrorId = -1;
	this.ErrorString = "";
}

Error.prototype.toJSON = function() {
	var json_obj = {};
	json_obj.ErrorId = this.ErrorId;
	json_obj.ErrorString = this.ErrorString;
	return JSON.stringify(json_obj);
}

Error.prototype.fromJSON = function(json_input) {
	var json_obj;
	if (typeof json_input == "string")
		json_obj = $.parseJSON(json_input)
	else if (typeof json_input == "object")
		json_obj = json_input;
	else
		console.error("Unable to parse json:", json_input);

	if (json_obj.hasOwnProperty("ErrorId"))
		this.ErrorId = json_obj.ErrorId
	if (json_obj.hasOwnProperty("ErrorString"))
		this.ErrorString = json_obj.ErrorString
}

Error.prototype.isError = function() {
	var empty_error = new Error();
	return this.ErrorId != empty_error.ErrorId ||
		this.ErrorString != empty_error.ErrorString;
}
