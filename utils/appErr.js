const appErr = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode || 500;
    return error;
};

module.exports = appErr;


/*The appErr function you provided is intended to create a custom error object with a message and 
status code, which can then be passed
 to Express's next function to trigger your global error handling middleware (globalErrHandler).

In an Express application, you pass the new error object created by appErr to the error-handling 
middleware by calling the next function with the error object as its argument. This next function is 
provided by Express and is used to pass control to the next middleware function in the stack. If next 
is called with an argument, Express will treat that argument as an error and skip all remaining
 non-error-handling middleware, 
passing the error directly to the error-handling middleware (like your globalErrHandler).

Creating Errors: The appErr function creates a custom error object.
Passing Errors: The error object is passed to next(error).
Handling Errors: Express skips normal middleware and routes, directing the error to your globalErrHandler.
Responding to Client: The globalErrHandler sends an appropriate JSON response based on the error details.
*/