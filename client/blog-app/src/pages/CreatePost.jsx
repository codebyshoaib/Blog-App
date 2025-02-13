import React, { useState } from "react";

import { Navigate } from "react-router-dom";


export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files,setFiles]=useState('');
  const [redirect,setRedirect]=useState(false);
  async function createNewPost(ev) {
    const data =new FormData();
    data.set('title',title);
    data.set('summary',summary),
    data.set('content',content);
    data.set('files',files[0])
    ev.preventDefault();
    
   const response=await fetch('https://blog-app-887w.vercel.app/post',{
      method:'POST',
      body:data,
      credentials:'include',
    })
    if(response.ok){
      setRedirect(true);
    }
  }


  if(redirect){
   return  <Navigate to={'/'}/>

  }
  return (
    <>
      <form onSubmit={createNewPost}>
        <input
          type="title"
          placeholder={"title"}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="summary"
          placeholder={"Summary"}
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input type="file"  onChange={(ev)=>setFiles(ev.target.files)} />
        <Editor value={content} onChange={setContent}></Editor>
        <button
          style={{ marginTop: "5px", backgroundColor: "green", color: "white" }}
        >
          Create Post
        </button>
      </form>
    </>
  );
};
