import _ from 'lodash';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Link } from "react-router-dom";

//Styles
import './App.scss';

//Components
import Search  from './components/Search';
import Filter  from './components/Filter';
import Results from './components/Results';

//Queries
import { GET_INGREDIENTS } from './clients/Ingredient';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cookbook: this.props.cookbook,
      cookbookFiltered: this.props.cookbook,
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
        return _.difference(_.map(this.state.filter, 'id'), _.map(recipe.ingredients, 'idIngredient')).length === 0
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Query query={GET_INGREDIENTS}>
          {({ data }) => {
            return (
              <Search filterByIngredient={this.addFilter} ingredients={data.ingredients} />
            )
          }}
        </Query>
        <hr />
        <Filter removeFilter={this.removeFilter} filters={this.state.filter} />
        <hr />
        <Results items={this.state.cookbookFiltered} />

        <div className="AddButton"><Link to="/add">+</Link></div>
      </div>
    );
  }
}

export default Home;
