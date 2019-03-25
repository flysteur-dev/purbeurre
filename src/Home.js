import React, { Component } from 'react';
import _ from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

//Styles
import './App.scss';

//Components
import Search  from './components/Search';
import Filter  from './components/Filter';
import Results from './components/Results';

//Query
const GET_BASE_INGREDIENTS = gql`
  query {
	  ingredientsBase @client {
      id,
      name
    }
  }
`;

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cookbook: this.props.cookbook,
      cookbookFiltered: [],
      filter: [],
    };
  }

  addFilter = (ingredient) => {
    this.setState(prevState => ({
        filter: [...prevState.filter, ingredient]
    }), () => this.applyFilter());
  }

  removeFilter = (ingredient) => {
    this.setState(prevState => ({
      filter: _.filter(prevState.filter, (filter) => {
        return filter !== ingredient
      })
    }), () => this.applyFilter());
  }

  applyFilter = () => {
    //Filter recipes with selected ingredients
    this.setState({
      cookbookFiltered: _.filter(this.state.cookbook, (recipe) => {
        return _.difference(_.map(this.state.filter, 'id'), recipe.ingredients).length === 0
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Query query={GET_BASE_INGREDIENTS}>
          {({ data, loading, error }) => {
            return (
              <Search filterByIngredient={this.addFilter} ingredients={data.ingredientsBase} />
            )
          }}
        </Query>
        <hr />
        <Filter removeFilter={this.removeFilter} filters={this.state.filter} />
        <hr />
        <Results items={this.state.cookbookFiltered} />
      </div>
    );
  }
}

export default Home;
