import { combineReducers } from "redux";
import * as requestTimeout from "./requestTimeout";
import { listings } from "./listings";
import { listingSearchResults } from "./listingSearchResults";
import { listingByCat } from "./listingByCat";
import { loading, loadingListingDetail, loadingReview } from "./loading";
import * as listingDetailAll from "./listingDetail";
import { listingFilters } from "./listingFilters";
import { homeScreen } from "./homeScreen";
import { locationList } from "./locationList";
import { categoryList } from "./categoryList";
import { locations } from "./locations";
import { translations } from "./translations";
import { scrollTo } from "./scrollTo";
import { events } from "./events";
import { eventDetail } from "./eventDetail";
import {
  eventDiscussion,
  eventDiscussionLatest,
  commentInDiscussionEvent,
  eventDiscussionMessage
} from "./eventDiscussion";
import { eventSearchResults } from "./eventSearchResults";
import { articles } from "./articles";
import { articleDetail } from "./articleDetail";
import { tabNavigator, stackNavigator } from "./navigators";
import { nearByFocus } from "./nearByFocus";
import { page } from "./page";
import { settings } from "./settings";
import {
  auth,
  isTokenExpired,
  loginError,
  isLoginLoading,
  signupError,
  isSignupLoading
} from "./reducerAuth";
import {
  myFavorites,
  listIdPostFavorites,
  listIdPostFavoritesRemoved,
  listProductFavorites
} from "./reducerMyFavorites";
import { reportForm, reportMessage } from "./reducerReportForm";
import { accountNav } from "./reducerAccountNav";
import { myProfile, myProfileError, shortProfile } from "./reducerMyProfile";
import { editProfileForm } from "./reducerEditProfileForm";
import { myListings, myListingError } from "./reducerMyListings";
import { listingStatus, eventStatus } from "./reducerListingStatus";
import { postTypes } from "./reducerPostTypes";
import { myEvents, myEventError } from "./reducerMyEvents";
import {
  myNotifications,
  myNotificationError,
  deleteMyNotificationError
} from "./reducerMyNotifications";
import { signUpForm } from "./reducerSignupForm";
import { countNotify, countNotifyRealTimeFaker } from "./reducerCounts";
import {
  messageChat,
  isWritingMessageChat,
  messageNewCount,
  isCurrentSendMessageScreen
} from "./reducerMessage";
import {
  users,
  usersError,
  user,
  usersFromFirebase,
  usersFromFirebaseLoading,
  usersFromFirebaseError,
  keyFirebase,
  keyFirebase2,
  userConnections
} from "./reducerUsers";
import { deviceToken } from "./reducerDeviceToken";
import {
  notificationSettings,
  notificationAdminSettings
} from "./reducerNotificationSettings";
import { db } from "./reducerFirebase";
import { reviewFields } from "./reducerReviewFields";
import {
  productReducer,
  cartReducer,
  paymentReducer,
  orderReducer,
  bookingReducer
} from "./product";
import dokanReducer from "./dokanReducer";
const reducers = combineReducers({
  reviewFields,
  db,
  notificationSettings,
  notificationAdminSettings,
  deviceToken,
  users,
  usersError,
  user,
  usersFromFirebase,
  usersFromFirebaseLoading,
  usersFromFirebaseError,
  keyFirebase,
  keyFirebase2,
  userConnections,
  messageChat,
  isWritingMessageChat,
  messageNewCount,
  isCurrentSendMessageScreen,
  countNotify,
  countNotifyRealTimeFaker,
  signUpForm,
  myNotifications,
  myNotificationError,
  deleteMyNotificationError,
  myEvents,
  myEventError,
  postTypes,
  listingStatus,
  eventStatus,
  myListings,
  myListingError,
  listings,
  listingSearchResults,
  listingByCat,
  ...listingDetailAll,
  listingFilters,
  homeScreen,
  loading,
  loadingListingDetail,
  loadingReview,
  locationList,
  categoryList,
  locations,
  translations,
  scrollTo,
  events,
  eventDetail,
  eventDiscussion,
  eventDiscussionLatest,
  commentInDiscussionEvent,
  eventDiscussionMessage,
  eventSearchResults,
  articles,
  articleDetail,
  tabNavigator,
  stackNavigator,
  nearByFocus,
  page,
  settings,
  auth,
  isTokenExpired,
  loginError,
  isLoginLoading,
  signupError,
  isSignupLoading,
  myFavorites,
  listIdPostFavorites,
  listIdPostFavoritesRemoved,
  listProductFavorites,
  reportForm,
  reportMessage,
  accountNav,
  myProfile,
  myProfileError,
  shortProfile,
  editProfileForm,
  ...requestTimeout,
  productReducer,
  cartReducer,
  paymentReducer,
  orderReducer,
  bookingReducer,
  dokanReducer
});

export default reducers;
