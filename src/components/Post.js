import { useState, useEffect, useCallback } from 'react';
import { useClass } from '../contexts/ClassContext';
import { getUser, getForumReplies } from '../database';
import { Card } from 'react-bootstrap';
import ReactionBar from "../components/ReactionBar";
import Reply from "../components/Reply"

export default function Post(props) {
  const { currentClass } = useClass();
  const currentThread = props.thread;
  const currentPost = props.post;
  const populatePosts = props.populatePosts;
  const [author, setAuthor] = useState([]);
  const [replies, setReplies] = useState([]);

  const getUserGroup = useCallback((user) => {
    if (user && currentClass) {
      if (currentClass.studentIds.includes(user.id)) {
        return "students";
      } else if (currentClass.tutorIds.includes(user.id)) {
        return "tutors";
      } else if (currentClass.headTutor.id === user.id) {
        return 'headTutor';
      } else {
        return null;
      }
    }
  }, [currentClass])

  const populateAuthor = useCallback(() => {
    if (currentClass && currentThread && currentPost) {
      const userGroup = getUserGroup(currentPost.author);
      if (!userGroup) {
        setAuthor({name: "[Deleted User]"});
      } else if (userGroup === 'headTutor') {
        setAuthor(currentClass.headTutor);
      } else {
        getUser(currentClass.id, userGroup, currentPost.author.id)
          .then((user) => {
            setAuthor(user);
          });
      }
    }
  }, [currentClass, currentThread, currentPost, getUserGroup]);

  const populateReplies = useCallback(() => {
    if (currentClass && currentThread && currentPost) {
      getForumReplies(currentClass.id, currentThread.id, currentPost.id)
        .then((retrievedReplies) => {
          setReplies(retrievedReplies);
        });
    }
  }, [currentClass, currentThread, currentPost]);

  useEffect(() => {
    populateAuthor();
    populateReplies();
  }, [populateAuthor, populateReplies]);

  return (
    <div className='d-flex flex-column fs-5'>
      <Card className='slate-700'>
        <Card.Body>
          <h3><strong>{currentPost.title}</strong></h3>
          <h4 className='d-flex gap-4'>
            <strong>{author.name}</strong>
            <span>{author.level !== undefined ? `Level ${author.level}` : ''}</span>
          </h4>
          <p>{currentPost.body}</p>
        </Card.Body>
        <ReactionBar
          currentThread={currentThread}
          currentPost={currentPost}
          content={currentPost}
          contentType='post'
          populatePosts={populatePosts}
        />
      </Card>
      <div className="p-4 d-flex flex-column align-items-stretch gap-4">
        {
          replies.map((reply) => {
            return (
              <Reply
                key={reply.id}
                thread={currentThread}
                post={currentPost}
                reply={reply}
              />
            );
          })
        }
      </div>
    </div>
  );
}