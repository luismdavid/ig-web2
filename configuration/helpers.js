module.exports = {
  contains: function (arg1, arg2, options) {
    return arg1.includes(arg2) ? options.fn(this) : options.inverse(this);
  },
};
