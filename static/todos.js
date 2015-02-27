// Import all the objects we want to use from ReactBootstrap
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Input = ReactBootstrap.Input;

var Button = ReactBootstrap.Button;
var DropdownButton = ReactBootstrap.DropdownButton;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

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
		this.props.onUpdateTodo(todo);
	},
	handleClose: function() {
		this.setState({
			hasDueDate: this.props.todo.HasDueDate,
			dueDate: this.props.todo.DueDate,
			hasReminder: this.props.todo.HasReminder,
			reminder: this.props.todo.Reminder,
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
			dateString = niceDateString(this.state.dueDate);

		if (!this.state.selected)
			return (
				<ListGroupItem onClick={this.onClick} >
					<Input wrapperClassName="wrapper">
						<Row>
						<Col xs={1}><Input type="checkbox"
							checked={checkedString}
							onClick={this.onCheckboxClicked}/></Col>
						<Col xs={7}>{this.props.todo.Description}</Col>
						<Col xs={4}>{dateString}</Col>
						</Row>
					</Input>
				</ListGroupItem>
			);
		else
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
});

var TodoList = React.createClass({
	getInitialState: function() {
		return {newTodo: null};
	},
	handleMenuSelect: function(selectedKey) {
		if (selectedKey == 3) //New Task
			this.handleNewTodoSubmit();
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
	render: function() {
		var props = this.props; //'this' gets eaten inside the map
		var todoNodes = this.props.todos.map(function(todo) {
			return (
				<TodoItem key={todo.TodoId} todo={todo} onUpdateTodo={props.onUpdateTodo} onDeleteTodo={props.onDeleteTodo} />
			);
		});

		// If we're creating a new todo, add it to the top of the list and
		// select it
		if (this.state.newTodo != null) {
			todoNodes.unshift((
				<TodoItem key={this.state.newTodo.TodoId} todo={this.state.newTodo} onUpdateTodo={this.handleSaveNewTodo} onDeleteTodo={this.handleAbandonNewTodo} onCloseTodo={this.handleAbandonNewTodo} selected />
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

		return (
			<div>
				<Nav bsStyle="pills" onSelect={this.handleMenuSelect}>
					<DropdownButton eventKey={1} title="Filter" navItem={true}>
						<MenuItem eventKey={1.1}>Due Date</MenuItem>
						<MenuItem eventKey={1.2}>Completed</MenuItem>
						<MenuItem eventKey={1.3}>Tags</MenuItem>
					</DropdownButton>
					<DropdownButton eventKey={2} title="Sort" navItem={true}>
						<MenuItem eventKey={2.1}>Due Date</MenuItem>
						<MenuItem eventKey={2.2}>Completed</MenuItem>
					</DropdownButton>
					<NavItem eventKey={3}>New Task</NavItem>
				</Nav>
				<ListGroup>
					{todoNodes}
				</ListGroup>
			</div>
		);
	}
});
