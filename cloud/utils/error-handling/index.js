module.exports = {
  handleError(error, response) {
    console.error(error, error.code, error.message);
    // response.error(error);
    throw new Error(error.message ? `${error.code || ''} ${error.message}` : `${error.code || ''} ${error}`);
  },
  constructErrorObject(errorCode, errorObject = {}) {
    console.error(errorObject)
    let errorMessage = '';
    switch (errorCode) {
      case Parse.Error.OBJECT_NOT_FOUND:
      case 404:
        errorMessage = "Not found.";
        break;
      case 400:
        // letCustomErrorMessage ? errorMessage = letCustomErrorMessage : errorMessage = "Bad request.";
        errorMessage = "Bad request.";
        break;
        break;
      case 401:
        // letCustomErrorMessage ? errorMessage = letCustomErrorMessage : errorMessage = "Not authorized to make this request. Please signup first.";
        errorMessage = "Not authorized to make this request. Please signup first.";
        break;
      case 500:
        // letCustomErrorMessage ? errorMessage = letCustomErrorMessage : errorMessage = "Server error occured. Please try again.";
        errorMessage = "Server error occured. Please try again.";
        break;
      default:
        // letCustomErrorMessage ? errorMessage = letCustomErrorMessage : errorMessage = "Please try again.";
        errorMessage = "Please try again.";
    }
    return {
      code: errorCode,
      message: errorMessage,
    };
  }
};
