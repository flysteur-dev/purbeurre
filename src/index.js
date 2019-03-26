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
		ingredients
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
					{ __typename: 'ingredient', id: 1, name: "avocat" },
					{ __typename: 'ingredient', id: 2, name: "abricot" },
					{ __typename: 'ingredient', id: 3, name: "lait" },
					{ __typename: 'ingredient', id: 4, name: "tomate" },
					{ __typename: 'ingredient', id: 5, name: "chocolat" },
					{ __typename: 'ingredient', id: 6, name: "mandarine" },
					{ __typename: 'ingredient', id: 7, name: "crevette" },
				],
				//List of all available recipes
				cookbook: [
					{ __typename: 'recipe', id: 1, title: "recette 1", desc: "(avocat, lait)", ingredients: [1, 3] },
					{ __typename: 'recipe', id: 2, title: "recette 2", desc: "(tomate)", ingredients: [4]    },
					{ __typename: 'recipe', id: 3, title: "recette 3", desc: "(avocat, tomate)", ingredients: [1, 4] },
					{ __typename: 'recipe', id: 4, title: "recette 4", desc: "(crevette, avocat)", ingredients: [7, 1] },
				]
			}
		});
	}

	const client = new ApolloClient({
		cache,
		resolvers: {
			Query: {
				getRecipeById(_, { id }, { cache }) {
					return cache.data.get(`recipe:${id}`);
				}
			},
			Mutation: {
				addRecipe(__, { title, desc }, { cache }) {
					const previous  = cache.readQuery({ query: GET_BASE_COOKBOOK });
					const newRecipe = { __typename: 'recipe', id: _.maxBy(previous.cookbook, 'id').id + 1, title, desc, ingredients: [4] };
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
				{({ data, loading, error }) => {
					if (loading) return <span>loading...</span>
					if (error)   return <span>Oops..</span>

					return (
						<Router>
							<div>
								<Route exact path="/" render={(props) => <Home {...props} cookbook={data.cookbook} />} />
								<Route exact path="/add" component={Recipe} />
								<Route exact path="/recipe/:id" component={Recipe} />
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
