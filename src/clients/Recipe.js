import _ from 'lodash';
import gql from 'graphql-tag';

//Define
export const RECIPE_TYPE = 'Recipe';

//Queries
export const GET_RECIPES = gql`
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

export const GET_RECIPE = gql`
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

export const ADD_RECIPE = gql`
	mutation addRecipe($title: String!, $desc: String!, $ingredients: [Int]) {
		addRecipe(title: $title, desc: $desc, ingredients: $ingredients) @client
	}
`;

export const DELETE_RECIPE = gql`
	mutation deleteRecipe($id: ID!) {
		deleteRecipe(id: $id) @client
	}
`;

//Resolvers
export const resolvers = {
	Query: {

		//Get single recipe
		//Input: ID
		//Output: Recipe
		getRecipe: (_, { id }, { cache }) => {
			const { cookbook } = cache.readQuery({ query: GET_RECIPES });
			return cookbook.filter(recipe => recipe.id == id)[0];
		},
	},
	Mutation: {

		//Add recipe
		//Input: title, description, ingredients list
		//Output: Created recipe
		addRecipe(__, { title, desc, ingredients }, { cache }) {
			const previous = cache.readQuery({ query: GET_RECIPES });
			const newRecipe = {
				__typename: RECIPE_TYPE,
				id: (previous.cookbook.length) ? _.maxBy(previous.cookbook, 'id').id + 1 : 1,
				title,
				desc,
				ingredients
			};
			const data = {
				cookbook: [...previous.cookbook, newRecipe],
			};
			cache.writeData({ data });
			return newRecipe;
		},

		//Delete one recipe
		//Input: ID
		deleteRecipe(_, { id }, { cache }) {
			const previous = cache.readQuery({ query: GET_RECIPES });
			const data = {
				cookbook: previous.cookbook.filter(i => i.id != id)
			}
			cache.writeData({ data });
			return true;
		},
	}
};
