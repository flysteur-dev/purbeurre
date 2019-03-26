import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

//Styles
import './App.scss';

//Query
const GET_RECIPE = gql`
  query {
	getRecipeById(id: $id) @client {
		id,
		title,
		desc,
		ingredients
	}
  }
`;

const ADD_RECIPE = gql`
	mutation addRecipe($title: String! $desc: String!) {
		addRecipe(title: $title, desc: $desc) @client
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
			desc:  ''
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

	render() {
		return (
			<div>
				<Link to="/"><div>[close]</div></Link>

				<Query query={GET_RECIPE} variables={{ id: this.state.id }}>
					{({ data: { getRecipeById }, loading, error }) => {
						if (loading) return <span>loading...</span>
						if (error)   return <span>Oops..</span>

						return (
							<form>
								<label>
									Title
								<input
									name="title"
									type="text"
									value={getRecipeById ? getRecipeById.title : this.state.title}
									onChange={this.handleInputChange} />
								</label><br />

								<label>
									Description
								<input
									name="desc"
									type="text"
									value={getRecipeById ? getRecipeById.desc : this.state.desc}
									onChange={this.handleInputChange} />
								</label><br />
							</form>
						)
					}}
				</Query>

				{ this.state.id ? (
					<Mutation
						mutation={DELETE_RECIPE}
						variables={{ id: this.state.id }}>
							{deleteRecipe => (
								<button onClick={deleteRecipe}>Delete</button>
							)}
					</Mutation>
				) : (
					<Mutation
						mutation={ADD_RECIPE}
						variables={this.state}>
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