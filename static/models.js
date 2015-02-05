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

User.prototype.fromJSON = function(json_str) {
	json_obj = $.parseJSON(json_str)
	if (json_obj.hasOwnProperty("Name"))
		this.Name = json_obj.Name
	if (json_obj.hasOwnProperty("Username"))
		this.Username = json_obj.Username
	if (json_obj.hasOwnProperty("Password"))
		this.Password = json_obj.Password
	if (json_obj.hasOwnProperty("Email"))
		this.Email = json_obj.Email
}
