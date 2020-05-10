import Button from "./components/atoms/Button";
import CheckBox from "./components/atoms/CheckBox";
import Loader from "./components/atoms/Loader";
import InputMaterial from "./components/atoms/InputMaterial";
import Input from "./components/atoms/Input";
import Switch from "./components/atoms/Switch";
import Overlay from "./components/atoms/Overlay";
import MoreBtn from "./components/atoms/MoreBtn";
import IconTextMedium from "./components/atoms/IconTextMedium";
import IconTextSmall from "./components/atoms/IconTextSmall";
import TopEmpty from "./components/atoms/TopEmpty";
import ImageCover from "./components/atoms/ImageCover";
import ListItemTouchable from "./components/atoms/ListItemTouchable";
import DoublePress from "./components/atoms/DoublePress";
import LongPress from "./components/atoms/LongPress";
import ProgressBar from "./components/atoms/ProgressBar";
import ImageCircleAndText from "./components/atoms/ImageCircleAndText";
import MessageError from "./components/atoms/MessageError";
export * from "./components/atoms/Typography";
export * from "./components/atoms/WithLoading";
import PermissionsLocation from "./components/atoms/PermissionsLocation";
import OfflineNotice from "./components/atoms/OfflineNotice";
import RequestTimeoutWrapped from "./components/atoms/RequestTimeoutWrapped";
export * from "./components/atoms/AlertMessage";
import Toast from "./components/atoms/Toast";
import MessageTyping from "./components/atoms/MessageTyping";
import Image3d from "./components/atoms/Image3d";
import InputHasButton from "./components/atoms/InputHasButton";
import ImageAutoSize from "./components/atoms/ImageAutoSize";
import { ImageCache } from "./components/atoms/ImageCache";
import Image2 from "./components/atoms/Image2";

import ModalPicker from "./components/molecules/ModalPicker";
import Video from "./components/molecules/Video";
import RangeSlider from "./components/molecules/RangeSlider";
import NewGallery from "./components/molecules/NewGallery";
import ContentBox from "./components/molecules/ContentBox";
import GalleryLightBox from "./components/molecules/GalleryLightBox";
export * from "./components/molecules/Grid";
import Modal from "./components/molecules/Modal";
import HeaderHasBack from "./components/molecules/HeaderHasBack";
import ActionSheet from "./components/molecules/ActionSheet";
import ParallaxScreen from "./components/molecules/ParallaxScreen";
import InputAccessoryLayoutFullScreen from "./components/molecules/InputAccessoryLayoutFullScreen";
import ContentLoader from "./components/molecules/ContentLoader";
import FontIcon from "./components/molecules/FontIcon";
import FlatListRedux from "./components/molecules/FlatListRedux";
import LoadingFull from "./components/molecules/LoadingFull";
import DatePicker from "./components/molecules/DatePicker";
import AccessoryView from "./components/molecules/AccessoryView";
import CameraRollHOC from "./components/molecules/CameraRollHOC";
import CameraRollSelect from "./components/molecules/CameraRollSelect";
import HtmlViewer from "./components/molecules/HtmlViewer";
import Admob, { adMobModal } from "./components/molecules/Admob";
import MyAdvertise from "./components/molecules/MyAdvertise";
import KeyboardAnimationRP from "./components/molecules/KeyboardAnimationRP";
import Masonry from "./components/molecules/Masonry";
import GalleryBox from "./components/molecules/GalleryBox";

export * from "./functions/reactNavigationFocusHoc";
export * from "./functions/wilokeFunc";
import Communications from "./functions/Communications";
import convertFontIcon from "./functions/convertFontIcon";
import SyncStorage from "./functions/syncStorage";
export * from "./functions/bottomBarHeight";
export { DeepLinkingSocial } from "./functions/DeepLinkingSocial";
export { getSocialColor } from "./functions/getSocialColor";
export { isCloseToBottom } from "./functions/isCloseToBottom";
import ScrollViewAnimated from "./components/atoms/ScrollViewAnimated";
import ImageUpload from "./components/atoms/ImageUpload";
import SocialField from "./components/molecules/SocialField";
export { mapObjectToFormData } from "./functions/mapObjectToFormData";
export * from "./functions/validation";
export { getTime } from "./functions/getTime";
export { emoij } from "./functions/emoij";
export { getEmoijFromString } from "./functions/getEmoijFromString";
export { mapDistance } from "./functions/mapDistance";
import { Rating, AirbnbStar } from "./components/atoms/StarRating";
import KeyboardSpacer from "./components/atoms/KeyboardSpacer/KeyboardSpacer";
import Validator from "./components/molecules/Validator";
import RadioButton from "./components/atoms/RadioButton/RadioButton";
import AnimatedRunning from "./components/atoms/ShoppingCartAnimate/ShoppingCartAnimate";
export { wp } from "./functions/carouselMeasure";
export * from "./functions/getTime";

export {
  // Atoms
  Button,
  CheckBox,
  Loader,
  InputMaterial,
  Input,
  MoreBtn,
  Switch,
  Overlay,
  IconTextMedium,
  IconTextSmall,
  TopEmpty,
  ImageCover,
  ListItemTouchable,
  DoublePress,
  LongPress,
  ProgressBar,
  ImageCircleAndText,
  MessageError,
  PermissionsLocation,
  OfflineNotice,
  RequestTimeoutWrapped,
  ImageUpload,
  Toast,
  MessageTyping,
  Image3d,
  InputHasButton,
  ImageAutoSize,
  ImageCache,
  Image2,
  // molecules
  ModalPicker,
  Video,
  RangeSlider,
  NewGallery,
  ContentBox,
  GalleryLightBox,
  Modal,
  HeaderHasBack,
  ActionSheet,
  ParallaxScreen,
  InputAccessoryLayoutFullScreen,
  ContentLoader,
  FontIcon,
  FlatListRedux,
  ScrollViewAnimated,
  SocialField,
  LoadingFull,
  DatePicker,
  AccessoryView,
  CameraRollHOC,
  CameraRollSelect,
  HtmlViewer,
  Admob,
  adMobModal,
  MyAdvertise,
  KeyboardAnimationRP,
  Masonry,
  // functions
  Communications,
  convertFontIcon,
  SyncStorage,
  GalleryBox,
  Rating,
  AirbnbStar,
  KeyboardSpacer,
  Validator,
  RadioButton,
  AnimatedRunning
};
