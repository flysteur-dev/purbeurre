import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import gql from 'graphql-tag';

//Style
import './index.scss';

//Page
import Home from './Home';
import Recipe from './Recipe';

import * as serviceWorker from './serviceWorker';

//Query
const GET_BASE_COOKBOOK = gql`
  query {
	cookbook @client {
		id,
		title,
		desc,
		ingredients {
			idIngredient,
			name,
			qtx,
		}
	}
  }
`;

const GET_RECIPE = gql`
	query {
		getRecipe(id: $id) @client {
			id,
			title,
			desc,
			ingredients {
				idIngredient,
				name,
				qtx,
			}
		}
	}
`;

const cache  = new InMemoryCache();
persistCache({ cache, storage: window.localStorage }).then(() => {
	//Initialize state
	if (!window.localStorage.getItem('apollo-cache-persist')) {
		console.warn("Cache is empty, applying initial state.");
		//Sample
		cache.writeData({
			data: {
				//List of all available ingredients
				ingredientsBase: [
					{ __typename: 'Ingredient', id: 1, name: "avocat" },
					{ __typename: 'Ingredient', id: 2, name: "abricot" },
					{ __typename: 'Ingredient', id: 3, name: "lait" },
					{ __typename: 'Ingredient', id: 4, name: "tomate" },
					{ __typename: 'Ingredient', id: 5, name: "chocolat" },
					{ __typename: 'Ingredient', id: 6, name: "mandarine" },
					{ __typename: 'Ingredient', id: 7, name: "crevette" },
				],
				//List of all available recipes
				cookbook: [ ]
			}
		});
	}

	const client = new ApolloClient({
		cache,
		resolvers: {
			Query: {
				getRecipe: (_, { id }, { cache }) => {
					const { cookbook } = cache.readQuery({ query: GET_BASE_COOKBOOK });
					return cookbook.filter(recipe => recipe.id == id)[0];
				}
			},
			Mutation: {
				addRecipe(__, { title, desc, ingredients }, { cache }) {
					const previous  = cache.readQuery({ query: GET_BASE_COOKBOOK });
					const newRecipe = {
						__typename: 'Recipe',
						id: (previous.cookbook.length) ? _.maxBy(previous.cookbook, 'id').id + 1 : 1,
						title,
						desc,
						ingredients
					};
					const data = {
						cookbook: [...previous.cookbook, newRecipe],
					};
					cache.writeData({data});
					return newRecipe;
				},
				deleteRecipe(_, { id }, { cache }) {
					const previous = cache.readQuery({ query: GET_BASE_COOKBOOK });
					const data = {
						cookbook: previous.cookbook.filter(i => i.id != id)
					}
					cache.writeData({data});
					return true;
				}
			}
		}
	});

	ReactDOM.render(
		<ApolloProvider client={client}>
			<Query query={GET_BASE_COOKBOOK}>
				{({ loading, error, data }) => {
					if (loading) return <span>loading...</span>
					if (error)   return <span>Oops..</span>

					return (
						<Router>
							<div>
								<Route exact path="/" render={(props) => <Home {...props} cookbook={data.cookbook} />} />
								<Route exact path="/add" component={Recipe} />
								<Route exact path="/recipe/:id" render={(r) =>
									<Query query={GET_RECIPE} variables={{ id: r.match.params.id }}>
										{({ loading, error, data: { getRecipe } }) => {
											if (loading) return <span>loading...</span>
											if (error)   return <span>Oops..</span>

											return (<Recipe recipe={getRecipe} history={r.history} />);
										}}
									</Query>
								 } />
							</div>
						</Router>
					)
				}}
			</Query>
		</ApolloProvider>,
		document.getElementById('root')
	);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
