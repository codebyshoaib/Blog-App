import React from "react";
import { format, formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export const Post = ({ _id,title, summary, content, cover, createdAt, author }) => {
  return (
    <>
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/` + cover} />
          </Link>
        </div>
        <div className="text">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>

          <p className="info">
            <span className="author">{author.userName}</span>
            <time datetime="">
              {format(new Date(createdAt), "MMM d,yyyy HH:mm")}
            </time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    </>
  );
};
