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

function Todo() {
	this.TodoId = -1;
	this.Description = "";
	this.Due = new Date(0);
	this.Notes = "";
	this.Completed = false;
}

Todo.prototype.toJSON = function() {
	var json_obj = {};
	json_obj.TodoId = this.TodoId;
	json_obj.Description = this.Description;
	json_obj.Due = this.Due.toJSON();
	json_obj.Notes = this.Notes;
	json_obj.Completed = this.Completed;
	return JSON.stringify(json_obj);
}

Todo.prototype.fromJSON = function(json_input) {
	var json_obj;
	if (typeof json_input == "string")
		json_obj = $.parseJSON(json_input)
	else if (typeof json_input == "object")
		json_obj = json_input;
	else
		console.error("Unable to parse json:", json_input);

	if (json_obj.hasOwnProperty("TodoId"))
		this.TodoId = json_obj.TodoId
	if (json_obj.hasOwnProperty("Description"))
		this.Description = json_obj.Description
	if (json_obj.hasOwnProperty("Due")) {
		this.Due = json_obj.Due
		if (typeof this.Due === 'string') {
			var t = Date.parse(this.Due);
			if (t)
				this.Due = new Date(t);
			else
				this.Due = new Date(0);
		} else
			this.Due = new Date(0);
	}
	if (json_obj.hasOwnProperty("Notes"))
		this.Notes = json_obj.Notes
	if (json_obj.hasOwnProperty("Completed"))
		this.Completed = json_obj.Completed
}

Todo.prototype.copy = function() {
	var newTodo = new Todo();
	newTodo.TodoId = this.TodoId;
	newTodo.Description = this.Description;
	newTodo.Due = this.Due;
	newTodo.Notes = this.Notes;
	newTodo.Completed = this.Completed;
	return newTodo;
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
