const validateData = {
  email: {
    presence: {
      message: "Bạn cần phải điền email"
    },
    special: {
      message: "Địa chỉ email không hợp lệ"
    },
    length: {
      minimum: 3,
      message: "Email phải trên 3 kí tự"
    }
  },
  phone: {
    presence: {
      message: "Phone number is required"
    },
    length: {
      minimum: 3,
      message: "Your username must be at least 3 characters"
    }
  },
  first_name: {
    presence: {
      message: "Please enter a firstname"
    }
  },
  last_name: {
    presence: {
      message: "Please enter your last name"
    }
  },
  address_1: {
    presence: {
      message: "Please enter your address"
    }
  },
  city: {
    presence: {
      message: "Please enter your city"
    }
  },
  state: {
    presence: {
      message: "Please enter your state"
    }
  },
  postcode: {
    presence: {
      message: "Please enter your postcode"
    }
  },
  country: {
    presence: {
      message: "Please enter your country"
    }
  }
};

export default validateData;
