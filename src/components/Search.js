import React, { Component } from 'react';
import _ from 'lodash';

import '../App.scss';

class Search extends Component {

	constructor(props) {
		super(props);
		this.state = {
			autoFocus: this.props.autoFocus ? true : false,
			value:   '',
			suggests: []
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			value: event.target.value,

			//Suggestion based on available app ingredients (5 items maximum)
			suggests: _.slice(_.filter(this.props.ingredients, (ingredient) => {
				return _.startsWith(ingredient.name, _.toLower(event.target.value));
			}), 0, 5)
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
			return (
				<li
					key={`s_${suggest.id}`}
					onClick={() => this.addToFilter(suggest)}>{suggest.name}
				</li>
			);
		});

		return (
			<div className="Search">
				<input
					ref={c => (this._input = c)}
					autoFocus={this.state.autoFocus}
					value={this.state.value}
					onChange={this.handleChange}
					placeholder="Search ingredients.."
				/>
				<ul className="Suggests">{suggests}</ul>
			</div>
		);
	}
}

export default Search;
