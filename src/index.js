import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

//Style
import './index.scss';

//Page
import Home from './Home';
import Recipe from './Recipe';

import * as serviceWorker from './serviceWorker';

const cache  = new InMemoryCache();
const client = new ApolloClient({
	cache,
	resolvers: {
		Query: {
			getIngredientsById(_, { id }, { cache }) {
				return cache.data.get(`ingredientsBase:${id}`);
			}
		}
	}
});

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
							<Route exact path="/recipe" component={Recipe} />
							<Route exact path="/recipe/:id" component={Recipe} />
						</div>
					</Router>
				)
			}}
		</Query>
	</ApolloProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
