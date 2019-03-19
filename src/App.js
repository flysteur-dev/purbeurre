import React, { Component } from 'react';
import _ from 'lodash';

//Styles
import './App.scss';

//Components
import Search  from './components/Search';
import Filter  from './components/Filter';
import Results from './components/Results';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //List of all available ingredients
      ingredientsBase: ["avocat", "abricot", "lait", "tomate", "chocolat", "mandarine", "crevette"],

      //List of all available recipes
      cookbook: [{
          title: "recette 1",
          ingredients: ["avocat", "lait"]
        }, {
          title: "recette 2",
          ingredients: ["tomate"]
        }, {
          title: "recette 3",
          ingredients: ["avocat", "tomate"]
        }, {
          title: "recette 4",
          ingredients: ["crevette", "avocat"]
        }
      ],

      filter: [],
      cookbookFiltered: []
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
        return _.difference(this.state.filter, recipe.ingredients).length === 0
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Search filterByIngredient={this.addFilter} ingredients={this.state.ingredientsBase} />
        <hr />
        <Filter removeFilter={this.removeFilter} filters={this.state.filter} />
        <hr />
        <Results items={this.state.cookbookFiltered} />
      </div>
    );
  }
}

export default App;
