import React, { Component } from 'react';
import InputRange from 'react-input-range';

import '../App.scss';
import 'react-input-range/lib/css/index.css';

class Filter extends Component {

	constructor(props) {
		super(props);

		this.state = {
			//Default (in minutes)
			cookingtime: { min: 0, max: 120 },
			worktime:    { min: 0, max: 120 }
		};
	}

	remove = (suggest) => {
		this.props.removeFilter(suggest);
	}

	update = (time) => {
		this.setState(time, () => {
			this.props.updateFilter(this.state);
		});
	}

	filters = (props) => {
		return props.filters.map((filter) => {
			return <li key={`f_${filter.id}`} onClick={() => this.remove(filter)}>{filter.name}</li>
		})
	}

	render() {
		return (
			<div className="Filter">
				<InputRange
					maxValue={120}
					minValue={0}
					formatLabel={value => `${value}`}
					value={this.state.worktime}
					onChange={worktime => this.update({ worktime })} />

				<InputRange
					maxValue={120}
					minValue={0}
					formatLabel={value => `${value}`}
					value={this.state.cookingtime}
					onChange={cookingtime => this.update({ cookingtime })} />

				<ul>
					{this.filters(this.props)}
				</ul>
			</div>
		);
	}
}

export default Filter;
