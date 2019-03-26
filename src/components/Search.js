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

	handleChange = (event) => {
		this.setState({
			value: event.target.value,

			//Suggestion based on available app ingredients
			suggests: _.slice(_.filter(this.props.ingredients, (ingredient) => {
				return _.startsWith(ingredient.name, event.target.value);
			}), 0, 4)
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

		//Force autofocus after component update
		this._input.focus();
	}

	render() {
		const suggests = this.state.suggests.map((suggest) => {
			return <li key={`s_${suggest.id}`} onClick={() => this.addToFilter(suggest)}>{suggest.name}</li>
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
