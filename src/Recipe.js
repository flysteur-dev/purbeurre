import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Query, Mutation } from 'react-apollo';

//Components
import Search from './components/Search';

//Styles
import './App.scss';

//Queries
import { GET_INGREDIENTS } from './clients/Ingredient';
import { ADD_RECIPE, DELETE_RECIPE } from './clients/Recipe';

class Recipe extends Component {

	constructor(props) {
		super(props);

		if (this.props.recipe) {
			this.state = { ...this.props.recipe };
		} else {
			this.state = {
				id: null,
				title: '',
				book: '',
				page: '',
				people: '',
				cookingtime: '',
				worktime: '',
				description: '',
				ingredients: []
			}
		}
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value  = target.value;
		const name   = target.name;

		this.setState({
			[name]: value
		});
	}

	handleInputQuantityChange = (event) => {
		let toUpdate = event.target.attributes['data-pos'].value;
		let value    = event.target.value;
		this.setState(prevState => {
			prevState.ingredients[toUpdate].qtx = value;
			return prevState;
		});
	}

	handleInputDeletion = (row) => {
		this.setState(prevState => {
			prevState.ingredients.splice(row, 1);
			return prevState;
		});
	}

	addIngredient = (ingredient) => {
		this.setState(prevState => ({
			ingredients: [...prevState.ingredients, {
				__typename: 'RecipeIngredient',
				idIngredient: ingredient.id,
				name: ingredient.name,
				qtx: ''
			}]
		}));
	}

	redirectToHome = () => {
		this.props.history.push(`/`);
	}

	render() {
		let params = { };

		//Readonly mode
		if (this.state.id) {
			params = { readOnly: 'readOnly' };
		}

		let n = 0;
		let ingredientsList = this.state.ingredients.map((ingredient) => {
			let row = n; n++;
			return (
				<div className="row" key={row}>
					<input
						disabled
						type="text"
						value={ingredient.name} />
					<input
						{...params}
						autoFocus
						data-pos={row}
						type="text"
						placeholder="Quantity"
						onChange={this.handleInputQuantityChange}
						value={ingredient.qtx} />

					{!this.state.id ? (<label onClick={() => this.handleInputDeletion(row)}>&times;</label>) : null }
					<br />
				</div>
			)
		});

		return (
			<div className="App Recipe">
				<Link to="/"><div className="close">&times;</div></Link>

				<form>
					<label>Title
					<input
						{...params}
						name="title"
						type="text"
						value={this.state.title}
						placeholder="Recipe title"
						autoFocus={true}
						onChange={this.handleInputChange} />
					</label>

					<label>Book
					<div className="flex">
						<input
							{...params}
							name="book"
							type="text"
							value={this.state.book}
							placeholder="Book reference"
							onChange={this.handleInputChange} />
						<input
							{...params}
							name="page"
							type="number"
							value={this.state.page}
							placeholder="Page"
							style={{width:'40px'}}
							onChange={this.handleInputChange} />
					</div>
					</label>

					<label>Peoples
					<input
						{...params}
						name="people"
						type="number"
						value={this.state.people}
						placeholder="1..15"
						onChange={this.handleInputChange} />
					</label>

					<label>Duration
					<div className="flex">
						<input
							{...params}
							name="worktime"
							type="number"
							value={this.state.worktime}
							placeholder="Working (mn)"
							onChange={this.handleInputChange} />
						<input
							{...params}
							name="cookingtime"
							type="number"
							value={this.state.cookingtime}
							placeholder="Cooking (mn)"
							onChange={this.handleInputChange} />
					</div>
					</label>

					<label>Description
					<input
						{...params}
						name="description"
						type="text"
						value={this.state.description}
						placeholder="(Optional)"
						onChange={this.handleInputChange} />
					</label>


					{ !this.state.id  ? (
						<div>
							<label>Ingredients list</label>
							<Query query={GET_INGREDIENTS}>
								{({ data }) => {
									return (
										<div>
											<Search
												filterByIngredient={this.addIngredient}
												ingredients={data.ingredients}
												allowNew={true} />
											{ingredientsList}
										</div>
									)
								}}
							</Query>
						</div>
					) : (
						<div>
							<hr />
							{ ingredientsList }
						</div>
					) }
				</form>

				{ this.state.id ? (
					<Mutation
						mutation={DELETE_RECIPE}
						variables={{ id: this.state.id }}
						onCompleted={() => this.redirectToHome() }>
							{deleteRecipe => (
								<div className="Button delete" onClick={deleteRecipe}>DELETE</div>
							)}
					</Mutation>
				) : (
					<Mutation
						mutation={ADD_RECIPE}
						variables={this.state}
						onCompleted={() => this.redirectToHome() }>
							{addRecipe => (
								<div className="Button" onClick={addRecipe}>&#10004;</div>
							)}
					</Mutation>
				)}
			</div>
		);
	}
}

export default Recipe;