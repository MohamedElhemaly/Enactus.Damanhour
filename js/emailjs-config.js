// REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
const EMAILJS_PUBLIC_KEY = 'EEpjjKdZVy086Bddw';
const EMAILJS_SERVICE_ID = 'service_jo0n8lv';
const EMAILJS_TEMPLATE_ID = 'template_wce8d8a';

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.warn("EmailJS library not loaded");
    }
})();

window.sendConfirmationEmail = async function(userEmail, userName, formTitle, customSubject, customBody) {
    if (typeof emailjs === 'undefined') return { success: false, error: 'EmailJS not loaded' };
    if (!userEmail) return { success: false, error: 'No email provided' };
    
    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: userEmail,
                to_name: userName || 'Applicant',
                form_title: formTitle || 'Enactus Damanhour Application',
                custom_subject: customSubject || 'Thank you for applying!',
                custom_body: customBody || 'We have received your application and will be in touch shortly.',
                reply_to: 'enactus@du.edu.eg'
            }
        );
        console.log('Email sent successfully!', response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error('FAILED to send email:', error);
        return { success: false, error };
    }
};
