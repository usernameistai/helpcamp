module.exports = func => { // this function 
  return (req, res, next) => { // returns a function
    func(req, res, next).catch(next); // executes that function
  }// catches and passes any errors to next
}