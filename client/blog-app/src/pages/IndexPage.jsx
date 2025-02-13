import React, { useEffect, useState } from 'react';
import "../App.css";
import { Post } from '../components/Post';

export const IndexPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/post')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="index-page">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id} // Use a unique key, such as `_id`
            title={post.title}
            summary={post.summary}
            content={post.content}
            cover={post.cover}
            createdAt={post.createdAt}
            author={post.author}
            _id={post._id}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};
