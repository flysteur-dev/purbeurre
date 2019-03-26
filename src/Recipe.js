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

const GET_RECIPE = gql`
  query {
	getRecipe(id: $id) @client {
		id,
		title,
		desc,
		ingredients
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
		this.state = {
			id:    this.props.match.params.id || null,
			title: '',
			desc:  '',
			ingredients: [],
		};
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value  = target.value;
		const name   = target.name;

		this.setState({
			[name]: value
		});
	}

	addIngredient = (ingredient) => {
		this.setState(prevState => ({
			ingredients: [...prevState.ingredients, ingredient]
		}));
	}

	redirectToHome = () => {
		this.props.history.push(`/`);
	}

	render() {
		let ingredients = this.state.ingredients.map((ingredient) => {
			return (
				<div className="row" key={ingredient.id}>
					<input
						disabled
						name="ingredients[]"
						type="text"
						value={ingredient.name} />
					<input
						type="text" />
					<label>[x]</label>
					<br />
				</div>
			)
		});


		return (
			<div className="App Recipe">
				<Link to="/"><div>[close]</div></Link>

				<Query query={GET_RECIPE} variables={{ id: this.state.id }}>
					{({ data: { getRecipe }, loading, error }) => {
						if (loading) return <span>loading...</span>
						if (error)   return <span>Oops..</span>

						return (
							<form>
								<label>
									Title
								<input
									name="title"
									type="text"
									value={getRecipe ? getRecipe.title : this.state.title}
									onChange={this.handleInputChange} />
								</label><br />

								<label>
									Description
								<input
									name="desc"
									type="text"
									value={getRecipe ? getRecipe.desc : this.state.desc}
									onChange={this.handleInputChange} />
								</label><br />

								<label>
									Ingredients
								</label>
								<Query query={GET_BASE_INGREDIENTS}>
									{({ data, loading, error }) => {
										return (
											<Search filterByIngredient={this.addIngredient} ingredients={data.ingredientsBase} />
										)
									}}
								</Query>

								{ingredients}
							</form>
						)
					}}
				</Query>

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