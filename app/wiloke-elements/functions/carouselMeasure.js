import { screenWidth, screenHeight } from "../../constants/styleConstants";
export function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
