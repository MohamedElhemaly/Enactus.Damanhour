document.addEventListener('DOMContentLoaded', async () => {
    const loadingState = document.getElementById('loading-state');
    const formContent = document.getElementById('form-content');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');
    const dynamicForm = document.getElementById('dynamic-form');
    const fieldsContainer = document.getElementById('fields-container');
    
    // Get form ID from URL query param, or load the first active form
    const urlParams = new URLSearchParams(window.location.search);
    let formId = urlParams.get('id');
    
    let activeForm = null;
    let formFields = [];
    
    try {
        if (!window.supabaseClient) {
            throw new Error("Supabase is not initialized. Please ensure your project URL and Anon Key are set in js/supabase-config.js.");
        }
        
        // Fetch Form
        if (formId) {
            const { data, error } = await window.supabaseClient.from('forms').select('*').eq('id', formId).single();
            if (error) throw error;
            activeForm = data;
        } else {
            const { data, error } = await window.supabaseClient.from('forms').select('*').eq('is_active', true).limit(1).single();
            if (error) throw error;
            activeForm = data;
        }
        
        if (!activeForm || !activeForm.is_active) {
            throw new Error("This form is not currently active.");
        }
        
        document.getElementById('form-title').textContent = activeForm.title;
        document.getElementById('form-description').textContent = activeForm.description || '';
        
        // Fetch Fields
        const { data: fields, error: fieldsError } = await window.supabaseClient
            .from('form_fields')
            .select('*')
            .eq('form_id', activeForm.id)
            .order('sort_order', { ascending: true });
            
        if (fieldsError) throw fieldsError;
        formFields = fields || [];
        
        // Render Fields
        if (formFields.length === 0) {
            fieldsContainer.innerHTML = '<p>No fields defined for this form.</p>';
        } else {
            fieldsContainer.innerHTML = formFields.map(field => renderField(field)).join('');
        }
        
        // Show form
        loadingState.style.display = 'none';
        formContent.style.display = 'block';
        
    } catch (error) {
        loadingState.style.display = 'none';
        formError.textContent = error.message || "Failed to load form. Please try again later.";
        formError.style.display = 'block';
        console.error(error);
    }
    
    // Form Submit Handler
    if (dynamicForm) {
        dynamicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            formError.style.display = 'none';
            
            try {
                const formData = new FormData(dynamicForm);
                const dataObj = Object.fromEntries(formData);
                
                // Handle checkboxes (multiple values)
                const checkboxFields = formFields.filter(f => f.type === 'checkbox');
                checkboxFields.forEach(cf => {
                    dataObj[cf.label] = formData.getAll(cf.label);
                });
                
                // Find email field for EmailJS
                let userEmail = '';
                let userName = '';
                const emailField = formFields.find(f => f.type === 'email');
                if (emailField) userEmail = dataObj[emailField.label];
                
                // Look for a field that might be a name
                const nameField = formFields.find(f => f.label.toLowerCase().includes('name'));
                if (nameField) userName = dataObj[nameField.label];
                
                // Insert into Supabase
                const { error: insertError } = await window.supabaseClient
                    .from('form_submissions')
                    .insert([{
                        form_id: activeForm.id,
                        data: dataObj,
                        email: userEmail
                    }]);
                    
                if (insertError) throw insertError;
                
                // Send EmailJS
                if (activeForm.send_email) {
                    if (!userEmail) {
                        alert("Warning: Could not find an Answer Type of 'Email' in this form. The confirmation email cannot be sent.");
                    } else if (window.sendConfirmationEmail) {
                        const emailResult = await window.sendConfirmationEmail(userEmail, userName, activeForm.title, activeForm.email_subject, activeForm.email_body);
                        if (!emailResult.success) {
                            alert("Warning: Failed to send confirmation email. " + (emailResult.error?.text || emailResult.error?.message || emailResult.error || "Unknown Error"));
                        }
                    } else {
                        alert("Warning: EmailJS configuration is missing.");
                    }
                }
                
                // Show Success
                dynamicForm.style.display = 'none';
                formSuccess.textContent = activeForm.success_message || 'Form submitted successfully!';
                formSuccess.style.display = 'block';
                
            } catch (error) {
                formError.textContent = error.message || "Failed to submit form.";
                formError.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
                console.error(error);
            }
        });
    }
});

function renderField(field) {
    const requiredStr = field.is_required ? 'required' : '';
    const asterisk = field.is_required ? '<span style="color:red">*</span>' : '';
    const nameAttr = `name="${field.label}"`;
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    
    let inputHtml = '';
    
    switch (field.type) {
        case 'textarea':
            inputHtml = `<textarea ${nameAttr} ${placeholder} ${requiredStr} rows="4"></textarea>`;
            break;
        case 'select':
            const optionsHtml = Array.isArray(field.options) ? field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('') : '';
            inputHtml = `<select ${nameAttr} ${requiredStr}>
                <option value="" disabled selected>${field.placeholder || 'Select an option'}</option>
                ${optionsHtml}
            </select>`;
            break;
        case 'radio':
            inputHtml = `<div class="radio-group">
                ${Array.isArray(field.options) ? field.options.map(opt => `
                    <label><input type="radio" ${nameAttr} value="${opt}" ${requiredStr}> ${opt}</label>
                `).join('') : ''}
            </div>`;
            break;
        case 'checkbox':
            inputHtml = `<div class="checkbox-group">
                ${Array.isArray(field.options) ? field.options.map(opt => `
                    <label><input type="checkbox" ${nameAttr} value="${opt}"> ${opt}</label>
                `).join('') : ''}
            </div>`;
            break;
        default: // text, email, tel, date, number
            inputHtml = `<input type="${field.type}" ${nameAttr} ${placeholder} ${requiredStr}>`;
    }
    
    return `
        <div class="form-group">
            <label>${field.label} ${asterisk}</label>
            ${inputHtml}
        </div>
    `;
}
