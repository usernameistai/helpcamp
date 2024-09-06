// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => { // can use function() { or () =>{
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.validated-form')

  bsCustomFileInput.init()

  // Loop over them and prevent submission
  Array.from(forms) // effectively makes a new array same as Array.prototype.slice.call(forms)
      .forEach(form => {
          form.addEventListener('submit', event => {
              if (!form.checkValidity()) {
                  event.preventDefault()
                  event.stopPropagation()
              }

              form.classList.add('was-validated')
          }, false)
      })
})() //LEAVE THE BRACKETS HERE FOR SOME REASON