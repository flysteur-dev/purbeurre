import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import _ from 'lodash';

import '../App.scss';

//Queries
import { ADD_INGREDIENT } from '../clients/Ingredient';

class Search extends Component {

	constructor(props) {
		super(props);
		this.state = {
			allowNew:  this.props.allowNew  ? true : false,
			autoFocus: this.props.autoFocus ? true : false,
			value:     '',
			suggests:  []
		};

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidUpdate() {
		if (this.state.allowNew) {
			//Scroll to the end of the suggests list
			window.scrollTo(0, this.suggestsEnd.scrollHeight);
		}
	}

	handleValidate = (event) => {
		//Handle validate action and add the first suggest
		if (event.key == 'Enter') {
			let current = _.head(this.state.suggests);
			if (current && !current.isNew) {
				this.addToFilter(_.head(this.state.suggests));
			}
		}
	}

	handleChange = (event) => {
		//Suggestion based on available app ingredients (5 items maximum)
		let exist    = false;
		let value    = event.target.value;
		let suggests = _.slice(_.filter(this.props.ingredients, (ingredient) => {
			if (ingredient.name == value) exist = true;
			return _.startsWith(ingredient.name, _.toLower(value));
		}), 0, 5);

		//Allow adding new ingredient
		if (this.state.allowNew && !exist && value != "") {
			suggests.unshift({
				id:    0,
				name:  _.toLower(value),
				isNew: true,
			});
		}

		if (value == "") {
			this.clear();
		} else {
			this.setState({
				value,
				suggests
			});
		}
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
			if (!suggest.isNew)
				return (
					<li
						key={`s_${suggest.id}`}
						onClick={() => this.addToFilter(suggest)}>
						{suggest.name}
					</li>
				);

			return (
				<Mutation
					mutation={ADD_INGREDIENT}
					variables={{ name : suggest.name }}
					onCompleted={({addIngredient}) => this.addToFilter(addIngredient)}>
					{addIngredient => (
						<li
							key={`s_${suggest.id}`}
							onClick={addIngredient}>
							(+) {suggest.name}..
						</li>
					)}
				</Mutation>
			)
		});

		return (
			<div className="Search">
				<input
					ref={c => (this._input = c)}
					autoFocus={this.state.autoFocus}
					value={this.state.value}
					onChange={this.handleChange}
					onKeyPress={this.handleValidate}
					placeholder="Search ingredients.."
				/>
				<ul className="Suggests" ref={(div) => {
					this.suggestsEnd = div;
				}}>{suggests}</ul>
			</div>
		);
	}
}

export default Search;
