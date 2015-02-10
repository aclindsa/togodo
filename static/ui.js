var LoginBar = React.createClass({
	getInitialState: function() {
		return {username: '', password: ''};
	},
	onUsernameChange: function(e) {
		this.setState({username: e.target.value});
	},
	onPasswordChange: function(e) {
		this.setState({password: e.target.value});
	},
	handleSubmit: function(e) {
		var user = new User();
		e.preventDefault();
		user.Username = this.state.username;
		user.Password = this.state.password;
		this.props.onLoginSubmit(user);
		this.refs.username.getDOMNode().value = '';
		this.refs.password.getDOMNode().value = '';
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					User: <input onChange={this.onUsernameChange} ref="username" />
					Password: <input type="password" onChange={this.onPasswordChange} ref="password" />
					<button>Login</button>
				</form>
			</div>
		);
	}
});

var LogoutBar = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		this.props.onLogoutSubmit();
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					Signed in as {this.props.user.Username}
					<button>Logout</button>
				</form>
			</div>
		);
	}
});

var ErrorBar = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		this.props.onErrorClear();
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					Error {this.props.error.ErrorId}: {this.props.error.ErrorString}
					<button>Clear</button>
				</form>
			</div>
		);
	}
});

var ToGoDoApp = React.createClass({
	getInitialState: function() {
		return {items: [],
			session: new Session(),
			user: new User(),
			error: new Error()};
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
	componentDidMount: function() {
		this.getSession();
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
	render: function() {
		var loginoutBar;
		if (this.state.error.isError())
			loginoutBar = <ErrorBar error={this.state.error} onErrorClear={this.handleErrorClear} />;
		else if (!this.state.user.isUser())
			loginoutBar = <LoginBar onLoginSubmit={this.handleLoginSubmit} />;
		else
			loginoutBar = <LogoutBar user={this.state.user} onLogoutSubmit={this.handleLogoutSubmit} />;

		return (
			<div>
				{loginoutBar}
				<h3>ToGoDo</h3>
			</div>
		);
	}
});

React.render(<ToGoDoApp />, document.getElementById("content"));
