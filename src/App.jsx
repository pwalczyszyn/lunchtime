/* global FB */

import './App.css';

import React from 'react';

import FeedEdit from './FeedEdit';

import Feed from './Feed';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            addNew: false,
            feeds: this.getFeedsFromHash()
        };

        if (window.fbSdkLoaded) {
            this.loginToFb();
        } else {
            window.addEventListener('fb-sdk-loaded', () => this.loginToFb());
        }

    }

    loginToFb() {
        FB.login(() => {
          // Note: The call will only work if you accept the permission request
          //   FB.api('/me/feed', 'post', {message: 'Hello, world!'});

          // Setting signed in state
          this.setState({
              signedIn: true
          });

        });
    }

    getFeedsFromHash() {
        try {
            const value = JSON.parse(window.atob(window.location.hash.substr(1)));
            return Array.isArray(value)
                ? value
                : [];
        } catch (error) {
            return [];
        }
    }

    setFeedsHash() {
        window.location.hash = `#${window.btoa(JSON.stringify(this.state.feeds))}`;
    }

    onAdd(newFeed) {
        this.state.feeds.push(newFeed);
        this.setFeedsHash();

        this.setState({addNew: false});
    }

    getSignedInView() {
        return (
            <div>
                <button onClick={() => this.setState({addNew: true})}>Add New Feed</button>

                {this.state.addNew
                    ? <FeedEdit onAdd={newFeed => this.onAdd(newFeed)}/>
                    : undefined}

                <ul className="App-feedsList">
                    {this.state.feeds.map(feed => {
                        return <Feed feed={feed} key={feed.id}/>
                    })}
                </ul>
            </div>
        );
    }

    render() {

        return (
            <div className="App">
                {this.state.signedIn ? this.getSignedInView() : 'Signing in to FB...'}
            </div>
        );
    }
}

export default App;
