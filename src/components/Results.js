import React, { Component } from 'react';
import { Link } from "react-router-dom";

import '../App.scss';

class Results extends Component {

	listItems = (props) => {
		return props.items.map((item) => {
			return (
				<Link key={`r_${item.id}`} to={`/recipe/${item.id}`}>
					<li>
						<div className="title">{item.title}</div>
						<div className="book">{item.book}</div>
						<div className="desc">{item.description}</div>
						<div className="items">{props.filters.length} / {item.ingredients.length} required</div>
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
