function create(type, ...params) {
  switch (type) {
    case 'bad-request':
      return {
        status: 400,
        message: `One of the params from: ${params.join(', ')} is missing.`
      };

    case 'services-not-found':
      return {
        status: 404,
        message: `Service(s): ${params.join(', ')} is not found.`
      };

    case 'trailing-slash-not-found':
      return {
        status: 400,
        message: `Service(s): ${params.join(', ')} is found but to access the path should end with /.`
      };

    case 'port-in-use':
      return {
        status: 500,
        message: `Service(s): ${params.join(', ')} can not be registered, as some other service is registered in same port.`
      };
  }
}

module.exports = {
  create,
};