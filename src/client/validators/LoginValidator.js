module.exports = () => {
  const validators = [
    // username length
    {
      message: 'Username must be at least four characters long.',
      validate: params => params.user.length >= 4,
    },
    {
      message: 'password must be at least six characters long.',
      validate: params => params.pass.length >= 6,
    },
    {
      message: 'password must contain at least one number.',
      validate: params => /[0-9]/.test(params.pass),
    },
    {
      message: 'password must contain at least lower case letter.',
      validate: params => /[a-z]/.test(params.pass),
    },
    {
      message: 'password must contain at least upper case letter.',
      validate: params => /[A-Z]/.test(params.pass),
    },
    {
      message: 'password must not contain spaces or tabs.',
      validate: params => !/[\s\t]/.test(params.pass),
    },
  ];
  return (params) => {
    const failed = validators.find(test => !test.validate(params));
    return failed ? failed.message : null;
  };
};

