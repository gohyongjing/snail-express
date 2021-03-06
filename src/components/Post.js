import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';
import firestore from '../firestore';
import { Card } from 'react-bootstrap';
import ReactionBar from "../components/ReactionBar";
import Reply from "../components/Reply"
import Button from './Button';
import EditPost from './EditPost';

export default function Post(props) {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { getUser, getForumReplies } = firestore;
  const currentThread = props.thread;
  const currentPost = props.post;
  const populatePosts = props.populatePosts;
  const [author, setAuthor] = useState([]);
  const [replies, setReplies] = useState([]);
  const [editing, setEditing] = useState(false);

  const getUserGroup = useCallback((userId) => {
    if (userId && currentClass) {
      if (currentClass.studentIds.includes(userId)) {
        return "students";
      } else if (currentClass.tutorIds.includes(userId)) {
        return "tutors";
      } else if (currentClass.headTutor.id === userId) {
        return 'headTutor';
      } else {
        return null;
      }
    }
  }, [currentClass])

  const populateAuthor = useCallback(() => {
    if (currentClass && currentThread && currentPost) {
      const userGroup = getUserGroup(currentPost.authorId);
      if (!userGroup) {
        setAuthor({name: "[Deleted User]", role: 'Unknown role'});
      } else if (userGroup === 'headTutor') {
        setAuthor({...currentClass.headTutor, role: 'Head Tutor'});
      } else {
        getUser(currentClass.id, userGroup, currentPost.authorId)
          .then((user) => {
            setAuthor({...user, role: (userGroup === 'students' ? 'Student' : 'Tutor')});
          });
      }
    }
  }, [currentClass, currentThread, currentPost, getUserGroup, getUser]);

  const populateReplies = useCallback(() => {
    if (currentClass && currentThread && currentPost) {
      getForumReplies(currentClass.id, currentThread.id, currentPost.id)
        .then((retrievedReplies) => {
          setReplies(retrievedReplies);
        });
    }
  }, [currentClass, currentThread, currentPost, getForumReplies]);

  useEffect(() => {
    populateAuthor();
    populateReplies();
  }, [populateAuthor, populateReplies]);

  return (
    <div className='d-flex flex-column fs-5'>
      <Card className='slate-700'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center'>
            <h3><strong>{currentPost.title}</strong></h3>
            {
              currentPost.authorId === currentUser.uid
              ? <Button
                onClick={() => {setEditing(!editing)}}
              >
                Edit
              </Button>
              : null
            }
          </div>
          <h4 className='d-flex gap-4'>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
            <span>{author.level !== undefined ? `Level ${author.level}` : ''}</span>
          </h4>
          {editing
            ? <EditPost
              currentThread={currentThread}
              currentPost={currentPost}
              populatePosts={populatePosts}
              setEditing={setEditing}
            />
            : <p>{currentPost.body}</p>
          }
          
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
                populatePosts={populatePosts}
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