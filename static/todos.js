// Import all the objects we want to use from ReactBootstrap
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Input = ReactBootstrap.Input;

var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

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
						<Col xs={4}>{this.state.dueDate.toString()}</Col>
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

		return (
			<div>
				<Button bsStyle="primary" onClick={this.handleNewTodoSubmit}>New Todo</Button>
				<ListGroup>
					{todoNodes}
				</ListGroup>
			</div>
		);
	}
});
