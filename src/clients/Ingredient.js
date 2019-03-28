import _ from 'lodash';
import gql from 'graphql-tag';

//Define
export const INGREDIENT_TYPE = 'Ingredient';

//Queries
export const GET_INGREDIENTS = gql`
	query {
		ingredients @client {
			id,
			name
		}
	}
`;

export const ADD_INGREDIENT = gql`
	mutation addIngredient($name: String!) {
		addIngredient(name: $name) @client
	}
`;

//Resolvers
export const resolvers = {
	Mutation: {

		//Add Ingredient
		//Input: name
		//Output: Created Ingredient
		addIngredient(__, { name }, { cache }) {
			const previous = cache.readQuery({ query: GET_INGREDIENTS });
			const newIngredient = {
				__typename: INGREDIENT_TYPE,
				id: (previous.ingredients.length) ? _.maxBy(previous.ingredients, 'id').id + 1 : 1,
				name
			};
			const data = {
				ingredients: [...previous.ingredients, newIngredient],
			};
			cache.writeData({ data });
			return newIngredient;
		},
	}
};