(function () {
    'use strict'
    
    const forms = document.querySelectorAll('.requires-validation')
    const checkbox = document.getElementById('invalidCheck')
    const submitButton = document.getElementById('submit')

    const alertContainer = document.createElement('div')
    alertContainer.className = 'alert-container position-fixed top-0 start-50 translate-middle-x p-3'
    alertContainer.style.zIndex = '1050'
    document.body.appendChild(alertContainer)

    checkbox.addEventListener('change', function() {
        submitButton.disabled = !this.checked
    })

    function showAlert(message, type) {
        const alert = document.createElement('div')
        alert.className = `alert alert-${type} alert-dismissible fade show`
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `
        alertContainer.appendChild(alert)
        
        setTimeout(() => {
            alert.classList.remove('show')
            setTimeout(() => alert.remove(), 150)
        }, 5000)
    }

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            
            if (!form.checkValidity()) {
                event.stopPropagation()
                form.classList.add('was-validated')
                return
            }

            submitButton.disabled = true
            const formData = new FormData(form)
            
            const xhr = new XMLHttpRequest()
            xhr.open('POST', form.action, true)
            xhr.setRequestHeader('Accept', 'application/json')
            
            xhr.onload = function() {
                try {
                    const response = JSON.parse(xhr.response)
                    
                    if (xhr.status === 200 && response.success === true) {
                        showAlert('Your swap request has been submitted successfully! We will contact you shortly.', 'success')
                        form.reset()
                        form.classList.remove('was-validated')
                        checkbox.checked = false
                        submitButton.disabled = true
                    } else {
                        const errorMsg = response.error_msg || response.error || 'An error occurred while submitting the form.'
                        showAlert(errorMsg, 'danger')
                        submitButton.disabled = false
                    }
                } catch (e) {
                    showAlert('An unexpected error occurred. Please try again later.', 'danger')
                    submitButton.disabled = false
                }
            }
            
            xhr.onerror = function() {
                showAlert('Network error occurred. Please check your internet connection and try again.', 'danger')
                submitButton.disabled = false
            }
            
            xhr.send(formData)
        }, false)
    })
})()