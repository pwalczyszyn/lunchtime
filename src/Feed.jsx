import React from 'react';

import moment from 'moment';

const Post = ({post}) => {
    console.log(post);
    return <div className="App-postContainer">
        <h3>
            {moment(post.created_time).fromNow()}
        </h3>
        {post.message}
    </div>;
};

const Feed = ({feed}) => {
    const posts = feed.posts || [];
    const todayNum = new Date().getDay();
    const weekday = feed.weekdays.find(weekday => weekday.enabled && weekday.dayNum === todayNum);
    const startTime = weekday && moment(weekday.startTime, 'hh:mm');
    const endTime = weekday && moment(weekday.endTime, 'hh:mm');

    console.log(startTime, endTime);

    return <section className="App-feedsListItem">

        <h1>
            {feed.id}
        </h1>

        {posts.slice(0, 3).map(post => <Post key={post.id} post={post} />)}

    </section>;
};

export default Feed;
