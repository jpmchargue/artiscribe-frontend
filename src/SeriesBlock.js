import React from 'react';


const SeriesBlock = (props) => {
  return (
    <div className="topic_block">
      <div className="topic_block_name">{props.content.name}</div>
      <div className="topic_block_info">{props.content.posts} posts total</div>
      <div className="topic_block_info">{props.content.rate} posts in the last 24 hours</div>
    </div>
  );
}


export default SeriesBlock;
