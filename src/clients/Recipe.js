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
		book,
		page,
		people,
		cookingtime,
		worktime,
		description,
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
			book,
			page,
			people,
			cookingtime,
			worktime,
			description,
			ingredients {
				idIngredient,
				name,
				qtx,
			}
		}
	}
`;

export const ADD_RECIPE = gql`
	mutation addRecipe($title: String!, $book: String!, $page: Int!, $people: Int!, $cookingtime: Int!, $worktime: Int!, $description: String!, $ingredients: [RecipeIngredient]) {
		addRecipe(title: $title, book: $book, page: $page, people: $people, cookingtime: $cookingtime, worktime: $worktime, description: $description, ingredients: $ingredients) @client
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
		addRecipe(__, { title, book, page, people, cookingtime, worktime, description, ingredients }, { cache }) {
			//Required
			if (_.isEmpty(title)) { throw "Title field is required." }
			if (_.isEmpty(ingredients)) { throw "Recipe must have at least one ingredient." }

			//Must be a numeric value
			if (!_.isEmpty(people) && !_.isNumber(people)) { throw "People must be a numeric value." }
			if (!_.isEmpty(page) && !_.isNumber(page)) { throw "Page must be a numeric value."}
			if (!_.isEmpty(cookingtime) && !_.isNumber(cookingtime)) { throw "Cooking duration must be a numeric value in minutes." }
			if (!_.isEmpty(worktime) && !_.isNumber(worktime)) { throw "Cooking preparation must be a numeric value in minutes." }

			const previous = cache.readQuery({ query: GET_RECIPES });
			const newRecipe = {
				__typename: RECIPE_TYPE,
				id: (previous.cookbook.length) ? _.maxBy(previous.cookbook, 'id').id + 1 : 1,
				title,
				book,
				page,
				people,
				cookingtime,
				worktime,
				description,
				ingredients,
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

