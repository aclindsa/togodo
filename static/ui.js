// Import all the objects we want to use from ReactBootstrap
var Jumbotron = ReactBootstrap.Jumbotron;
var Panel = ReactBootstrap.Panel;

var NewUserForm = React.createClass({
	getInitialState: function() {
		return {error: "",
			name: "",
			username: "",
			email: "",
			password: "",
			confirm_password: "",
			passwordChanged: false};
	},
	passwordValidationState: function() {
		if (this.state.passwordChanged) {
			if (this.state.password.length >= 10)
				return "success";
			else if (this.state.password.length >= 6)
				return "warning";
			else
				return "error";
		}
	},
	confirmPasswordValidationState: function() {
		if (this.state.confirm_password.length > 0) {
			if (this.state.confirm_password == this.state.password)
				return "success";
			else
				return "error";
		}
	},
	handleCancel: function() {
		if (this.props.onCancel != null)
			this.props.onCancel();
	},
	handleChange: function() {
		if (this.refs.password.getValue().length > 0)
			this.setState({passwordChanged: true});
		this.setState({
			name: this.refs.name.getValue(),
			username: this.refs.username.getValue(),
			email: this.refs.email.getValue(),
			password: this.refs.password.getValue(),
			confirm_password: this.refs.confirm_password.getValue()
		});
	},
	handleSubmit: function(e) {
		var u = new User();
		var error = "";
		e.preventDefault();

		u.Name = this.state.name;
		u.Username = this.state.username;
		u.Email = this.state.email;
		u.Password = this.state.password;
		if (u.Password != this.state.confirm_password) {
			this.setState({error: "Error: password do not match"});
			return;
		}

		this.handleCreateNewUser(u);
	},
	handleCreateNewUser: function(user) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "user/",
			data: {user: user.toJSON()},
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					this.props.onNewUser();
				}
			}.bind(this),
			error: function(jqXHR, status, error) {
				var e = new Error();
				e.ErrorId = 5;
				e.ErrorString = "Request Failed: " + status + error;
				this.setState({error: e});
			}.bind(this),
		});
	},
	render: function() {
		var title = <h3>Create New User</h3>;
		return (
			<Panel header={title} bsStyle="info">
				<span color="red">{this.state.error}</span>
				<form onSubmit={this.handleSubmit}
						className="form-horizontal">
					<Input type="text"
							label="Name"
							value={this.state.name}
							onChange={this.handleChange}
							ref="name"
							labelClassName="col-xs-2"
							wrapperClassName="col-xs-10"/>
					<Input type="text"
							label="Username"
							value={this.state.username}
							onChange={this.handleChange}
							ref="username"
							labelClassName="col-xs-2"
							wrapperClassName="col-xs-10"/>
					<Input type="email"
							label="Email"
							value={this.state.email}
							onChange={this.handleChange}
							ref="email"
							labelClassName="col-xs-2"
							wrapperClassName="col-xs-10"/>
					<Input type="password"
							label="Password"
							value={this.state.password}
							onChange={this.handleChange}
							ref="password"
							labelClassName="col-xs-2"
							wrapperClassName="col-xs-10"
							bsStyle={this.passwordValidationState()}
							hasFeedback/>
					<Input type="password"
							label="Confirm Password"
							value={this.state.confirm_password}
							onChange={this.handleChange}
							ref="confirm_password"
							labelClassName="col-xs-2"
							wrapperClassName="col-xs-10"
							bsStyle={this.confirmPasswordValidationState()}
							hasFeedback/>
					<ButtonGroup className="pull-right">
						<Button onClick={this.handleCancel}
								bsStyle="warning">Cancel</Button>
						<Button type="submit"
								bsStyle="success">Create New User</Button>
					</ButtonGroup>
				</form>
			</Panel>
		);
	}
});

var ToGoDoApp = React.createClass({
	getInitialState: function() {
		return {
			hash: "home",
			session: new Session(),
			user: new User(),
			todos: [],
			tags: [],
			error: new Error()
		};
	},
	componentDidMount: function() {
		this.getSession();
		this.handleHashChange();
		if ("onhashchange" in window) {
			window.onhashchange = this.handleHashChange;
		}
	},
	handleHashChange: function() {
		var hash = location.hash.replace(/^#/, '');
		if (hash.length == 0)
			hash = "home";
		if (hash != this.state.hash)
			this.setHash(hash);
	},
	setHash: function(hash) {
		location.hash = hash;
		if (this.state.hash != hash)
		this.setState({hash: hash});
	},
	ajaxError: function(jqXHR, status, error) {
		var e = new Error();
		e.ErrorId = 5;
		e.ErrorString = "Request Failed: " + status + error;
		this.setState({error: e});
	},
	getSession: function() {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "session/",
			success: function(data, status, jqXHR) {
				var e = new Error();
				var s = new Session();
				e.fromJSON(data);
				if (e.isError()) {
					if (e.ErrorId != 1 /* Not Signed In*/)
						this.setState({error: e});
				} else {
					s.fromJSON(data);
				}
				this.setState({session: s});
				this.getUser();
				this.getTodos();
			}.bind(this),
			error: this.ajaxError
		});
	},
	getUser: function() {
		if (!this.state.session.isSession())
			return;
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "user/"+this.state.session.UserId+"/",
			success: function(data, status, jqXHR) {
				var e = new Error();
				var u = new User();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					u.fromJSON(data);
				}
				this.setState({user: u});
			}.bind(this),
			error: this.ajaxError
		});
	},
	getTodos: function() {
		if (!this.state.session.isSession()) {
			this.setState({todos: [], tags: []});
			return;
		}
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "todo/",
			success: function(data, status, jqXHR) {
				var e = new Error();
				var todos = [];
				tags = [];
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					for (var i = 0; i < data.todos.length; i++) {
						var t = new Todo();
						t.fromJSON(data.todos[i]);
						for (var j = 0; j < t.Tags.length; j++) {
							if (tags.indexOf(t.Tags[j]) == -1)
								tags.push(t.Tags[j]);
						}
						todos.push(t);
					}
				}
				this.setState({todos: todos, tags: tags});
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleErrorClear: function() {
		this.setState({error: new Error()});
	},
	handleLoginSubmit: function(user) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "session/",
			data: {user: user.toJSON()},
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					this.getSession();
					this.setHash("home");
				}
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleLogoutSubmit: function() {
		this.setState({todos: []});
		$.ajax({
			type: "DELETE",
			dataType: "json",
			url: "session/",
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				}
				this.setState({session: new Session(), user: new User()});
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleCreateNewUser: function() {
		this.setHash("new_user");
	},
	handleNewUser: function(user) {
		this.setHash("home");
	},
	handleCreateTodo: function(todo) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "todo/",
			data: {todo: todo.toJSON()},
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					this.getTodos();
				}
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleUpdateTodo: function(todo) {
		$.ajax({
			type: "PUT",
			dataType: "json",
			url: "todo/"+todo.TodoId+"/",
			data: {todo: todo.toJSON()},
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					this.getTodos();
				}
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleDeleteTodo: function(todo) {
		$.ajax({
			type: "DELETE",
			dataType: "json",
			url: "todo/"+todo.TodoId+"/",
			success: function(data, status, jqXHR) {
				var e = new Error();
				e.fromJSON(data);
				if (e.isError()) {
					this.setState({error: e});
				} else {
					this.getTodos();
				}
			}.bind(this),
			error: this.ajaxError
		});
	},
	render: function() {
		var mainContent;
		if (this.state.hash == "new_user") {
			mainContent = <NewUserForm onNewUser={this.handleNewUser} onCancel={this.handleNewUser}/>
		} else {
			if (this.state.user.isUser())
				mainContent = <TodoList
						todos={this.state.todos}
						tags={this.state.tags}
						onCreateTodo={this.handleCreateTodo}
						onUpdateTodo={this.handleUpdateTodo}
						onDeleteTodo={this.handleDeleteTodo} />
			else
			mainContent =
				<Jumbotron>
					<h1>To<i>Go</i>Do</h1>
					<p>Get. Stuff. Done.</p>
				</Jumbotron>
		}

		return (
			<div>
				<TopBar
						error={this.state.error}
						onErrorClear={this.handleErrorClear}
						onLoginSubmit={this.handleLoginSubmit}
						onCreateNewUser={this.handleCreateNewUser}
						user={this.state.user}
						onLogoutSubmit={this.handleLogoutSubmit} />
				{mainContent}
			</div>
		);
	}
});

React.render(<ToGoDoApp />, document.getElementById("content"));
