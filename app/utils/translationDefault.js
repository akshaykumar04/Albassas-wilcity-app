import { decodeObject } from "./decodeObject";

const translations = {
  "0": "You do not have permission to access this page",
  "1": "You do not have permission to access this page",
  fbEmailError:
    "Error: We could not find your email in this Facebook account. Please make sure that this Facebook account is verified and You provide your email address to it.",
  day: "Day",
  days: "days",
  promotionDuration: "Promotion Duration: ",
  maximumMenuWarning: "You can add a maximum of %s menus",
  maximumItemWarning: "You can add a maximum of %s items",
  wroteReviewsFor: "Wrote reviews for",
  itemTitle: "Item title",
  confirmDeleteSetting: "Are you want to delete this setting?",
  icon: "Icon",
  linkTo: "Link To",
  addNew: "Add new",
  isOpenNewWindow: "Is open new window?",
  price: "Price",
  noResultsFound: "Sorry, No results found",
  verfied: "Verified",
  ads: "Ads",
  openingAt: "Opening at",
  closedAt: "Closed at",
  renew: "Renew",
  getDirection: "Get Direction",
  contentIsNoLongerAvailable: "This content is no longer available",
  gatewayIsRequired: "Please select a payment gateway",
  update: "Update",
  discussionUpdatedSuccessfully:
    "Congratulations! Your discussion has been updated successfully",
  discussionAddedSuccessfully:
    "Congratulations! Your discussion has been posted successfully",
  discussionBeingReviewed:
    "Thank for submitting! Your discussion has been received and is being reviewed by our team staff",
  lat: "Latitude",
  lng: "Longitude",
  sending: "Sending",
  callUs: "Call Us",
  emailUs: "Email Us",
  totalView: "View",
  totalViews: "Views",
  unlimited: "Unlimited",
  showMore: "Show more",
  showLess: "Show less",
  sentYourLocation: "Sent Your Location",
  shareOnFacebook: "Share on Facebook",
  shareOnTwitter: "Share on Twitter",
  shareToEmail: "Email Coupon",
  pleaseUseThisCouponCode: "Please us this coupon code:",
  reviewSubmittedSuccessfully: "Your review has been submitted successfully",
  reviewBeingReviewed:
    "Thank for submitting! Your review has been received and is being reviewed by our team staff",
  reviewTitle: "Review Title",
  setting: "Setting",
  settings: "Settings",
  discussionEmpty: "The discussion content is required",
  youLeftAReviewBefore: "You already left a review before.",
  couldNotInsertReview: "Oops! We could not insert the review",
  reviewIDIsRequired: "Review ID is required",
  yourReview: "Your Review",
  thisFeatureIsNotAvailable: "This feature is not available yet",
  currentAccount: "Current Account",
  aMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ],
  oneMinuteAgo: "1 minute ago",
  aFewMinutesAgo: "A few minutes ago",
  minutesAgo: "minutes ago",
  hoursAgo: "hours ago",
  hourAgo: "hour ago",
  browserDoesNotSupportLocalStore:
    "Sorry, your browser does not support Web Storage...",
  deleteMyAccount: "Delete My Account",
  permanentlyDeleteAccount: "Permanently Delete Account",
  copy: "Copy",
  copied: "Copied",
  online: "Online",
  offline: "Offline",
  deleteMessage: "Do you want to delete this message?",
  startConversation: "Starting a conversation with an author now.",
  searchAuthor: "Search Author",
  postType: "Post Type",
  status: "Status",
  connectWithSocialNetworks: "Or Connect With",
  fbLoginWarning:
    "Facebook Init is not loaded. Check that you are not running any blocking software or that you have tracking protection turned off if you use Firefox",
  createdAccountSuccessfully:
    "Congrats! Your account has been created successfully.",
  couldNotCreateAccount:
    "ERROR: We could not create your account. Please try later.",
  usernameExists:
    "ERROR: Sorry, The username is not available. Please with another username.",
  emailExists:
    "ERROR: An account with this email already exists on the website.",
  invalidEmail: "ERROR: Invalid Email",
  needCompleteAllRequiredFields: "ERROR: Please complete all required fields.",
  needAgreeToTerm:
    "ERROR: Sorry, To create an account on our site, you have to agree to our terms conditionals.",
  needAgreeToPolicy:
    "ERROR: Sorry, To create an account on our site, you have to agree to our privacy policy.",
  disabledLogin: "Sorry, We are disabled this service temporary.",
  youAreLoggedInAlready: "You are logged in already.",
  deletedNotification:
    "Congrats! The notification has been deleted successfully.",
  couldNotDeleteNotification:
    "Oops! We could not delete this notification. Please recheck your Notification ID.",
  confirmDeleteNotification: "Do you want to delete this notification?",
  idIsRequired: "The ID is required",
  noDataFound: "No Data Found",
  couldNotSendMessage:
    "OOps! We could not send this message, please try clicking on Send again.",
  messageContentIsRequired: "Message Content is required",
  chatFriendIDIsRequired: "Chat friend id is required",
  authorMessageHasBeenDelete:
    "Congrats! The author messages has been deleted successfully.",
  messageHasBeenDelete: "Congrats! The message has been deleted successfully.",
  weCouldNotDeleteMessage:
    "Oops! Something went wrong, We could not delete this message.",
  weCouldNotDeleteAuthorMessage:
    "Oops! Something went wrong, We could not delete the author messages.",
  authorIDIsRequired: "Author ID is required",
  msgIDIsRequired: "Message ID is required",
  fetchedAllMessages: "Fetched all messages",
  aFewSecondAgo: "A few seconds ago",
  xMinutesAgo: "%s minutes ago",
  xHoursAgo: "%s hours ago",
  noMessage: "There are no messages",
  allNotificationsIsLoaded: "All Notification is loaded",
  passwordHasBeenUpdated:
    "Congrats! Your password has been updated successfully.",
  all: "All",
  confirmDeleteFavorites: "Do you want delete it from your favorites",
  backTo: "Back To",
  logoutDesc: "Do you want to logout?",
  requiredLogin: "You need to login to your account first",
  continue: "Continue",
  logout: "Logout",
  favorite: "Favorite",
  report: "Report",
  editProfile: "Edit Profile",
  foundNoUser: "User profile does not exist.",
  userIDIsRequired: "Take a Photo",
  takeAPhoto: "Take a Photo",
  uploadPhoto: "Upload photo",
  uploadPhotoFromLibrary: "Upload photo from Library",
  firstName: "First Name",
  lastName: "Last Name",
  displayName: "Display Name",
  avatar: "Avatar",
  coverImg: "Cover Image",
  email: "Email",
  position: "Position",
  introYourSelf: "Intro yourself",
  address: "Address",
  phone: "Phone",
  website: "Website",
  socialNetworks: "Social Networks",
  changePassword: "Change Password",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm Password",
  youNeedToCompleteAllRequired: "Please complete all required fields",
  validationData: {
    email: {
      presence: {
        message: "Email is required"
      },
      special: {
        message: "Invalid email address"
      }
    },
    phone: {
      presence: {
        message: "Phone number is required"
      },
      special: {
        message: "Invalid phone number"
      }
    },
    url: {
      presence: {
        message: "URL is required"
      },
      special: {
        message: "Invalid URL"
      }
    },
    username: {
      presence: {
        message: "Username is required"
      },
      length: {
        minimum: 3,
        message: "Your username must be at least 3 characters"
      }
    },
    password: {
      presence: {
        message: "Please enter a password"
      },
      length: {
        minimum: 5,
        message: "Your password must be at least 5 characters"
      }
    },
    confirmPassword: {
      presence: {
        message: "Password does not match the confirm password"
      }
    },
    firstName: {
      presence: {
        message: "Please enter a password"
      },
      length: {
        message: "Your first name must be at least %s characters"
      }
    },
    lastName: {
      presence: {
        message: "Please enter your last name"
      },
      length: {
        minimum: 3,
        message: "Your last name must be at least 3 characters"
      }
    },
    displayName: {
      presence: {
        message: "Please enter your display name"
      },
      length: {
        minimum: 3,
        message: "Your display name must be at least 3 characters"
      }
    },
    agreeToTerms: {
      presence: {
        message: "You must agree to our terms conditionals."
      }
    },
    agreeToPolicy: {
      presence: {
        message: "You must agree to our policy privacy."
      }
    }
  },
  invalidGooglereCaptcha: "Pleas verify reCaptcha first.",
  profileHasBeenUpdated: "Congrats! Your profile have been updated",
  errorUpdateProfile:
    "ERROR: Something went wrong, We could not update your profile.",
  errorUpdatePassword:
    "ERROR: The password confirmation must be matched the new password.",
  sendAnEmailIfIReceiveAMessageFromAdmin: "Receive message through email",
  reportMsg: "Thank for your reporting!",
  weNeedYourReportMsg: "Please give us your reason",
  aPostStatus: [
    {
      status: "Published",
      icon: "la la-share-alt",
      bgColor: "bg-gradient-1",
      post_status: "publish",
      total: 0
    },
    {
      status: "In Review",
      icon: "la la-refresh",
      bgColor: "bg-gradient-2",
      post_status: "pending",
      total: 0
    },
    {
      status: "Unpaid",
      icon: "la la-money",
      bgColor: "bg-gradient-3",
      post_status: "unpaid",
      total: 0
    },
    {
      status: "Expired",
      icon: "la la-exclamation-triangle",
      bgColor: "bg-gradient-4",
      post_status: "expired",
      total: 0
    }
  ],
  aEventStatus: [
    {
      status: "Upcoming",
      icon: "la la-calendar-o",
      bgColor: "bg-gradient-1",
      post_status: "publish",
      total: 0
    },
    {
      status: "OnGoing",
      icon: "la la-calendar-o",
      bgColor: "bg-gradient-2",
      post_status: "ongoing",
      total: 0
    },
    {
      status: "Expired",
      icon: "la la-calendar-o",
      bgColor: "bg-gradient-3",
      post_status: "expired",
      total: 0
    },
    {
      status: "In Review",
      icon: "la la-calendar-o",
      bgColor: "bg-gradient-4",
      post_status: "pending",
      total: 0
    },
    {
      status: "Temporary Close",
      icon: "la la-calendar-o",
      bgColor: "bg-gradient-4",
      post_status: "temporary_close",
      total: 0
    }
  ],
  gotAllFavorites: "All favorites have been displayed",
  noFavorites: "There are no favorites",
  tokenExpired:
    "The token has been expired, please log into the app to generate a new token",
  profile: "Profile",
  messages: "Messages",
  favorites: "Favorites",
  doNotHaveAnyArticleYet: "You do not have any article yet.",
  invalidUserNameOrPassword: "Invalid User Name Or Password",
  download: "Download",
  geoCodeIsNotSupportedByBrowser:
    "Geolocation is not supported by this browser.",
  askForAllowAccessingLocationTitle:
    "Allow accessing your location while you are using the app?",
  askForAllowAccessingLocationDesc:
    "Your current location will be used for nearby search results.",
  discussionContentRequired: "Please write something before submitting",
  seeMoreDiscussions: "See more discussions",
  allRegions: "All Regions",
  nearby: "Nearby",
  networkError: "Network Error",
  retry: "Tap To Retry",
  weAreWorking: "We are working on this feature",
  searchResults: "Search Results",
  noPostFound: "No Posts Found",
  noDiscussion: "No discussion found",
  discussion: "Discussion",
  discussions: "Discussions",
  hostedBy: "Hosted By",
  editReview: "Edit review",
  updateReview: "Update review",
  always_open: "Open 24/7",
  whatAreULookingFor: "What are you looking for?",
  notFound: "Not Found",
  viewProfile: "View Profile",
  inReviews: "In Reviews",
  addSocial: "Add Social",
  searchNow: "Search Now",
  temporaryClose: "Temporary Close",
  back: "Back",
  expiryOn: "Expiry On",
  views: "Views",
  shares: "Shares",
  home: "Home",
  searchAsIMoveTheMap: "Search as I move the map",
  allListings: "All Listings",
  allCategories: "All Categories",
  allLocations: "All Locations",
  allTags: "All Tags",
  geolocationError: "Geolocation is not supported by this browser.",
  promotions: "Promotions",
  askChangePlan:
    "Just a friendly popup to ensure that you want to change your subscription level?",
  changePlan: "Change Plan",
  active: "Active",
  getNow: "Get Now",
  listingType: "Listing Type",
  currency: "Currency",
  billingType: "Billing Type",
  nextBillingDate: "Next Billing Date",
  currentPlan: "Current Plan",
  remainingItems: "Remaining Items",
  billingHistory: "Billing History",
  subTotal: "Sub Total",
  discount: "Discount",
  plan: "Plan",
  planName: "Plan Name",
  planType: "Plan Type",
  gateway: "Gateway",
  payfor: "Invoice Pay For",
  date: "Date",
  description: "Description",
  viewDetails: "View Details",
  viewAll: "View All",
  amount: "Amount",
  more: "More",
  categories: "Categories",
  saveChanges: "Save Changes",
  basicInfo: "Basic Info",
  followAndContact: "Follow &amp; Contact",
  resetPassword: "Reset Password",
  ihaveanaccount: "Already have an account?",
  username: "Username",
  usernameOrEmail: "Username or Email Address",
  password: "Password",
  lostPassword: "Lost your password?",
  donthaveanaccount: "Don&#039;t have an account?",
  rememberMe: "Remember me?",
  login: "Login",
  register: "Register",
  isShowOnHome: "Do you want to show the section content on the Home tab?",
  viewMoreComments: "View more comments",
  reportTitle: "Report abuse",
  pinToTopOfReview: "Pin to Top of Review",
  unPinToTopOfReview: "Unpin to Top of Review",
  seeMoreReview: "See More Reviews",
  eventName: "Event Name",
  peopleInterested: "People interested",
  upcoming: "Upcoming",
  unpaid: "Unpaid",
  ongoing: "Ongoing",
  expired: "Expired",
  promote: "Promote",
  title: "Title",
  type: "Type",
  oChart: {
    oHeading: {
      views: "Total Views",
      favorites: "Total Favorites",
      shares: "Total Shares",
      ratings: "Average Rating"
    },
    oLabels: {
      views: "Views",
      favorites: "Favorites",
      shares: "Shares",
      ratings: "Ratings"
    },
    up: "Up",
    down: "Down"
  },
  noOlderNotifications: "No older notifications.",
  notifications: "Notifications",
  seeAll: "See All",
  of: "of",
  gallery: "Gallery",
  favoriteTooltip: "Save to my favorites",
  oneResult: "Result",
  twoResults: "Results",
  moreThanTwoResults: "Results",
  filterByTags: "Filter By Tags",
  to: "To",
  send: "Send",
  message: "Message",
  newMessage: "New Message",
  searchUsersInChat: "Search by username",
  recipientInfo: "Recipient information",
  inbox: "Message",
  deleteMsg: "Delete Message",
  search: "Search",
  couldNotAddProduct: "We could not add product to cart",
  directBankTransfer: "Direct Bank Transfer",
  totalLabel: "Total",
  boostSaleBtn: "Boost now",
  selectAdsPosition: "Select Ads Positions",
  selectAdsDesc: "Boost this post to a specify positions on the website",
  boostPost: "Boost Post",
  boostEvent: "Boost Event",
  selectPlans: "Select Plans",
  name: "Name",
  addVideoBtn: "Add Video",
  videoLinkPlaceholder: "Video Link",
  image: "Image",
  images: "Images",
  uploadVideosTitle: "Upload Videos",
  uploadVideosDesc: "Add more videos to this listing",
  uploadSingleImageTitle: "Upload Image",
  uploadMultipleImagesTitle: "Upload Images",
  uploadMultipleImagesDesc: "Add more images to this listing",
  maximumVideosWarning: "You can add a maximum of %s videos",
  maximumImgsWarning: "You can upload a maximum of %s images",
  weNeedYour: "We need your",
  showMap: "Show map",
  enterAQuery: "Enter a query",
  starts: "Starts",
  endsOn: "End",
  time: "Time",
  photo: "Photo",
  photos: "Photos",
  noComments: "No Comment",
  comment: "Comment",
  comments: "Comments",
  share: "Share",
  like: "Like",
  likes: "Likes",
  liked: "Liked",
  typeAMessage: "Type a message...",
  confirmHide: "Are you sure that you want to hide this listing?",
  confirmRePublish: "Do you want to re-publish this listing?",
  wrongConfirmation: "ERROR: Wrong the confirmation code.",
  confirmDelete:
    "This post will be deleted permanently, Press x to confirm that you still want to delete this listing",
  remove: "Remove",
  hide: "Hide",
  edit: "Edit",
  delete: "Delete",
  ok: "Ok",
  publish: "Publish",
  submit: "Submit",
  cancel: "Cancel",
  confirmDeleteComment: "Are you want to delete this comment?",
  reportReview: "Report review",
  reviewFor: "Review For",
  reviewsFor: "Reviews For",
  addReview: "Add a review",
  deleteReview: "Delete Review",
  confirmDeleteReview: "Do you want to delete this review?",
  averageRating: "Average Rating",
  basicInfoEvent: "Basic Info",
  basicInfoEventDesc:
    "This info will also appear in Listing and any ads created for this event",
  eventVideo: "Event Video",
  addPhotoVideoPopupTitle: "Add Photos And Videos",
  location: "Location",
  aEventFrequency: [
    {
      name: "Occurs once",
      value: "occurs_once"
    },
    {
      name: "Daily",
      value: "daily"
    },
    {
      name: "Weekly",
      value: "weekly"
    }
  ],
  frequency: "Frequency",
  details: "Details",
  detailsDesc:
    "Let people know what type of event you&#039;re hosting and what to expect",
  oDaysOfWeek: [
    {
      value: "sunday",
      label: "Sun"
    },
    {
      value: "monday",
      label: "Mon"
    },
    {
      value: "tuesday",
      label: "Tue"
    },
    {
      value: "wednesday",
      label: "Wed"
    },
    {
      value: "thursday",
      label: "Thurs"
    },
    {
      value: "friday",
      label: "Fri"
    },
    {
      value: "saturday",
      label: "Sat"
    }
  ],
  claimListing: "Claim This Listing",
  noClaimFields:
    "There are no fields. Please go to Wiloke Listing Tools -&gt; Claim Listing to add some fields",
  pressToCopy: "Press Ctrl+C to copy this link",
  copyLink: "Copy Link",
  wantToDeleteDiscussion: "Are you sure want to delete this comment?",
  passwordNotMatched: "The confirm password must be matched the new password",
  reset: "Reset"
};

export default decodeObject(translations);
