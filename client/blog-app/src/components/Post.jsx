import React from "react";

export const Post = () => {
  return (
    <>
      <div className="post">
        <div className="image">
          <img src="https://placehold.co/600x400" alt="" />
        </div>
        <div className="text">
          <h2>Only PNG, JPEG, GIF and WebP formats support retina images.</h2>
          <p className="info">
            <span className="author">Shoaib Ud Din</span>
            <time datetime="">2023-01-06 16:45</time>
          </p>
          <p className="summary">
            Fusce ligula lacus, volutpat ac congue vel, pretium sed orci.
            Integer sit amet sem turpis. Curabitur pulvinar tellus eget pretium
            auctor. Nulla eget eros nulla. Ut a enim consequat, blandit ipsum
            sed, auctor mi. Curabitur ac dapibus risus. Duis ligula mi, cursus
            eu dapibus et, facilisis non ex. Phasellus semper pharetra diam, at
            egestas erat posuere sit amet. Ut et tellus accumsan, convallis nisl
            eget, efficitur est. Integer risus quam, fringilla id turpis quis,
            tincidunt elementum sem. Sed aliquet leo mattis, lacinia odio quis,
            blandit sapien. Mauris pharetra, ligula et rhoncus posuere, sem quam
            mattis arcu, suscipit ultricies leo orci in lacus. Nunc mauris
            magna, blandit sit amet mi in, rhoncus placerat mi. Nulla facilisi.
          </p>
        </div>
      </div>
    </>
  );
};
