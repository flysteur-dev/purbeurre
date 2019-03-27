import React, { Component } from 'react';
import { Link } from "react-router-dom";

import '../App.scss';

class Results extends Component {

	listItems = (props) => {
		return props.items.map((item) => {
			return (
				<Link key={`r_${item.id}`} to={`/recipe/${item.id}`}>
					<li>
						<div className="t">{item.title}</div>
						<div className="i">{item.desc}</div>
					</li>
				</Link>
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
