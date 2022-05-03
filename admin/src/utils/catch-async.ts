// THIS MODULE REPLACES THE try / catch BLOCK IN AN REQ/RES ASYNC FUNCTION
function catchAsyncError(fn, fnDescr=null) {

   return function (request, response, next) {

      fn(request, response, next).catch(err => {
         err.statusCode = 400;
         err.caller = fnDescr || `undef. caller`;
         next(err);
      });

      // fn(request, response, next).catch(next) // SAME AS ABOVE
   };
};

module.exports = catchAsyncError;