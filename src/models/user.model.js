const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJson = require('@meanie/mongoose-to-json');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowecase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email!');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            'password should contain at least one: uppercase and lowercase letter, number, special charachter',
          );
        }
      },
      private: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({email:1});

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    next();
  }
});
userSchema.plugin(toJson);
// eslint-disable-next-line func-names
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  const result = await bcrypt.compare(password, user.password);
  return result;
};

// eslint-disable-next-line func-names
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });

  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
