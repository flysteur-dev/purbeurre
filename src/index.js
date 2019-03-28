import React from 'react';
import ReactDOM from 'react-dom';
import { merge } from 'lodash';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

import * as serviceWorker from './serviceWorker';

//Style
import './index.scss';

//Page
import Home from './Home';
import Recipe from './Recipe';

//Queries
import { GET_RECIPES, GET_RECIPE } from './clients/Recipe';

//Resolvers
import { resolvers as ingredientResolvers } from './clients/Ingredient';
import { resolvers as recipeResolvers } from './clients/Recipe';

const cache  = new InMemoryCache();
persistCache({ cache, storage: window.localStorage }).then(() => {
	//Initialize state
	if (!window.localStorage.getItem('apollo-cache-persist')) {
		console.warn("Cache is empty, applying initial state.");
		cache.writeData({
			data: {
				//List of all available ingredients
				ingredients: [ ],
				//List of all available recipes
				cookbook: [ ]
			}
		});
	}

	const client = new ApolloClient({
		cache,
		resolvers: merge(
			ingredientResolvers,
			recipeResolvers,
		)
	});

	ReactDOM.render(
		<ApolloProvider client={client}>
			<Query query={GET_RECIPES}>
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

serviceWorker.register();
