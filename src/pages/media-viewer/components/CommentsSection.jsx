import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentsSection = ({ 
  mediaId, 
  comments = [], 
  onAddComment,
  currentUser,
  className = '' 
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showComments && comments?.length > 0) {
      scrollToBottom();
    }
  }, [showComments, comments?.length]);

  const handleSubmitComment = async (e) => {
    e?.preventDefault();
    if (!newComment?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const comment = {
        id: Date.now()?.toString(),
        text: newComment?.trim(),
        author: currentUser,
        createdAt: new Date()?.toISOString(),
        mediaId
      };

      await onAddComment(comment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`bg-background border-t border-border ${className}`}>
      {/* Comments Toggle Header */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon name="MessageCircle" size={20} className="text-muted-foreground" />
          <span className="font-medium text-foreground">
            Comments ({comments?.length})
          </span>
        </div>
        <Icon 
          name={showComments ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-muted-foreground transition-transform duration-200"
        />
      </button>
      {/* Comments List */}
      {showComments && (
        <div className="border-t border-border">
          {/* Comments Container */}
          <div className="max-h-80 overflow-y-auto">
            {comments?.length === 0 ? (
              <div className="p-6 text-center">
                <Icon name="MessageCircle" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {comments?.map((comment) => (
                  <div key={comment?.id} className="flex space-x-3">
                    <Image
                      src={comment?.author?.avatar}
                      alt={comment?.author?.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {comment?.author?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCommentTime(comment?.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment?.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmitComment} className="flex space-x-3">
              <Image
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e?.target?.value)}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newComment?.trim() || isSubmitting}
                  loading={isSubmitting}
                  className="flex-shrink-0"
                  aria-label="Send comment"
                >
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;