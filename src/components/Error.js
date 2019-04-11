import React, { Component } from 'react';

import '../App.scss';

class Error extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hasError: true,
			error: props.error
		};
	}

	dismiss = (e) => {
		e.stopPropagation();
		this.setState({hasError: false});
	}

	render() {
		if (!this.state.hasError) return null;

		return (
			<div className="Error">
				<h1>!</h1>
				<p>{this.state.error}</p>
				<button onClick={this.dismiss}>OK</button>
			</div>
		);
	}
}

export default Error;
