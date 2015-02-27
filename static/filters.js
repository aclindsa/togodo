function TagFilter(tag) {
	this.tag = tag;
}
/* Return true to keep the todo */
TagFilter.prototype.filter = function(todo) {
	return (todo.Tags.indexOf(this.tag) != -1);
}
TagFilter.prototype.name = function() {
	return "Tag: "+this.tag;
}

function CompletedFilter() {}
/* Return true to keep the todo */
CompletedFilter.prototype.filter = function(todo) {
	return todo.Completed;
}
CompletedFilter.prototype.name = function() {
	return "Completed Tasks";
}

function UncompletedFilter() {}
/* Return true to keep the todo */
UncompletedFilter.prototype.filter = function(todo) {
	return !todo.Completed;
}
UncompletedFilter.prototype.name = function() {
	return "Uncompleted Tasks";
}
