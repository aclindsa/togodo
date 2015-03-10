// Import all the objects we want to use from ReactBootstrap
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Input = ReactBootstrap.Input;

var Button = ReactBootstrap.Button;
var DropdownButton = ReactBootstrap.DropdownButton;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Glyphicon = ReactBootstrap.Glyphicon;

var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var MenuItem = ReactBootstrap.MenuItem;

var Jumbotron = ReactBootstrap.Jumbotron;

var OverlayMixin = ReactBootstrap.OverlayMixin;

// And the same for ReactWidgets
var Calendar = ReactWidgets.Calendar;
var Multiselect = ReactWidgets.Multiselect;

var BetterDateTimePicker = React.createClass({
	mixins: [OverlayMixin],
	getInitialState: function() {
		var disabled = this.props.disabled;
		if (disabled == null) {
			disabled = false;
		}
		var date = this.props.defaultValue;
		if (date == null) {
			date = new Date();
			disabled = true;
		}
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

		return {
			poppedUp: false,
			disabled: disabled,
			popoverLeft: 0,
			popoverTop: 0,
			date: date,
			hours: hours,
			minutes: minutes,
			ampm: ampm
		};
	},
	getDate: function(vars) {
		if (vars == null)
			vars = {
				date: this.state.date,
				hours: this.state.hours,
				minutes: this.state.minutes,
				ampm: this.state.ampm
			};
		var date = vars.date;
		date.setMinutes(parseInt(vars.minutes));
		var hours = parseInt(vars.hours);
		if (vars.ampm == "PM")
			hours = hours + 12;
		if (hours == 12 || hours == 24)
			hours = hours - 12
		date.setHours(hours);

		return date;
	},
	componentDidUpdate: function() {
		if (this.state.disabled)
			this.refs.input.getInputDOMNode().value = "";
		else
			this.refs.input.getInputDOMNode().value = niceDateString(this.getDate());
	},
	componentDidMount: function() {
		this.updateOverlayPosition();
	},
	handleClick: function() {
		if (this.state.poppedUp) {
			this.setState({
				poppedUp: false
			});
		} else {
			this.setState({
				poppedUp: true},
				function() { this.updateOverlayPosition(); }
			);
			this.handleEnable();
		}
	},
	handleCalendarChanged: function(date) {
		this.setState({
			date: date
		});
		this.handleChanged({
			date: date,
			hours: this.state.hours,
			minutes: this.state.minutes,
			ampm: this.state.ampm
		});
	},
	handleChanged: function(updatedVars) {
		if (this.props.onChange != null)
			this.props.onChange(this.getDate(updatedVars));
	},
	handleAMPMClick: function() {
		var newampm = "PM";
		if (this.state.ampm == "PM")
			newampm = "AM";
		this.setState({ampm: newampm});
		this.handleChanged({
			date: this.state.date,
			hours: this.state.hours,
			minutes: this.state.minutes,
			ampm: newampm
		});
	},
	handleSelectHours: function(hours) {
		this.setState({hours: hours});
		this.handleChanged({
			date: this.state.date,
			hours: hours,
			minutes: this.state.minutes,
			ampm: this.state.ampm
		});
	},
	handleSelectMinutes: function(minutes) {
		this.setState({minutes: minutes});
		this.handleChanged({
			date: this.state.date,
			hours: this.state.hours,
			minutes: minutes,
			ampm: this.state.ampm
		});
	},
	handleClose: function() {
		this.setState({poppedUp: false});
	},
	handleDisable: function() {
		this.setState({
			poppedUp: false,
			disabled: true
		});
		if (this.props.onDisable != null)
			this.props.onDisable();
	},
	handleEnable: function() {
		this.setState({disabled: false});
		if (this.props.onEnable != null)
			this.props.onEnable();
	},
	updateOverlayPosition: function() {
		var childNode = $(this.getDOMNode());
		var childOffset = childNode.offset()
		var overlayNode = this.getOverlayDOMNode();
		this.setState({
			popoverLeft: childOffset.left + childNode.width() / 2 - overlayNode.offsetWidth / 2,
			popoverTop: childOffset.top + childNode.height()
		});
	},
	renderOverlay: function() {
		if (!this.state.poppedUp)
			return <span />;
		return (
			<Popover
					positionLeft={this.state.popoverLeft}
					positionTop={this.state.popoverTop}
					placement="bottom">
				<Calendar
					onChange={this.handleCalendarChanged}
					defaultValue={this.state.date} />
				<ButtonGroup>
					<DropdownButton title={this.state.hours} onSelect={this.handleSelectHours} dropup>
						<MenuItem eventKey="1">1</MenuItem>
						<MenuItem eventKey="2">2</MenuItem>
						<MenuItem eventKey="3">3</MenuItem>
						<MenuItem eventKey="4">4</MenuItem>
						<MenuItem eventKey="5">5</MenuItem>
						<MenuItem eventKey="6">6</MenuItem>
						<MenuItem eventKey="7">7</MenuItem>
						<MenuItem eventKey="8">8</MenuItem>
						<MenuItem eventKey="9">9</MenuItem>
						<MenuItem eventKey="10">10</MenuItem>
						<MenuItem eventKey="11">11</MenuItem>
						<MenuItem eventKey="12">12</MenuItem>
					</DropdownButton>
					<DropdownButton title={this.state.minutes} onSelect={this.handleSelectMinutes} dropup>
						<MenuItem eventKey="00">00</MenuItem>
						<MenuItem eventKey="05">05</MenuItem>
						<MenuItem eventKey="10">10</MenuItem>
						<MenuItem eventKey="15">15</MenuItem>
						<MenuItem eventKey="20">20</MenuItem>
						<MenuItem eventKey="25">25</MenuItem>
						<MenuItem eventKey="30">30</MenuItem>
						<MenuItem eventKey="35">35</MenuItem>
						<MenuItem eventKey="40">40</MenuItem>
						<MenuItem eventKey="45">45</MenuItem>
						<MenuItem eventKey="50">50</MenuItem>
						<MenuItem eventKey="55">55</MenuItem>
					</DropdownButton>
					<Button onClick={this.handleAMPMClick}>{this.state.ampm}</Button>
				</ButtonGroup>
				<Button onClick={this.handleClose} className="pull-right">Close</Button>
			</Popover>
		);
	},
	render: function() {
		var button;
		if (this.state.disabled) {
			button = <Button onClick={this.handleEnable}>Set</Button>;
		} else {
			button = <Button onClick={this.handleDisable}>Clear</Button>;
		}
		var dateString = niceDateString(this.getDate());
		return (
			<Input type="text"
				disabled={this.state.disabled}
				onClick={this.handleClick}
				defaultValue={dateString}
				buttonAfter={button} ref="input"/>
		);
	}
});

var Tag = React.createClass({
	getHash: function() {
		var hash = 0;
		for (var i = 0; i < this.props.tag.length; i++) {
			var ch = this.props.tag.charCodeAt(i);
			hash = hash * 31 + ch * 17;
		}
		return hash;
	},
	render: function() {
		var classes="todo-list-tag todo-list-tag-" + (this.getHash() % 7);
		return (
			<span className={classes}>{this.props.tag}</span>
		);
	}
});

var TodoItem = React.createClass({
	getInitialState: function() {
		var selected = false;
		if (typeof this.props.selected !== 'undefined')
			selected = this.props.selected;
		return {
			hasDueDate: this.props.todo.HasDueDate,
			dueDate: this.props.todo.DueDate,
			hasReminder: this.props.todo.HasReminder,
			reminder: this.props.todo.Reminder,
			tags: this.props.todo.Tags,
			selected: selected
		};
	},
	handleDueDateChanged: function(due) {
		this.setState({dueDate: due});
	},
	handleDueDateDisabled: function() {
		this.setState({hasDueDate: false});
	},
	handleDueDateEnabled: function() {
		this.setState({hasDueDate: true});
	},
	handleReminderChanged: function(reminder) {
		this.setState({reminder: reminder});
	},
	handleReminderDisabled: function() {
		this.setState({hasReminder: false});
	},
	handleReminderEnabled: function() {
		this.setState({hasReminder: true});
	},
	handleCreateNewTag: function(tag) {
		var tags = this.state.tags;
		if (tags.indexOf(tag) == -1) {
			tags.push(tag);
			this.setState({tags: tags});
		}
	},
	handleTagsChanged: function(tags) {
		this.setState({tags: tags});
	},
	handleSaveSubmit: function(e) {
		e.preventDefault();
		this.setState({selected: false});
		var todo = this.props.todo.copy();
		todo.Description = this.refs.description.getValue();
		todo.Notes = this.refs.notes.getValue();
		todo.HasDueDate = this.state.hasDueDate;
		todo.DueDate = this.state.dueDate;
		todo.HasReminder = this.state.hasReminder;
		todo.Reminder = this.state.reminder;
		todo.Tags = this.state.tags;
		this.props.onUpdateTodo(todo);
	},
	handleClose: function() {
		this.setState({
			hasDueDate: this.props.todo.HasDueDate,
			dueDate: this.props.todo.DueDate,
			hasReminder: this.props.todo.HasReminder,
			reminder: this.props.todo.Reminder,
			tags: this.props.todo.Tags,
			selected: false,
		});
		if (this.props.onCloseTodo)
			this.props.onCloseTodo();
	},
	handleDelete: function() {
		this.props.onDeleteTodo(this.props.todo);
	},
	onClick: function(e) {
		this.setState({selected: true});
	},
	onCheckboxClicked: function(e) {
		e.stopPropagation();
		var todo = this.props.todo.copy();
		todo.Completed = !todo.Completed;
		this.props.onUpdateTodo(todo);
	},
	render: function() {
		var checkedString = "";
		if (this.props.todo.Completed)
			checkedString = "checked";
		var dateString = "";
		if (this.state.hasDueDate)
			dateString = "Due: " + niceDateString(this.state.dueDate);

		if (!this.state.selected) {
			var tagNodes = this.props.todo.Tags.map(function(tag) {
				return (
					<Tag tag={tag} />
				);
			});
			var reminderNodes = this.props.todo.HasReminder ? <Glyphicon glyph="bell" /> : [];
			return (
				<ListGroupItem onClick={this.onClick} className="todo-list-item">
					<form>
					<span className="col-xs-1">
					<Input type="checkbox"
							checked={checkedString}
							onClick={this.onCheckboxClicked} />
					</span>
					<span className="col-xs-7 todo-list-description">
						{tagNodes}
						{this.props.todo.Description}
						{reminderNodes}
					</span>
					<span className="col-xs-4 todo-list-duedate">
						{dateString}
					</span>
					</form>
				</ListGroupItem>
			);
		} else {
			return (
				<ListGroupItem>
					<form onSubmit={this.handleSaveSubmit} className="form-horizontal">
					<Input wrapperClassName="wrapper">
						<Row>
							<Col xs={2}><label className="control-label pull-right">Task</label></Col>
							<Col xs={9}><Input type="text"
								defaultValue={this.props.todo.Description}
								ref="description"/></Col>
						</Row>
						<Row>
							<Col xs={2}><label className="control-label pull-right">Due Date</label></Col>
							<Col xs={9}><BetterDateTimePicker
								defaultValue={this.state.dueDate}
								disabled={!this.state.hasDueDate}
								onChange={this.handleDueDateChanged}
								onEnable={this.handleDueDateEnabled}
								onDisable={this.handleDueDateDisabled}/></Col>
						</Row>
						<Row>
							<Col xs={2}><label className="control-label pull-right">Reminder</label></Col>
							<Col xs={9}><BetterDateTimePicker
								defaultValue={this.state.reminder}
								disabled={!this.state.hasReminder}
								onChange={this.handleReminderChanged}
								onEnable={this.handleReminderEnabled}
								onDisable={this.handleReminderDisabled}/></Col>
						</Row>
						<Row>
							<Col xs={2}><label className="control-label pull-right">Tags</label></Col>
							<Col xs={9}><Multiselect
									className="form-group"
									defaultValue={this.props.todo.Tags}
									data={this.props.tags}
									messages={{createNew: "(create new tag)",
										emptyList: "Type to create a new tag",
										emptyFilter: "No tags matched"}}
									onCreate={this.handleCreateNewTag}
									onChange={this.handleTagsChanged} /></Col>
						</Row>
						<Row>
							<Col xs={2}><label className="control-label pull-right">Notes</label></Col>
							<Col xs={9}><Input type="textarea"
								defaultValue={this.props.todo.Notes}
								ref="notes"/></Col>
						</Row>
						<Row>
							<Col xs={11}><ButtonGroup className="pull-right">
								<Button bsStyle="danger"
									onClick={this.handleDelete}>Delete</Button>
								<Button bsStyle="warning"
									onClick={this.handleClose}>Cancel</Button>
								<Button type="submit" bsStyle="success"
									onClick={this.handleSaveSubmit}>Save</Button>
							</ButtonGroup></Col>
						</Row>
					</Input>
					</form>
				</ListGroupItem>
			);
		}
	}
});

var TodoList = React.createClass({
	getInitialState: function() {
		return {
			newTodo: null,
			filters: [new UncompletedFilter()],
			sort: new DueDateSort()
		};
	},
	handleMenuSelect: function(selectedKey) {
		switch (selectedKey) {
			case 1.1: //Filter Completed
				var filters = this.state.filters;
				filters.push(new CompletedFilter());
				this.setState({filters: filters});
				break;
			case 1.2: //Filter Uncompleted
				var filters = this.state.filters;
				filters.push(new UncompletedFilter());
				this.setState({filters: filters});
				break;
			case 2.1: //Sort Due Date (ascending)
				this.setState({sort: new DueDateSort()});
				break;
			case 2.2: //Sort Due Date (descending)
				this.setState({sort: new DueDateSort(true)});
				break;
			case 2.3: //Sort Uncompleted
				this.setState({sort: new CompletedSort()});
				break;
			case 2.4: //Sort Completed
				this.setState({sort: new CompletedSort(true)});
				break;
			case 3: //Create New Task
				this.handleNewTodoSubmit();
				break;
			default:
				//Filter by tag
				if (typeof selectedKey == "string") {
					var filters = this.state.filters;
					filters.push(new TagFilter(selectedKey));
					this.setState({filters: filters});
				} else {
					console.log("unhandled menu selection: ", selectedKey);
				}
		}
	},
	handleNewTodoSubmit: function() {
		var newTodo = new Todo();
		newTodo.DueDate = new Date();
		newTodo.Reminder = new Date();
		this.setState({newTodo: newTodo});
	},
	handleSaveNewTodo: function(todo) {
		this.setState({newTodo: null});
		this.props.onCreateTodo(todo);
	},
	handleAbandonNewTodo: function(todo) {
		this.setState({newTodo: null});
	},
	filterActive: function(filter) {
		for (var i = 0; i < this.state.filters.length; i++) {
			if (filter.name() == this.state.filters[i].name())
				return true;
		}
		return false;
	},
	handleRemoveFilter: function(filter) {
		var filters = this.state.filters;
		filters.splice(filters.indexOf(filter), 1);
		this.setState({filters: filters});
	},
	handleRemoveAllFilters: function() {
		this.setState({filters: []});
	},
	render: function() {
		var todos = this.props.todos;
		for (var i = 0; i < this.state.filters.length; i++) {
			todos = todos.filter(this.state.filters[i].filter, this.state.filters[i]);
		}
		todos = todos.sort(this.state.sort.sort.bind(this.state.sort));

		var props = this.props; //'this' gets eaten inside the map
		var todoNodes = todos.map(function(todo) {
			return (
				<TodoItem
						key={todo.TodoId}
						todo={todo}
						tags={props.tags}
						onUpdateTodo={props.onUpdateTodo}
						onDeleteTodo={props.onDeleteTodo} />
			);
		});

		// If we're creating a new todo, add it to the top of the list and
		// select it
		if (this.state.newTodo != null) {
			todoNodes.unshift((
				<TodoItem
						key={this.state.newTodo.TodoId}
						todo={this.state.newTodo}
						tags={this.props.tags}
						onUpdateTodo={this.handleSaveNewTodo}
						onDeleteTodo={this.handleAbandonNewTodo}
						onCloseTodo={this.handleAbandonNewTodo}
						selected />
			));
		}

		if (todoNodes.length == 0) {
			todoNodes = (
				<Jumbotron>
					<h2>You're done with <i>everything</i>?</h2>
					<p>Either you're lying or you've applied too many filters.</p>
				</Jumbotron>
			);
		}

		var staticFilterNodes = [];
		if (!this.filterActive(new CompletedFilter()) &&
						!this.filterActive(new UncompletedFilter())) {
			staticFilterNodes = [
				<MenuItem eventKey={1.1}>Completed</MenuItem>,
				<MenuItem eventKey={1.2}>Uncompleted</MenuItem>
			];
		}

		var tagFilterNodes = [];
		for (var i = 0; i < this.props.tags.length; i++) {
			var tag = this.props.tags[i];
			if (!this.filterActive(new TagFilter(tag))) {
				tagFilterNodes.push(<MenuItem eventKey={tag}>&nbsp;-&nbsp;&nbsp;{tag}</MenuItem>);
			}
		}
		if (tagFilterNodes.length > 0) {
			tagFilterNodes.unshift(<MenuItem header >Tags:</MenuItem>);
			if (staticFilterNodes.length > 0)
				tagFilterNodes.unshift(<MenuItem divider />);
		}
		var noActiveFilterNodes = [];
		if ((tagFilterNodes.length + staticFilterNodes.length) == 0) {
			noActiveFilterNodes.push(
				<MenuItem header>(All filters are in use)</MenuItem>
			);
		}

		var cancelFilterNodes = <span />;
		if (this.state.filters.length > 0) {
			var handleRemoveFilter = this.handleRemoveFilter;
			var handleRemoveAllFilters = this.handleRemoveFilter;
			var cancelFilterButtonNodes = this.state.filters.map(function(filter) {
				return (
					<Button onClick={function(){handleRemoveFilter(filter);}}>
						{filter.name()} <Glyphicon glyph="remove" />
					</Button>
				);
			});
			if (this.state.filters.length > 1)
				cancelFilterButtonNodes.unshift(
					<Button onClick={this.handleRemoveAllFilters}>
						Remove All Filters <Glyphicon glyph="trash" />
					</Button>);
				cancelFilterButtonNodes.unshift(
					<span className="active-filters-label">Active Filters:</span>);
			cancelFilterNodes = <ButtonToolbar className="cancel-filters">{cancelFilterButtonNodes}</ButtonToolbar>
		}

		return (
			<div>
				<Nav bsStyle="pills" onSelect={this.handleMenuSelect}>
					<DropdownButton eventKey={1} title="Filter" navItem={true}>
						{staticFilterNodes}
						{tagFilterNodes}
						{noActiveFilterNodes}
					</DropdownButton>
					<DropdownButton eventKey={2} title="Sort" navItem={true}>
						<MenuItem eventKey={2.1}>Due Date (ascending)</MenuItem>
						<MenuItem eventKey={2.2}>Due Date (descending)</MenuItem>
						<MenuItem eventKey={2.3}>Uncompleted First</MenuItem>
						<MenuItem eventKey={2.4}>Completed First</MenuItem>
					</DropdownButton>
					<NavItem eventKey={3}>New Task</NavItem>
				</Nav>
				{cancelFilterNodes}
				<ListGroup>
					{todoNodes}
				</ListGroup>
			</div>
		);
	}
});
