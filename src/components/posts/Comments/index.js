import React from "react"
import PropTypes from 'prop-types'
import CommentForm from "./CommentForm"
import Comment from "./Comment"

const Comments = ({ data, identity, comments }) => {
  const post = data.ghostPost
  console.log(`gfgdg`)
  console.log(comments)

  return (
    <>
      <div id="comments">
        {comments &&
        <div className="user-comments">
          {comments.map(({ node }) => (
            <Comment key={node.id} comment={node} />
          ))}
        </div> }
        <CommentForm post={post} identity={identity} />
      </div>
    </>
  )
}

Comments.propTypes = {
  data: PropTypes.object.isRequired,
  identity: PropTypes.object,
  comments: PropTypes.array,
}

export default Comments
