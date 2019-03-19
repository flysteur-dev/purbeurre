import React, { Component } from 'react';

import '../App.scss';

class Results extends Component {

	listItems = (props) => {
		return props.items.map((item) => {
			return (
				<li key={item.title}>
					<div className="t">{item.title}</div>
					<div className="i">({item.ingredients.join(', ')})</div>
				</li>
			)
		})
	};

	render() {
		return (
			<ul className="Results">
				{this.listItems(this.props)}
			</ul>
		);
	}
}

export default Results;
