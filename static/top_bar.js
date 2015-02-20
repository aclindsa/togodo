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
	handleNewUserSubmit: function(e) {
		e.preventDefault();
		this.props.onCreateNewUser();
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					User: <input onChange={this.onUsernameChange} ref="username" />
					Password: <input type="password" onChange={this.onPasswordChange} ref="password" />
					<button>Login</button>
				</form>
				<form onSubmit={this.handleNewUserSubmit}>
					<button>New User</button>
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

var TopBar = React.createClass({
	render: function() {
		var barContents;
		if (this.props.error.isError())
			barContents = <ErrorBar error={this.props.error} onErrorClear={this.props.onErrorClear} />;
		else if (!this.props.user.isUser())
			barContents = <LoginBar onLoginSubmit={this.props.onLoginSubmit} onCreateNewUser={this.props.onCreateNewUser} />;
		else
			barContents = <LogoutBar user={this.props.user} onLogoutSubmit={this.props.onLogoutSubmit} />;

		return (
			<div>
				{barContents}
			</div>
		);
	}
});
