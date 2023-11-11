export const validateEmail = (email) => {
  if (email.includes("@") && email.includes(".")) {
    return true;
  } else {
    return false;
  }
};

