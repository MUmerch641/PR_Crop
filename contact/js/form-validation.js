document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact__form');
    const alertDiv = document.getElementById('contact__form__alert');
    const submitBtn = document.getElementById('contact__form__submit');
    
    // Enable the submit button which is disabled by default in the HTML
    if (submitBtn) submitBtn.disabled = false;
    
    if (!form || !alertDiv || !submitBtn) return;

    // Function to display messages
    function showMessage(message, type) {
        alertDiv.innerHTML = message;
        alertDiv.style.display = 'block';
        alertDiv.style.color = type === 'error' ? '#d32f2f' : '#388e3c';
        alertDiv.style.padding = '10px';
        alertDiv.style.marginBottom = '15px';
        alertDiv.style.border = `1px solid ${type === 'error' ? '#d32f2f' : '#388e3c'}`;
        alertDiv.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
        
        // Scroll to the alert message
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Function to validate the form
    function validateForm() {
        let errors = [];
        
        // Check subject radio buttons
        const subject = form.querySelector('input[name="subject"]:checked');
        if (!subject) {
            errors.push('Please select a purpose for your contact (Project, Vendor, or Job)');
        }
        
        // If job is selected, validate job-specific fields
        if (subject && subject.value === 'job') {
            const jobSelect = form.querySelector('#contact__form__jobs__select');
            if (jobSelect && jobSelect.value === 'Careers') {
                errors.push('Please select a job position');
            }
            
            // Check last name and first name
            const lastName = document.getElementById('contact__form__name__last');
            const firstName = document.getElementById('contact__form__name__first');
            
            if (lastName && !lastName.value.trim()) {
                errors.push('Last name is required for job applications');
            }
            if (firstName && !firstName.value.trim()) {
                errors.push('First name is required for job applications');
            }
            
            // Check salary
            const salarySelect = document.getElementById('contact__form__salary__select');
            if (salarySelect && salarySelect.value === "Please select a salary") {
                errors.push('Please select a desired salary range');
            }
            
            // Check education
            const eduContainer = document.getElementById('contact__form__edu__container');
            if (eduContainer) {
                const eduItems = eduContainer.querySelectorAll('.contact__form__edu__item');
                eduItems.forEach((item, index) => {
                    const schoolInput = item.querySelector('input[name="school_name[]"]');
                    const fieldInput = item.querySelector('input[name="study_field[]"]');
                    const startDate = item.querySelector('input[name="studies_start[]"]');
                    const endDate = item.querySelector('input[name="studies_end[]"]');
                    const graduated = item.querySelector(`input[name="graduate[${index}]"]:checked`);
                    
                    if (schoolInput && !schoolInput.value.trim()) {
                        errors.push(`Education ${index + 1}: School name is required`);
                    }
                    if (fieldInput && !fieldInput.value.trim()) {
                        errors.push(`Education ${index + 1}: Field of study is required`);
                    }
                    if (startDate && !startDate.value) {
                        errors.push(`Education ${index + 1}: Start date is required`);
                    }
                    if (endDate && !endDate.value) {
                        errors.push(`Education ${index + 1}: End date is required`);
                    }
                    if (!graduated) {
                        errors.push(`Education ${index + 1}: Please indicate if you graduated`);
                    }
                });
            }
        } else {
            // For non-job submissions, check the personal name
            const namePersonal = document.getElementById('contact__form__name__personal');
            if (namePersonal && !namePersonal.value.trim()) {
                errors.push('Name is required');
            }
        }
        
        // Check email and phone (required for all submission types)
        const emailInput = document.getElementById('contact__form__info__email');
        const phoneInput = document.getElementById('contact__form__info__phone');
        
        if (emailInput && !emailInput.value.trim()) {
            errors.push('Email address is required');
        } else if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            errors.push('Please enter a valid email address');
        }
        
        if (phoneInput && !phoneInput.value.trim()) {
            errors.push('Phone number is required');
        }
        
        // Check file format if a file is selected
        const fileInput = document.getElementById('contact__form__file__input');
        if (fileInput && fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name.toLowerCase();
            const validExtensions = ['.doc', '.docx', '.pdf'];
            const isValid = validExtensions.some(ext => fileName.endsWith(ext));
            
            if (!isValid) {
                errors.push('Please upload only .doc, .docx, or .pdf files');
            }
        }
        
        return errors;
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        if (errors && errors.length > 0) {
            showMessage('<strong>Please correct the following errors:</strong><br>' + errors.join('<br>'), 'error');
            return;
        }
        
        // Disable submit button while processing
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.querySelector('#contact__form__submit__label').textContent;
        submitBtn.querySelector('#contact__form__submit__label').textContent = 'Sending...';
        
        // Using XMLHttpRequest instead of fetch for better compatibility
        const xhr = new XMLHttpRequest();
        const formAction = form.getAttribute('action');
        const formData = new FormData(form);
        
        // Setup timeout to prevent infinite loading
        const timeout = setTimeout(function() {
            if (xhr.readyState < 4) {
                xhr.abort();
                submitBtn.disabled = false;
                submitBtn.querySelector('#contact__form__submit__label').textContent = originalBtnText;
                showMessage('Request timed out. Please try again later.', 'error');
            }
        }, 30000); // 30 seconds timeout
        
        xhr.open('POST', formAction);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            
            // Clear the timeout
            clearTimeout(timeout);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.querySelector('#contact__form__submit__label').textContent = originalBtnText;
            
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success
                console.log('Form submitted successfully');
                showMessage('Thank you! Your message has been sent successfully. We will contact you shortly.', 'success');
                form.reset();
                updateFormVisibility();
            } else {
                // Error
                console.error('Form submission failed:', xhr.status, xhr.statusText);
                let errorMsg = 'Form submission failed: ';
                
                try {
                    // Try to parse the response as JSON
                    const response = JSON.parse(xhr.responseText);
                    errorMsg += response.error || xhr.statusText;
                } catch(e) {
                    // If parsing failed, use status text
                    errorMsg += xhr.statusText || "Unknown error occurred";
                }
                
                showMessage('Error: ' + errorMsg + '. Please try again or contact us directly.', 'error');
            }
        };
        
        xhr.onerror = function() {
            // Clear the timeout
            clearTimeout(timeout);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.querySelector('#contact__form__submit__label').textContent = originalBtnText;
            
            console.error('Network error occurred');
            showMessage('Network error occurred. Please check your internet connection and try again.', 'error');
        };
        
        // Send the form data
        try {
            xhr.send(formData);
        } catch (err) {
            // Clear the timeout
            clearTimeout(timeout);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.querySelector('#contact__form__submit__label').textContent = originalBtnText;
            
            console.error('Error sending form:', err);
            showMessage('Error sending form: ' + err.message, 'error');
        }
    });
    
    // Initialize form visibility based on selected subject
    function updateFormVisibility() {
        const selectedSubject = form.querySelector('input[name="subject"]:checked')?.value;
        
        // Job-related fields
        const jobFields = document.getElementById('contact__form__jobs');
        const salaryField = document.getElementById('contact__form__salary');
        const eduField = document.getElementById('contact__form__edu');
        const orgField = document.getElementById('contact__form__org');
        const personalName = document.getElementById('contact__form__name__personal');
        const companyName = document.getElementById('contact__form__name__company');
        const lastName = document.getElementById('contact__form__name__last');
        const firstName = document.getElementById('contact__form__name__first');
        
        // Vendor document section
        const vendorDoc = document.getElementById('contact__form__vendor-doc');
        
        if (selectedSubject === 'job') {
            // Show job-related fields
            if (jobFields) jobFields.style.display = 'block';
            if (salaryField) salaryField.style.display = 'block';
            if (eduField) eduField.style.display = 'block';
            if (orgField) orgField.style.display = 'block';
            
            // Show first/last name instead of personal/company name
            if (personalName) personalName.style.display = 'none';
            if (companyName) companyName.style.display = 'none';
            if (lastName) lastName.style.display = 'block';
            if (firstName) firstName.style.display = 'block';
            
            // Hide vendor doc
            if (vendorDoc) vendorDoc.style.display = 'none';
        } else if (selectedSubject === 'vendor') {
            // Show vendor doc
            if (vendorDoc) vendorDoc.style.display = 'block';
            
            // Show personal/company name
            if (personalName) personalName.style.display = 'block';
            if (companyName) companyName.style.display = 'block';
            if (lastName) lastName.style.display = 'none';
            if (firstName) firstName.style.display = 'none';
            
            // Hide job-related fields
            if (jobFields) jobFields.style.display = 'none';
            if (salaryField) salaryField.style.display = 'none';
            if (eduField) eduField.style.display = 'none';
            if (orgField) orgField.style.display = 'none';
        } else if (selectedSubject === 'project') {
            // Show personal/company name
            if (personalName) personalName.style.display = 'block';
            if (companyName) companyName.style.display = 'block';
            if (lastName) lastName.style.display = 'none';
            if (firstName) firstName.style.display = 'none';
            
            // Hide job-related fields and vendor doc
            if (jobFields) jobFields.style.display = 'none';
            if (salaryField) salaryField.style.display = 'none';
            if (eduField) jobFields.style.display = 'none';
            if (orgField) orgField.style.display = 'none';
            if (vendorDoc) vendorDoc.style.display = 'none';
        }
    }
    
    // Listen for changes to the subject radio buttons
    const subjectRadios = form.querySelectorAll('input[name="subject"]');
    subjectRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormVisibility();
        });
    });
    
    // Handle education item addition
    const addEduBtn = document.getElementById('contact__form__edu__add');
    if (addEduBtn) {
        addEduBtn.addEventListener('click', function() {
            const eduContainer = document.getElementById('contact__form__edu__container');
            if (!eduContainer) return;
            
            // Clone the first education item
            const firstEduItem = eduContainer.querySelector('.contact__form__edu__item');
            if (!firstEduItem) return;
            
            const newItem = firstEduItem.cloneNode(true);
            
            // Clear all inputs in the new item
            newItem.querySelectorAll('input').forEach(input => {
                if (input.type === 'text' || input.type === 'date') {
                    input.value = '';
                } else if (input.type === 'radio') {
                    input.checked = false;
                }
            });
            
            // Update radio button names
            const newIndex = eduContainer.querySelectorAll('.contact__form__edu__item').length;
            newItem.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.name = `graduate[${newIndex}]`;
            });
            
            // Add remove button functionality
            const removeBtn = newItem.querySelector('.contact__form__edu__remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    newItem.remove();
                    // Update indices of remaining items
                    const items = eduContainer.querySelectorAll('.contact__form__edu__item');
                    items.forEach((item, idx) => {
                        item.querySelectorAll('input[type="radio"]').forEach(radio => {
                            radio.name = `graduate[${idx}]`;
                        });
                    });
                });
            }
            
            eduContainer.appendChild(newItem);
        });
    }
    
    // Add remove functionality to existing remove buttons
    document.querySelectorAll('.contact__form__edu__remove').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.contact__form__edu__item');
            const container = document.getElementById('contact__form__edu__container');
            
            // Don't remove if it's the last item
            if (container.querySelectorAll('.contact__form__edu__item').length > 1) {
                item.remove();
                
                // Update indices of remaining items
                const items = container.querySelectorAll('.contact__form__edu__item');
                items.forEach((item, idx) => {
                    item.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.name = `graduate[${idx}]`;
                    });
                });
            }
        });
    });
    
    // Initialize the form visibility
    updateFormVisibility();
});
