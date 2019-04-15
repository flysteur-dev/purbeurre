import { InMemoryCache } from 'apollo-cache-inmemory';
import { resolvers as recipeResolvers, RECIPE_INGREDIENT_TYPE } from '../clients/Recipe';

it('Adding recipe should fail if payload is empty', () => {
	try {
		recipeResolvers.Mutation.addRecipe(null, { }, { cache: new InMemoryCache() });
	} catch (e) {
		expect(e).toBe('Title field is required.');
	}
});

it('Adding recipe should fail if title is empty', () => {
	try {
		recipeResolvers.Mutation.addRecipe(null, { title: "" }, { cache: new InMemoryCache() });
	} catch(e) {
		expect(e).toBe('Title field is required.');
	}
});

it('Adding recipe should fail if ingredients list is empty', () => {
	try {
		recipeResolvers.Mutation.addRecipe(null, { title: "title", ingredients: [] }, { cache: new InMemoryCache() });
	} catch(e) {
		expect(e).toBe('Recipe must have at least one ingredient.');
	}
});

it('Adding recipe should fail if number of people is not a numeric value', () => {

	let cache = new InMemoryCache();
	cache.writeData({
		data: {
			ingredients: [],
			cookbook:    []
		}
	});

	try {
		recipeResolvers.Mutation.addRecipe(null, {
			title: "title", people: "abc", ingredients: [{
				__typename: RECIPE_INGREDIENT_TYPE,
				idIngredient: 1,
				name: 'avocado',
				qtx: '1'
			}]
		}, { cache });
	} catch (e) {
		expect(e).toBe('People must be a numeric value.');
	}
});

it('Adding recipe should fail if page is not a numeric value', () => {

	let cache = new InMemoryCache();
	cache.writeData({
		data: {
			ingredients: [],
			cookbook: []
		}
	});

	try {
		recipeResolvers.Mutation.addRecipe(null, {
			title: "title", page: "abc", ingredients: [{
				__typename: RECIPE_INGREDIENT_TYPE,
				idIngredient: 1,
				name: 'avocado',
				qtx: '1'
			}]
		}, { cache });
	} catch (e) {
		expect(e).toBe('Page must be a numeric value.');
	}
});

it('Adding recipe should fail if cooking time is not in minutes', () => {

	let cache = new InMemoryCache();
	cache.writeData({
		data: {
			ingredients: [],
			cookbook: []
		}
	});

	try {
		recipeResolvers.Mutation.addRecipe(null, {
			title: "title", cookingtime: "abc", ingredients: [{
				__typename: RECIPE_INGREDIENT_TYPE,
				idIngredient: 1,
				name: 'avocado',
				qtx: '1'
			}]
		}, { cache });
	} catch (e) {
		expect(e).toBe('Cooking duration must be a numeric value in minutes.');
	}
});

it('Adding recipe should fail if work time is not in minutes', () => {

	let cache = new InMemoryCache();
	cache.writeData({
		data: {
			ingredients: [],
			cookbook: []
		}
	});

	try {
		recipeResolvers.Mutation.addRecipe(null, {
			title: "title", worktime: "abc", ingredients: [{
				__typename: RECIPE_INGREDIENT_TYPE,
				idIngredient: 1,
				name: 'avocado',
				qtx: '1'
			}]
		}, { cache });
	} catch (e) {
		expect(e).toBe('Cooking preparation must be a numeric value in minutes.');
	}
});

it('Adding recipe with complete payload', () => {

	let cache = new InMemoryCache();
	cache.writeData({
		data: {
			ingredients: [],
			cookbook: []
		}
	});

	recipeResolvers.Mutation.addRecipe(null, {
		title: "my recipe",
		book: "my book",
		people: 1,
		page: 1,
		cookingtime: 60,
		worktime: 120,
		description: "a small description",
		ingredients: [{
			__typename: RECIPE_INGREDIENT_TYPE,
			idIngredient: 1,
			name: 'avocado',
			qtx: '1'
		}]
	}, { cache });
});