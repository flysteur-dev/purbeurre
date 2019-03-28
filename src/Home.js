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
      cookbookFiltered: _.slice(this.props.cookbook, 0, 20),
      filters: [],
    };
  }

  addFilter = (ingredient) => {
    this.setState(prevState => ({
        filters: [...prevState.filters, ingredient]
    }), () => this.updateFilter());
  }

  removeFilter = (ingredient) => {
    this.setState(prevState => ({
      filters: _.filter(prevState.filters, (filter) => {
        return filter !== ingredient
      })
    }), () => this.updateFilter());
  }

  updateFilter = (times) => {
    this.setState({
      cookbookFiltered: _.filter(this.state.cookbook, (recipe) => {
        if (times) {
          //Filter cooking time duration in minutes
          if (times.cookingtime) {
            if (
              recipe.cookingtime > times.cookingtime.max ||
              recipe.cookingtime < times.cookingtime.min
            ) return false;
          }

          //Filter work time duration in minutes
          if (times.worktime) {
            if (
              recipe.worktime > times.worktime.max ||
              recipe.worktime < times.worktime.min
            ) return false;
          }
        }

        //Filter recipes with selected ingredients
        return _.difference(_.map(this.state.filters, 'id'), _.map(recipe.ingredients, 'idIngredient')).length === 0
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
        <Filter updateFilter={this.updateFilter} removeFilter={this.removeFilter} filters={this.state.filters} />
        <hr />
        <Results items={this.state.cookbookFiltered} />

        <div className="AddButton"><Link to="/add">+</Link></div>
      </div>
    );
  }
}

export default Home;
