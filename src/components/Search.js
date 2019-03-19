import React, { Component } from 'react';
import _ from 'lodash';

import '../App.scss';

class Search extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value:   '',
			suggests: []
		};

		this.handleChange = this.handleChange.bind(this);
	}

	//Force autofocus after component update
	componentDidUpdate() {
		this._input.focus();
	}

	handleChange = (event) => {
		this.setState({
			value: event.target.value,

			//Suggestion based on available app ingredients
			suggests: _.filter(this.props.ingredients, (ingredient) => {
				return _.startsWith(ingredient, event.target.value)
			})
		});
	}

	clear = () => {
		this.setState({
			value: '',
			suggests: []
		})
	}

	addToFilter = (suggest) => {
		this.props.filterByIngredient(suggest);
		this.clear();
	}

	render() {
		const suggests = this.state.suggests.map((suggest) => {
			return <li key={suggest} onClick={() => this.addToFilter(suggest)}>{suggest}</li>
		});

		return (
			<div className="Search">
				<input
					ref={c => (this._input = c)}
					autoFocus={true}
					value={this.state.value}
					onChange={this.handleChange}
				/>
				<ul className="Suggests">{suggests}</ul>
			</div>
		);
	}
}

export default Search;
