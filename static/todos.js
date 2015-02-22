// Import all the objects we want to use from ReactBootstrap
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Input = ReactBootstrap.Input;

var Button = ReactBootstrap.Button;
var DropdownButton = ReactBootstrap.DropdownButton;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var MenuItem = ReactBootstrap.MenuItem;

var Jumbotron = ReactBootstrap.Jumbotron;

// And the same for ReactWidgets
var DateTimePicker = ReactWidgets.DateTimePicker;

var TodoItem = React.createClass({
	getInitialState: function() {
		var selected = false;
		if (typeof this.props.selected !== 'undefined')
			selected = this.props.selected;
		return {
			dueDate: this.props.todo.Due,
			selected: selected
		};
	},
	handleDateChanged: function(due, dueString) {
		this.setState({dueDate: due});
	},
	handleSave: function(e) {
		e.preventDefault();
		this.setState({selected: false});
		var todo = this.props.todo.copy();
		todo.Description = this.refs.description.getValue();
		todo.Notes = this.refs.notes.getValue();
		todo.Due = this.state.dueDate;
		this.props.onUpdateTodo(todo);
	},
	handleClose: function() {
		this.setState({
			dueDate: this.props.todo.Due,
			selected: !false,
		});
		if (this.props.onCloseTodo)
			this.props.onCloseTodo();
	},
	handleDelete: function() {
		this.props.onDeleteTodo(this.props.todo);
	},
	preventOnClick: function(e){
		e.stopPropagation();
	},
	onClick: function(e) {
		this.setState({selected: !this.state.selected});
	},
	onCheckboxClicked: function(e) {
		e.stopPropagation();
		var todo = this.props.todo.copy();
		todo.Completed = !todo.Completed;
		this.props.onUpdateTodo(todo);
	},
	render: function() {
		var checkedString=""
		if (this.props.todo.Completed)
			checkedString = "checked";

		if (!this.state.selected)
			return (
				<ListGroupItem onClick={this.onClick} >
					<Input wrapperClassName="wrapper">
						<Row>
						<Col xs={1}><Input type="checkbox"
							checked={checkedString}
							onClick={this.onCheckboxClicked}/></Col>
						<Col xs={7}>{this.props.todo.Description}</Col>
						<Col xs={4}>{niceDateString(this.state.dueDate)}</Col>
						</Row>
					</Input>
				</ListGroupItem>
			);
		else
			return (
				<ListGroupItem onClick={this.onClick} >
					<form onSubmit={this.handleSaveSubmit}>
					<Input wrapperClassName="wrapper">
						<Row>
							<Col xs={1}><label class="control-label">Task:</label></Col>
							<Col xs={7}><Input type="text"
								onClick={this.preventOnClick}
								defaultValue={this.props.todo.Description}
								ref="description"/></Col>
							<Col xs={1}><label class="control-label">Due:</label></Col>
							<Col xs={3}><DateTimePicker
								onClick={this.preventOnClick}
								defaultValue={this.state.dueDate}
								onChange={this.handleDateChanged}/></Col>
						</Row>
						<Row>
							<Col xs={1}><label class="control-label">Notes:</label></Col>
							<Col xs={7}><Input type="textarea"
								onClick={this.preventOnClick}
								defaultValue={this.props.todo.Notes}
								ref="notes"/></Col>
							<Col xs={4}><ButtonGroup>
								<Button bsStyle="danger"
									onClick={this.handleDelete}>Delete</Button>
								<Button bsStyle="warning"
									onClick={this.handleClose}>Cancel</Button>
								<Button bsStyle="success"
									onClick={this.handleSave}>Save</Button>
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
		if (selectedKey == 3) //New Todo
			this.handleNewTodoSubmit();
	},
	handleNewTodoSubmit: function() {
		var newTodo = new Todo();
		newTodo.Due = new Date();
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
					<NavItem eventKey={3}>New Todo</NavItem>
				</Nav>
				<ListGroup>
					{todoNodes}
				</ListGroup>
			</div>
		);
	}
});
