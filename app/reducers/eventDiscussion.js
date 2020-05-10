import * as types from "../constants/actionTypes";
import _ from "lodash";

const postEventDiscussion = (state, action) => {
  return {
    ...state,
    countDiscussions: _.isEmpty(state.oResults)
      ? 1
      : action.countDiscussions + 1,
    oResults: [action.payload, ...state.oResults]
  };
};

const deleteEventDiscussion = (state, action) => {
  if (_.isEmpty(state.oResults)) return state;
  const { discussionID, countDiscussions } = action.payload;
  return {
    ...state,
    countDiscussions: state.countDiscussions === 0 ? 0 : countDiscussions - 1,
    oResults: state.oResults.filter(item => item.ID !== discussionID)
  };
};

const editEventDiscussion = (state, action) => {
  if (_.isEmpty(state.oResults)) return state;
  const { discussionID, postDate, postContent } = action.payload;
  return {
    ...state,
    oResults: state.oResults.map(item => ({
      ...item,
      postDate: item.ID === discussionID ? postDate : item.postDate,
      postContent: item.ID === discussionID ? postContent : item.postContent
    }))
  };
};

const likeEventDiscussion = (state, action) => {
  if (_.isEmpty(state.oResults)) return state;
  const { countLiked, isLiked, discussionID } = action.payload;
  return {
    ...state,
    oResults: state.oResults.map(item => ({
      ...item,
      isLiked: item.ID === discussionID ? isLiked : item.isLiked,
      countLiked: item.ID === discussionID ? countLiked : item.countLiked
    }))
  };
};

const postCommentEventDiscussion = (state, action) => {
  if (_.isEmpty(state.oResults)) return state;
  const { discussionID } = action.payload;
  return {
    ...state,
    oResults: state.oResults.map(item => ({
      ...item,
      countDiscussions:
        item.ID === discussionID
          ? item.countDiscussions + 1
          : item.countDiscussions
    }))
  };
};

const deleteCommentEventDiscussion = (state, action) => {
  if (_.isEmpty(state.oResults)) return state;
  const { discussionID } = action.payload;
  return {
    ...state,
    oResults: state.oResults.map(item => ({
      ...item,
      countDiscussions:
        item.ID === discussionID
          ? item.countDiscussions === 0
            ? 0
            : item.countDiscussions - 1
          : item.countDiscussions
    }))
  };
};

export const eventDiscussionLatest = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_EVENT_DISCUSSION_LATEST:
      return action.payload;
    case types.POST_EVENT_DISCUSSION:
      return postEventDiscussion(state, action);
    case types.DELETE_EVENT_DISCUSSION:
      return deleteEventDiscussion(state, action);
    case types.EDIT_EVENT_DISCUSSION:
      return editEventDiscussion(state, action);
    case types.LIKE_EVENT_DISCUSSION:
      return likeEventDiscussion(state, action);
    case types.POST_COMMENT_DISCUSSION_EVENT:
      return postCommentEventDiscussion(state, action);
    case types.DELETE_COMMENT_DISCUSSION_EVENT:
      return deleteCommentEventDiscussion(state, action);
    case types.RESET_EVENT_DISCUSSION:
      return { oResults: [] };
    default:
      return state;
  }
};

export const eventDiscussion = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_EVENT_DISCUSSION:
      return action.payload;

    case types.GET_EVENT_DISCUSSION_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    case types.POST_EVENT_DISCUSSION:
      return postEventDiscussion(state, action);
    case types.DELETE_EVENT_DISCUSSION:
      return deleteEventDiscussion(state, action);
    case types.EDIT_EVENT_DISCUSSION:
      return editEventDiscussion(state, action);
    case types.LIKE_EVENT_DISCUSSION:
      return likeEventDiscussion(state, action);
    case types.POST_COMMENT_DISCUSSION_EVENT:
      return postCommentEventDiscussion(state, action);
    case types.DELETE_COMMENT_DISCUSSION_EVENT:
      return deleteCommentEventDiscussion(state, action);
    case types.RESET_EVENT_DISCUSSION:
      return { oResults: [] };

    default:
      return state;
  }
};

export const commentInDiscussionEvent = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_COMMENT_DISCUSSION_EVENT:
      return action.payload;
    case types.POST_COMMENT_DISCUSSION_EVENT:
      console.log(action.payload, state);
      return {
        ...state,
        countDiscussions: state.countDiscussions + 1,
        oResults: [action.payload, ...state.oResults]
      };
    case types.EDIT_COMMENT_DISCUSSION_EVENT:
      return {
        ...state,
        oResults: state.oResults.map(item => {
          const { ID, postDate, postContent } = action.payload;
          return {
            ...item,
            postDate: item.ID === ID ? postDate : item.postDate,
            postContent: item.ID === ID ? postContent : item.postContent
          };
        })
      };
    case types.DELETE_COMMENT_DISCUSSION_EVENT:
      return {
        ...state,
        countDiscussions: state.countDiscussions - 1,
        oResults: state.oResults.filter(
          item => item.ID !== action.payload.commentID
        )
      };
    case types.RESET_CMT_EVENT_DISCUSSION:
      return { oResults: [] };
    default:
      return state;
  }
};

export const eventDiscussionMessage = (state = "", action) => {
  switch (action.type) {
    case types.ACTION_EVENT_DISCUSSION_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};
