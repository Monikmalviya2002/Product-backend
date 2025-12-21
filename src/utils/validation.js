import validator from "validator";

function validateSignUpData(req) {
  const { emailId, phone } = req.body;

  if (!emailId || !phone) {
    throw new Error("Email or phone number should not be empty");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }

  if (!validator.isMobilePhone(phone, "any")) {
    throw new Error("Invalid phone number");
  }
}

export default validateSignUpData;
