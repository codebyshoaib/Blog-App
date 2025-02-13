import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Editor } from "../Editor";

export const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://blog-app-887w.vercel.app/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();

    let data;
    let headers = {};

    if (file) {
      // Send as FormData if a file is uploaded
      data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("file", file);
      data.set('id',id);
    } else {
      // Send as JSON if no file is uploaded
      data = JSON.stringify({ title, summary, content });
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: "PUT",
        body: data,
        headers,
        credentials:'include'
      });

      const result = await response.json();
      console.log("Update Response:", result);

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error("Update failed:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <>
      <form onSubmit={updatePost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input
          type="file"
          onChange={(ev) => setFile(ev.target.files[0])}
        />
        <Editor onChange={setContent} value={content} />
        <button
          style={{ marginTop: "5px", backgroundColor: "green", color: "white" }}
        >
          Update Post
        </button>
      </form>
    </>
  );
};
