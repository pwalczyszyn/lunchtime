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
            feeds: this.getFeedsFromHash(),
            loading: true
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

          this.loadPosts();

          // Setting signed in state
          this.setState({
              signedIn: true
          });

        });
    }

    loadPosts() {
        Promise.all(this.state.feeds.map(feed => new Promise(resolve => {
            FB.api(`/${feed.id}/feed`, 'get', null, response => {
                if (response.error) console.log('Error getting posts:', response.error);
                response.error ? feed.errorLoading = response.error : feed.posts = response.data;
                resolve();
            });
        }))).then(() => {
            this.setState(() => ({
                loading: false
            }));
        })
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
        this.setState(prevState => {
            return {
                addNew: false,
                feeds: prevState.feeds.concat(newFeed)
            }
        }, () => {
            this.setFeedsHash();
        });
    }

    getSignedInView() {

        if (this.state.loading) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <button onClick={() => this.setState({addNew: true})}>Add New Feed</button>

                {this.state.addNew
                    ? <FeedEdit onAdd={newFeed => this.onAdd(newFeed)}/>
                    : undefined}

                <div>
                    {this.state.feeds.map(feed => {
                        return <Feed feed={feed} key={feed.id}/>
                    })}
                </div>

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
