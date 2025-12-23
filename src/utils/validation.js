import validator from "validator";

function validateSignUpData(req) {
  const { emailId } = req.body;

  if (!emailId) {
    throw new Error("Email  should not be empty");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }

  if (!validator.isMobilePhone(phone, "any")) {
    throw new Error("Invalid phone number");
  }
}

export default validateSignUpData;
