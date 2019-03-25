import React, { Component } from 'react';
import { Link } from "react-router-dom";

//Styles
import './App.scss';

class Recipe extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Link to="/"><div>[close]</div></Link>
				<div>Recipe</div>
			</div>
		);
	}

}

export default Recipe;