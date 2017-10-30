/* global FB */
import React from 'react';

export default class Feed extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.feed;

        FB.api(`/${this.state.id}/feed`, 'get', null, response => this.displayPosts(response));
    }

    displayPosts(response) {
        console.log(response);
    }

    render() {
        return <li className="App-feedsListItem">
            {this.state.id}

        </li>;
    }
}
