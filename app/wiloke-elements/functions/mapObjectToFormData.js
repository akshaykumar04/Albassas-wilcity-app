export const mapObjectToFormData = (object, toString) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(
      key,
      toString === "toString" ? JSON.stringify(object[key]) : object[key]
    );
    return formData;
  }, new FormData());
