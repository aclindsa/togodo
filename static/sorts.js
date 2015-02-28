function DueDateSort(reverse) {
	if (typeof reverse == "boolean")
		this.reverse = reverse;
	else
		this.reverse = false;
}
DueDateSort.prototype.name = function() {
	return "Due Date " + (this.reverse ? "(descending)" : "(ascending)");
}
DueDateSort.prototype._sort = function(a, b) {
	if (!a.HasDueDate && !b.HasDueDate)
		return 0;
	else if (!a.HasDueDate)
		return 1;
	else if (!b.HasDueDate)
		return -1;
	else if (a.DueDate > b.DueDate)
		return 1;
	else
		return -1;
}
DueDateSort.prototype.sort = function(a, b) {
	if (this.reverse)
		return this._sort(b, a);
	return this._sort(a, b);
}

function CompletedSort(reverse) {
	if (typeof reverse == "boolean")
		this.reverse = reverse;
	else
		this.reverse = false;
}
CompletedSort.prototype.name = function() {
	return (this.reverse ? "Uncompleted" : "Completed");
}
CompletedSort.prototype._sort = function(a, b) {
	if ((!a.Completed && !b.Completed) || (a.Completed && b.Completed))
		return 0;
	else if (a.Completed)
		return 1;
	else
		return -1;
}
CompletedSort.prototype.sort = function(a, b) {
	if (this.reverse)
		return this._sort(b, a);
	return this._sort(a, b);
}
