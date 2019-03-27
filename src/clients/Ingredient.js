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

//Resolvers
export const resolvers = {};