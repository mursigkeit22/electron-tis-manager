window.addEventListener("error", function (e) {
  var alertList = document.querySelectorAll('.alert')
  var alerts =  [].slice.call(alertList).map(function (element) {
    return new bootstrap.Alert(element)
  })
  // alert("Error occurred: " + e.error.message);
  return false;
})