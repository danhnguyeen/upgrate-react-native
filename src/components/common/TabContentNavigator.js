/* eslint-disable import/imports-first,max-len */
import React, { Component } from 'react';
import { Router } from './CommonItem';

export default class TabContentNavigator extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			active: props.value,
		};
	}

	//this method will not get called first time
	componentWillReceiveProps(newProps) {
		this.setState({
			active: newProps.value,
		});
	}

	render() {
		const Content = Router.getComponentForRouteName(this.state.active);
		return <Content />;
	}
}
