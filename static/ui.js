var NewUserForm = React.createClass({
	getInitialState: function() {
		return {error: ""};
	},
	handleSubmit: function(e) {
		var u = new User();
		var error = "";
		e.preventDefault();

		u.Name = this.refs.name.getDOMNode().value;
		u.Username = this.refs.username.getDOMNode().value;
		u.Email = this.refs.email.getDOMNode().value;
		u.Password = this.refs.password.getDOMNode().value;
		if (u.Password != this.refs.confirm_password.getDOMNode().value) {
			this.setState({error: "Error: password do not match"});
			return;
		}

		this.handleCreateNewUser(u);

		this.refs.name.getDOMNode().value = '';
		this.refs.username.getDOMNode().value = '';
		this.refs.email.getDOMNode().value = '';
		this.refs.password.getDOMNode().value = '';
		this.refs.confirm_password.getDOMNode().value = '';
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
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<span color="red">{this.state.error}</span>
					Name: <input ref="name" /> <br />
					Username: <input ref="username" /> <br />
					Email: <input ref="email" /> <br />
					Password: <input type="password" ref="password" /> <br />
					Confirm Password: <input type="password" ref="confirm_password" /> <br />
					<button>Create User</button>
				</form>
			</div>
		);
	}
});

var ToGoDoApp = React.createClass({
	getInitialState: function() {
		return {items: [],
			hash: "home",
			session: new Session(),
			user: new User(),
			error: new Error()};
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
				}
			}.bind(this),
			error: this.ajaxError
		});
	},
	handleLogoutSubmit: function() {
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
	render: function() {
		var mainContent;
		if (this.state.hash == "new_user")
			mainContent = <NewUserForm onNewUser={this.handleNewUser} />

		return (
			<div>
				<TopBar error={this.state.error} onErrorClear={this.handleErrorClear} onLoginSubmit={this.handleLoginSubmit} onCreateNewUser={this.handleCreateNewUser} user={this.state.user} onLogoutSubmit={this.handleLogoutSubmit} />
				<h3>ToGoDo</h3>
				{mainContent}
			</div>
		);
	}
});

React.render(<ToGoDoApp />, document.getElementById("content"));
