export const validEmail = email => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.length > 0 && regex.test(String(email).toLowerCase());
};

export const validPhone = phone => {
  const regex = /^(\+|)\d*$/;
  return phone.length > 0 && regex.test(String(phone));
};

export const validUrl = url => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return url.length > 0 && regex.test(String(url));
};

export const validPassword = password => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return password.length > 0 && regex.test(String(password));
};
