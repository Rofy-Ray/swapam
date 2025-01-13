(function () {
    'use strict'
    
    // Form validation
    const forms = document.querySelectorAll('.requires-validation')
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })

    // Enable/disable submit button based on checkbox
    const checkbox = document.getElementById('invalidCheck')
    const submitButton = document.getElementById('submit')

    checkbox.addEventListener('change', function() {
        submitButton.disabled = !this.checked
    })
})()