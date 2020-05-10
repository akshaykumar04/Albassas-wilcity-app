export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize
}) => {
  const paddingToBottom = 200;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
