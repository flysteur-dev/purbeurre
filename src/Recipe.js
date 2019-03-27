import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

//Components
import Search from './components/Search';

//Styles
import './App.scss';

//Query
const GET_BASE_INGREDIENTS = gql`
	query {
		ingredientsBase @client {
			id,
			name
		}
	}
`;

const ADD_RECIPE = gql`
	mutation addRecipe($title: String!, $desc: String!, $ingredients: [Int]) {
		addRecipe(title: $title, desc: $desc, ingredients: $ingredients) @client
	}
`;
const DELETE_RECIPE = gql`
	mutation deleteRecipe($id: ID!) {
		deleteRecipe(id: $id) @client
	}
`;

class Recipe extends Component {

	constructor(props) {
		super(props);

		if (this.props.recipe) {
			this.state = { ...this.props.recipe };
		} else {
			this.state = {
				id:    null,
				title: '',
				desc:  '',
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
		let n = 0;
		let ingredients = this.state.ingredients.map((ingredient) => {
			let row  = n; n++;
			return (
				<div className="row" key={row}>
					<input
						disabled
						type="text"
						value={ingredient.name} />
					<input
						data-pos={row}
						type="text"
						onChange={this.handleInputQuantityChange}
						value={ingredient.qtx} />

					{!this.state.id ? (<label onClick={() => this.handleInputDeletion(row)}>[x]</label>) : null }
					<br />
				</div>
			)
		});


		return (
			<div className="App Recipe">
				<Link to="/"><div>[close]</div></Link>

				<form>
					<label>Title
					<input
						name="title"
						type="text"
						value={this.state.title}
						onChange={this.handleInputChange} />
					</label><br />

					<label>Description
					<input
						name="desc"
						type="text"
						value={this.state.desc}
						onChange={this.handleInputChange} />
					</label><br />

					<label>Ingredients</label>
					<Query query={GET_BASE_INGREDIENTS}>
						{({ data, loading, error }) => {
							return (
								<div>
									<Search filterByIngredient={this.addIngredient} ingredients={data.ingredientsBase} />
									{ingredients}
								</div>
							)
						}}
					</Query>
				</form>

				{ this.state.id ? (
					<Mutation
						mutation={DELETE_RECIPE}
						variables={{ id: this.state.id }}
						onCompleted={() => this.redirectToHome() }>
							{deleteRecipe => (
								<button onClick={deleteRecipe}>Delete</button>
							)}
					</Mutation>
				) : (
					<Mutation
						mutation={ADD_RECIPE}
						variables={this.state}
						onCompleted={() => this.redirectToHome() }>
							{addRecipe => (
								<button onClick={addRecipe}>Add</button>
							)}
					</Mutation>
				)}
			</div>
		);
	}
}

export default Recipe;