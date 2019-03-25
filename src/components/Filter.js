import React, { Component } from 'react';

import '../App.scss';

class Filter extends Component {

	remove = (suggest) => {
		this.props.removeFilter(suggest);
	}

	filters = (props) => {
		return props.filters.map((filter) => {
			return <li key={`f_${filter.id}`} onClick={() => this.remove(filter)}>{filter.name}</li>
		})
	}

	render() {
		return (
			<ul className="Filter">
				{this.filters(this.props)}
			</ul>
		);
	}
}

export default Filter;
