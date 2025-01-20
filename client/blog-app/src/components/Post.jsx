import React from "react";
import { format, formatISO9075 } from "date-fns";

export const Post = ({title,summary,content,cover,createdAt,author}) => {
  return (
    <>
      <div className="post">
        <div className="image">
          <img src={`http://localhost:4000/`+cover } />
        </div>
        <div className="text">
          <h2>{title}</h2>
          <p className="info">
            <span className="author">{author.userName}</span>
            <time datetime="">{format(new Date(createdAt),'MMM d,yyyy HH:mm')}</time>
          </p>
          <p className="summary">
            {summary}
          </p>
        </div>
      </div>
    </>
  );
};
