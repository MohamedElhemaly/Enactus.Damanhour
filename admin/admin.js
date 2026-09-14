document.addEventListener('DOMContentLoaded', () => {
    // Session handling
    checkSession();
    
    // Auth
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            document.querySelectorAll('.view-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            
            // Reload specific section data
            if (targetId === 'manage-submissions') loadSubmissions();
            if (targetId === 'manage-forms') loadForms();
        });
    });
    // Create Form Button
    const createFormBtn = document.getElementById('create-form-btn');
    if (createFormBtn) {
        createFormBtn.addEventListener('click', () => {
            const form = document.getElementById('form-settings-form');
            form.reset();
            delete form.dataset.editId;
            document.getElementById('setting-form-active').checked = true;
            document.getElementById('setting-send-email').checked = true;
            openModal('form-settings-modal');
        });
    }

    // Form Settings Submit
    const formSettingsForm = document.getElementById('form-settings-form');
    if (formSettingsForm) {
        formSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = formSettingsForm.dataset.editId;
            const payload = {
                title: document.getElementById('setting-form-title').value,
                description: document.getElementById('setting-form-desc').value,
                is_active: document.getElementById('setting-form-active').checked,
                send_email: document.getElementById('setting-send-email').checked,
                email_subject: document.getElementById('setting-email-subject').value,
                email_body: document.getElementById('setting-email-body').value,
                success_message: document.getElementById('setting-success-msg').value
            };
            try {
                let res;
                if (editId) res = await window.supabaseClient.from('forms').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('forms').insert([payload]);
                if (res.error) throw res.error;
                closeModal('form-settings-modal');
                loadForms();
            } catch (error) {
                alert("Error saving form settings: " + error.message);
            }
        });
    }
});

async function checkSession() {
    if (!window.supabaseClient) return;
    const { data: { session }, error } = await window.supabaseClient.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        errorEl.style.display = 'none';
        
        if (!window.supabaseClient) {
            throw new Error("Cannot connect to database. Please turn off your Ad Blocker or check your internet connection.");
        }
        
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        showDashboard();
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await window.supabaseClient.auth.signOut();
        showLogin();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

function showDashboard() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
    loadDashboardStats();
}

function showLogin() {
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
}

async function loadDashboardStats() {
    try {
        const { count: formsCount, error: formsError } = await window.supabaseClient
            .from('forms')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);
            
        if (!formsError && formsCount !== null) {
            document.getElementById('stat-forms').textContent = formsCount;
        }
        
        const { count: subsCount, error: subsError } = await window.supabaseClient
            .from('form_submissions')
            .select('*', { count: 'exact', head: true });
            
        if (!subsError && subsCount !== null) {
            document.getElementById('stat-submissions').textContent = subsCount;
        }
    } catch (error) {
        console.error('Error loading stats', error);
    }
}

async function loadSubmissions() {
    try {
        const tbody = document.getElementById('submissions-tbody');
        tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        
        const { data, error } = await window.supabaseClient
            .from('form_submissions')
            .select('*, forms(title)')
            .order('submitted_at', { ascending: false });
            
        if (error) throw error;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No submissions found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(sub => {
            const date = new Date(sub.submitted_at).toLocaleDateString();
            const dataStr = Object.entries(sub.data || {}).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join('<br>');
            return `
                <tr>
                    <td>${date}<br><small>${sub.forms?.title || 'Unknown Form'}</small></td>
                    <td>${sub.email || 'N/A'}</td>
                    <td>${dataStr}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubmission('${sub.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading submissions', error);
        document.getElementById('submissions-tbody').innerHTML = '<tr><td colspan="3">Error loading data.</td></tr>';
    }
}

window.deleteSubmission = async function(id) {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
        const { error } = await window.supabaseClient.from('form_submissions').delete().eq('id', id);
        if (error) throw error;
        loadSubmissions();
        loadDashboardStats();
    } catch (e) {
        alert('Error deleting submission: ' + e.message);
    }
}

async function loadForms() {
    try {
        const list = document.getElementById('forms-list');
        list.innerHTML = '<p>Loading forms...</p>';
        
        const { data, error } = await window.supabaseClient
            .from('forms')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (data.length === 0) {
            list.innerHTML = '<p>No forms found.</p>';
            return;
        }
        
        list.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(f => `
                        <tr>
                            <td>${f.title}</td>
                            <td>${f.is_active ? '<span class="text-success">Active</span>' : 'Inactive'}</td>
                            <td>
                                <div class="actions-cell">
                                    <a href="../form.html?id=${f.id}" target="_blank" class="btn btn-outline btn-sm">View</a>
                                    <button class="btn btn-outline btn-sm" onclick="editFormSettings('${f.id}')"><i class="fas fa-cog"></i> Settings</button>
                                    <button class="btn btn-primary btn-sm" onclick="openFieldsModal('${f.id}', '${f.title}')">Questions</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteForm('${f.id}')"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading forms', error);
        document.getElementById('forms-list').innerHTML = '<p>Error loading forms.</p>';
    }
}

// --- Form Builder UI Logic ---

window.editFormSettings = async function(id) {
    const { data, error } = await window.supabaseClient.from('forms').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('setting-form-title').value = data.title || '';
        document.getElementById('setting-form-desc').value = data.description || '';
        document.getElementById('setting-form-active').checked = !!data.is_active;
        document.getElementById('setting-send-email').checked = !!data.send_email;
        document.getElementById('setting-email-subject').value = data.email_subject || '';
        document.getElementById('setting-email-body').value = data.email_body || '';
        document.getElementById('setting-success-msg').value = data.success_message || '';
        
        const form = document.getElementById('form-settings-form');
        form.dataset.editId = id;
        openModal('form-settings-modal');
    }
}

window.deleteForm = async function(id) {
    if (!confirm('Are you sure you want to delete this form? This will also delete all submissions and questions for this form.')) return;
    try {
        const { error } = await window.supabaseClient.from('forms').delete().eq('id', id);
        if (error) throw error;
        loadForms();
    } catch (e) {
        alert('Error deleting form: ' + e.message);
    }
}

const fieldsModal = document.getElementById('fields-modal');
const closeFieldsModalBtn = document.querySelector('.close-modal');
const addFieldForm = document.getElementById('add-field-form');
const fieldTypeSelect = document.getElementById('field-type');
const fieldOptionsGroup = document.getElementById('field-options-group');

if (closeFieldsModalBtn) {
    closeFieldsModalBtn.addEventListener('click', () => {
        fieldsModal.classList.remove('active');
    });
}

if (fieldTypeSelect) {
    fieldTypeSelect.addEventListener('change', (e) => {
        const type = e.target.value;
        if (['select', 'radio', 'checkbox'].includes(type)) {
            fieldOptionsGroup.style.display = 'block';
        } else {
            fieldOptionsGroup.style.display = 'none';
        }
    });
}

window.openFieldsModal = async function(formId, formTitle) {
    document.getElementById('fields-modal-title').textContent = `Questions for: ${formTitle}`;
    document.getElementById('field-form-id').value = formId;
    fieldsModal.classList.add('active');
    await loadFormFields(formId);
}

async function loadFormFields(formId) {
    const list = document.getElementById('existing-fields-list');
    list.innerHTML = '<p>Loading questions...</p>';
    
    try {
        const { data, error } = await window.supabaseClient.from('form_fields').select('*').eq('form_id', formId).order('sort_order', { ascending: true });
        if (error) throw error;
        
        if (data.length === 0) {
            list.innerHTML = '<p>No questions added yet.</p>';
            return;
        }
        
        list.innerHTML = data.map(f => `
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border);">
                <div>
                    <strong>${f.label}</strong> <span style="color:var(--gray); font-size:0.85em;">(${f.type}) ${f.is_required ? '*Required' : ''}</span>
                    ${f.options ? `<br><small>Options: ${f.options.join(', ')}</small>` : ''}
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteField('${f.id}', '${formId}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<p>Error loading questions.</p>';
    }
}

window.deleteField = async function(fieldId, formId) {
    if (!confirm('Delete this question?')) return;
    try {
        const { error } = await window.supabaseClient.from('form_fields').delete().eq('id', fieldId);
        if (error) throw error;
        await loadFormFields(formId);
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

if (addFieldForm) {
    addFieldForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formId = document.getElementById('field-form-id').value;
        const label = document.getElementById('field-label').value;
        const type = document.getElementById('field-type').value;
        const isRequired = document.getElementById('field-required').checked;
        let options = null;
        
        if (['select', 'radio', 'checkbox'].includes(type)) {
            const optVal = document.getElementById('field-options').value;
            if (optVal) {
                options = optVal.split(',').map(s => s.trim()).filter(s => s);
            }
        }
        
        try {
            const { error } = await window.supabaseClient.from('form_fields').insert([{
                form_id: formId,
                label: label,
                type: type,
                is_required: isRequired,
                options: options
            }]);
            if (error) throw error;
            
            // Reset form
            addFieldForm.reset();
            fieldOptionsGroup.style.display = 'none';
            await loadFormFields(formId);
        } catch (e) {
            alert('Error adding question: ' + e.message);
        }
    });
}

// --- CMS Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // CMS Tabs
    const tabBtns = document.querySelectorAll('#manage-content .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('#manage-content .tab-content').forEach(c => c.classList.remove('active'));
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
            
            if (target === 'content-hero') loadHeroCMS();
            if (target === 'content-projects') loadProjectsCMS();
            if (target === 'content-team') loadTeamCMS();
            if (target === 'content-events') loadEventsCMS();
            if (target === 'content-partners') loadPartnersCMS();
            if (target === 'content-news') loadNewsCMS();
        });
    });
    
    // Auto-load first tab if in content view
    document.querySelectorAll('.nav-item[data-target="manage-content"]').forEach(n => {
        n.addEventListener('click', () => {
            loadHeroCMS();
        });
    });

    // Hero Form Submit
    const heroForm = document.getElementById('hero-form');
    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('hero-title').value;
            const subtitle = document.getElementById('hero-subtitle').value;
            try {
                const { error } = await window.supabaseClient.from('hero_content').update({ title, subtitle }).neq('id', '00000000-0000-0000-0000-000000000000');
                if (error) throw error;
                alert('Hero Content Saved!');
            } catch (error) { alert('Error: ' + error.message); }
        });
    }
    
    // CMS Add Buttons (Open Modals)
    const btnAddProject = document.getElementById('btn-add-project');
    if (btnAddProject) btnAddProject.addEventListener('click', () => openModal('project-modal'));
    
    const btnAddTeam = document.getElementById('btn-add-team');
    if (btnAddTeam) btnAddTeam.addEventListener('click', () => openModal('team-modal'));

    const btnAddEvent = document.getElementById('btn-add-event');
    if (btnAddEvent) btnAddEvent.addEventListener('click', () => openModal('event-modal'));

    const btnAddPartner = document.getElementById('btn-add-partner');
    if (btnAddPartner) btnAddPartner.addEventListener('click', () => openModal('partner-modal'));

    const btnAddNews = document.getElementById('btn-add-news');
    if (btnAddNews) btnAddNews.addEventListener('click', () => openModal('news-modal'));

    // Modal Form Submissions
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = projectForm.querySelector('button[type="submit"]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const editId = projectForm.dataset.editId;
                let imageUrl = document.getElementById('project-image-old').value;
                const newImage = await uploadImage('project-image');
                if (newImage) imageUrl = newImage;
                
                const payload = {
                    name: document.getElementById('project-name').value,
                    description: document.getElementById('project-desc').value,
                    image_url: imageUrl,
                    is_visible: true
                };
                let res;
                if (editId) res = await window.supabaseClient.from('projects').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('projects').insert([payload]);
                if (res.error) throw res.error;
                closeModal('project-modal');
                loadProjectsCMS();
            } catch (e) { alert(e.message); }
            finally { btn.disabled = false; btn.textContent = 'Save Project'; }
        });
    }

    const teamForm = document.getElementById('team-form');
    if (teamForm) {
        teamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = teamForm.querySelector('button[type="submit"]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const editId = teamForm.dataset.editId;
                let imageUrl = document.getElementById('team-image-old').value;
                const newImage = await uploadImage('team-image');
                if (newImage) imageUrl = newImage;

                const payload = {
                    name: document.getElementById('team-name').value,
                    role: document.getElementById('team-role').value,
                    category: document.getElementById('team-category').value,
                    image_url: imageUrl,
                    is_visible: true
                };
                let res;
                if (editId) res = await window.supabaseClient.from('team_members').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('team_members').insert([payload]);
                if (res.error) throw res.error;
                closeModal('team-modal');
                loadTeamCMS();
            } catch (e) { alert(e.message); }
            finally { btn.disabled = false; btn.textContent = 'Save Member'; }
        });
    }

    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = eventForm.querySelector('button[type="submit"]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const editId = eventForm.dataset.editId;
                let imageUrl = document.getElementById('event-image-old').value;
                const newImage = await uploadImage('event-image');
                if (newImage) imageUrl = newImage;

                const payload = {
                    title: document.getElementById('event-title').value,
                    location: document.getElementById('event-location').value,
                    description: document.getElementById('event-desc').value,
                    image_url: imageUrl,
                    is_visible: true
                };
                let res;
                if (editId) res = await window.supabaseClient.from('events').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('events').insert([payload]);
                if (res.error) throw res.error;
                closeModal('event-modal');
                loadEventsCMS();
            } catch (e) { alert(e.message); }
            finally { btn.disabled = false; btn.textContent = 'Save Event'; }
        });
    }

    const partnerForm = document.getElementById('partner-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = partnerForm.querySelector('button[type="submit"]');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                const editId = partnerForm.dataset.editId;
                let imageUrl = document.getElementById('partner-image-old').value;
                const newImage = await uploadImage('partner-image');
                if (newImage) imageUrl = newImage;

                const payload = {
                    name: document.getElementById('partner-name').value,
                    image_url: imageUrl,
                    is_visible: true
                };
                let res;
                if (editId) res = await window.supabaseClient.from('partners').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('partners').insert([payload]);
                if (res.error) throw res.error;
                closeModal('partner-modal');
                loadPartnersCMS();
            } catch (e) { alert(e.message); }
            finally { btn.disabled = false; btn.textContent = 'Save Partner'; }
        });
    }

    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = newsForm.dataset.editId;
            const payload = {
                title: document.getElementById('news-title').value,
                badge_text: document.getElementById('news-badge').value || 'NEWS',
                is_visible: true
            };
            try {
                let res;
                if (editId) res = await window.supabaseClient.from('news_items').update(payload).eq('id', editId);
                else res = await window.supabaseClient.from('news_items').insert([payload]);
                if (res.error) throw res.error;
                closeModal('news-modal');
                loadNewsCMS();
            } catch (e) { alert(e.message); }
        });
    }

    // Seed Data Functionality
    const btnSeedData = document.getElementById('btn-seed-data');
    if (btnSeedData) {
        btnSeedData.addEventListener('click', async () => {
            if (!confirm('This will load all the default original data (projects, members, events) into the database. Proceed?')) return;
            
            try {
                const oldProjects = [
                    { name: 'Saadany - Enactus Damanhour', description: 'Saadany empowers deaf and mute individuals...', image_url: 'images/saadny.jpg', is_visible: true, sort_order: 1 },
                    { name: 'Margosa - Enactus Damanhour', description: 'Margosa creates natural pesticides from neem extracts...', image_url: 'images/margosa.jpg', is_visible: true, sort_order: 2 },
                    { name: 'VetSea - Enactus Damanhour', description: 'VetSea protects cattle from parasites using natural algae-based treatments...', image_url: 'images/vetsea.jpg', is_visible: true, sort_order: 3 },
                    { name: 'Ecoplast - Enactus Damanhour', description: 'Ecoplast tackles plastic waste by recycling it into new products...', image_url: 'images/ecoplast.jpg', is_visible: true, sort_order: 4 },
                    { name: 'Organalia - Enactus Damanhour', description: 'Organalia produces organic fertilizer from Nile rose and animal waste...', image_url: 'images/organalia.jpg', is_visible: true, sort_order: 5 },
                    { name: 'Brickstick - Enactus Damanhour', description: 'Brickstick transforms plastic waste into eco-friendly bricks...', image_url: 'images/brickstick.jpg', is_visible: true, sort_order: 6 },
                    { name: 'Mushraws - Enactus Damanhour', description: 'Mushraws transforms rice straw waste into valuable products...', image_url: 'images/mushraws.jpg', is_visible: true, sort_order: 7 }
                ];
                await window.supabaseClient.from('projects').insert(oldProjects);

                const oldTeam = [
                    { name: 'Mohamed Zewail', role: 'Enactus Team President', category: 'leaders', image_url: 'images/president.jpg', sort_order: 1 },
                    { name: 'Mahmoud Naeem', role: 'Enactus Vice President', category: 'leaders', image_url: 'images/naeem.jpg', sort_order: 2 },
                    { name: 'Yasmin Ali', role: 'Enactus Vice President', category: 'leaders', image_url: 'images/yasmin.jpg', sort_order: 3 },
                    { name: 'Habiba Eltelwany', role: 'Enactus Head Multimedia', category: 'leaders', image_url: 'images/habiba.jpg', sort_order: 4 },
                    { name: 'Samira Elshaer', role: 'Enactus Head HR', category: 'leaders', image_url: 'images/samira.jpg', sort_order: 5 },
                    { name: 'Fayez kenawy', role: 'Enactus Head Marketing', category: 'leaders', image_url: 'images/fayez.jpg', sort_order: 6 },
                    { name: 'Menna Khater', role: 'Enactus Head Presentation', category: 'leaders', image_url: 'images/menna.jpg', sort_order: 7 },
                    { name: 'Sama Khaled', role: 'Enactus Head PR', category: 'leaders', image_url: 'images/SAMA KHALED PR HEAD.png', sort_order: 8 },
                    { name: 'Dr. Khaled Rohouma', role: 'Enactus Faculty Advisor', category: 'advisors', image_url: 'images/advisor.jpg', sort_order: 9 },
                    { name: 'Abdelrahman Shaheen', role: 'Enactus Team Advisor', category: 'advisors', image_url: 'images/advisor2.jpg', sort_order: 10 }
                ];
                await window.supabaseClient.from('team_members').insert(oldTeam);

                const oldEvents = [
                    { title: 'Enactus Damanhour Leadership Training', description: 'Enactus Damanhour at BUE: A day of learning...', location: 'BUE, Cairo', image_url: 'images/leadership.jpg', is_visible: true, event_month: 'Nov', event_day: 29 },
                    { title: 'InSolution - Enactus Damanhour', description: 'Business Skills Program in collaboration with In Solution...', location: 'Sharks, Damanhour', image_url: 'images/InSolution partnership .jpg', is_visible: true, event_month: 'Nov', event_day: 19 },
                    { title: 'CoderaTech Bootcamp - Enactus Damanhour', description: 'CodeRatech Bootcamp trained 50 people in web development...', location: 'Sharks, Damanhour', image_url: 'images/coderatechBootcamp.jpg', is_visible: true, event_month: 'Oct', event_day: 12 }
                ];
                await window.supabaseClient.from('events').insert(oldEvents);

                const oldPartners = [
                    { name: 'Sharks', image_url: 'images/sharks.jpg' },
                    { name: 'MIA Robotics', image_url: 'images/mia-robotics.jpeg' },
                    { name: 'Black Bear', image_url: 'images/black-bear.jpeg' },
                    { name: 'XAcademia', image_url: 'images/xacademia.jpg' },
                    { name: 'Creativa', image_url: 'images/creativa.jpg' },
                    { name: 'PRSE', image_url: 'images/prse.jpg' },
                    { name: 'Oxford', image_url: 'images/oxford.jpg' }
                ];
                await window.supabaseClient.from('partners').insert(oldPartners);

                const oldNews = [
                    { badge_text: 'AWARD', title: 'Looking forward seeing you inshallah on January 25th isa', date_text: '25 Jan' },
                    { badge_text: 'TRAINING', title: 'Enactus Damanhour successfully cooperates with Damanhour University', date_text: '2 days ago' },
                    { badge_text: 'PARTNERSHIP', title: 'New partnership: Enactus Damanhour collaborates with Black-Bear Burger', date_text: '1 week ago' }
                ];
                await window.supabaseClient.from('news_items').insert(oldNews);

                alert('Data seeded successfully!');
                loadProjectsCMS();
                loadTeamCMS();
                loadEventsCMS();
                loadPartnersCMS();
                loadNewsCMS();
            } catch (err) {
                alert('Error seeding data: ' + err.message);
            }
        });
    }
});

async function loadHeroCMS() {
    try {
        const { data, error } = await window.supabaseClient.from('hero_content').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') throw error; // ignore no rows
        if (data) {
            document.getElementById('hero-title').value = data.title || '';
            document.getElementById('hero-subtitle').value = data.subtitle || '';
        }
    } catch (e) { console.error('Error loading hero', e); }
}

async function loadProjectsCMS() {
    const tbody = document.getElementById('projects-tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const { data, error } = await window.supabaseClient.from('projects').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No projects found.</td></tr>';
            return;
        }
        tbody.innerHTML = data.map(p => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${p.image_url ? `<img src="../${p.image_url}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;background:#eee;">` : '<div style="width:40px;height:40px;border-radius:6px;background:#eee;"></div>'}
                        <div><strong>${p.name}</strong><br><small style="color:var(--gray)">${p.description ? p.description.substring(0, 50) + '...' : ''}</small></div>
                    </div>
                </td>
                <td>${p.is_visible ? '<span class="text-success">Visible</span>' : '<span style="color:var(--gray)">Hidden</span>'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-outline btn-sm" onclick="editProject('${p.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Error loading.</td></tr>'; }
}

async function loadTeamCMS() {
    const tbody = document.getElementById('team-tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const { data, error } = await window.supabaseClient.from('team_members').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No team members found.</td></tr>';
            return;
        }
        tbody.innerHTML = data.map(t => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${t.image_url ? `<img src="../${t.image_url}" style="width:40px;height:40px;object-fit:cover;border-radius:50%;background:#eee;">` : '<div style="width:40px;height:40px;border-radius:50%;background:#eee;"></div>'}
                        <strong>${t.name}</strong>
                    </div>
                </td>
                <td>${t.role} (${t.category})</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-outline btn-sm" onclick="editTeam('${t.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTeamMember('${t.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Error loading.</td></tr>'; }
}

async function loadEventsCMS() {
    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const { data, error } = await window.supabaseClient.from('events').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No events found.</td></tr>';
            return;
        }
        tbody.innerHTML = data.map(e => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${e.image_url ? `<img src="../${e.image_url}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;background:#eee;">` : '<div style="width:40px;height:40px;border-radius:6px;background:#eee;"></div>'}
                        <strong>${e.title}</strong>
                    </div>
                </td>
                <td>${e.event_month || ''} ${e.event_day || ''} - ${e.location || 'N/A'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-outline btn-sm" onclick="editEvent('${e.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEvent('${e.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Error loading.</td></tr>'; }
}

async function loadPartnersCMS() {
    const tbody = document.getElementById('partners-tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const { data, error } = await window.supabaseClient.from('partners').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No partners found.</td></tr>';
            return;
        }
        tbody.innerHTML = data.map(p => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${p.image_url ? `<img src="../${p.image_url}" style="max-height:40px;max-width:80px;object-fit:contain;">` : ''}
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>${p.is_visible ? '<span class="text-success">Visible</span>' : '<span style="color:var(--gray)">Hidden</span>'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-outline btn-sm" onclick="editPartner('${p.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deletePartner('${p.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Error loading.</td></tr>'; }
}

async function loadNewsCMS() {
    const tbody = document.getElementById('news-tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    try {
        const { data, error } = await window.supabaseClient.from('news_items').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No news items found.</td></tr>';
            return;
        }
        tbody.innerHTML = data.map(n => `
            <tr>
                <td><span style="background:var(--primary); padding:2px 6px; border-radius:4px; font-size:0.8em; margin-right:8px;">${n.badge_text || 'NEWS'}</span> <strong>${n.title}</strong></td>
                <td>${n.date_text || 'N/A'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-outline btn-sm" onclick="editNews('${n.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNews('${n.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Error loading.</td></tr>'; }
}

window.deleteProject = async function(id) {
    if (!confirm('Delete this project?')) return;
    await window.supabaseClient.from('projects').delete().eq('id', id);
    loadProjectsCMS();
}

window.deleteTeamMember = async function(id) {
    if (!confirm('Delete this team member?')) return;
    await window.supabaseClient.from('team_members').delete().eq('id', id);
    loadTeamCMS();
}

window.deleteEvent = async function(id) {
    if (!confirm('Delete this event?')) return;
    await window.supabaseClient.from('events').delete().eq('id', id);
    loadEventsCMS();
}

window.deletePartner = async function(id) {
    if (!confirm('Delete this partner/sponsor?')) return;
    await window.supabaseClient.from('partners').delete().eq('id', id);
    loadPartnersCMS();
}

window.deleteNews = async function(id) {
    if (!confirm('Delete this news item?')) return;
    await window.supabaseClient.from('news_items').delete().eq('id', id);
    loadNewsCMS();
}

window.openModal = function(id) {
    const modal = document.getElementById(id);
    if(modal) {
        const form = modal.querySelector('form');
        if(form && !form.dataset.editId) {
            form.reset();
            const previews = modal.querySelectorAll('img[id$="-preview"]');
            previews.forEach(p => p.style.display = 'none');
            const olds = modal.querySelectorAll('input[id$="-old"]');
            olds.forEach(o => o.value = '');
        }
        modal.classList.add('active');
    }
}

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('active');
        const form = modal.querySelector('form');
        if(form) {
            form.reset();
            delete form.dataset.editId;
        }
    }
}

window.uploadImage = async function(inputId) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return null;
    
    const file = fileInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    try {
        const { error } = await window.supabaseClient.storage.from('images').upload(fileName, file);
        if (error) throw error;
        const { data } = window.supabaseClient.storage.from('images').getPublicUrl(fileName);
        return data.publicUrl;
    } catch (e) {
        console.error(e);
        alert('Image upload failed: ' + e.message);
        return null;
    }
}

function setPreview(idPrefix, imageUrl) {
    document.getElementById(idPrefix + '-old').value = imageUrl || '';
    const preview = document.getElementById(idPrefix + '-preview');
    if(imageUrl) {
        preview.src = imageUrl.startsWith('http') ? imageUrl : `../${imageUrl}`;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

window.editProject = async function(id) {
    const { data } = await window.supabaseClient.from('projects').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('project-name').value = data.name || '';
        document.getElementById('project-desc').value = data.description || '';
        setPreview('project-image', data.image_url);
        document.getElementById('project-form').dataset.editId = id;
        document.getElementById('project-modal').classList.add('active');
    }
}

window.editTeam = async function(id) {
    const { data } = await window.supabaseClient.from('team_members').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('team-name').value = data.name || '';
        document.getElementById('team-role').value = data.role || '';
        document.getElementById('team-category').value = data.category || 'leaders';
        setPreview('team-image', data.image_url);
        document.getElementById('team-form').dataset.editId = id;
        document.getElementById('team-modal').classList.add('active');
    }
}

window.editEvent = async function(id) {
    const { data } = await window.supabaseClient.from('events').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('event-title').value = data.title || '';
        document.getElementById('event-location').value = data.location || '';
        document.getElementById('event-desc').value = data.description || '';
        setPreview('event-image', data.image_url);
        document.getElementById('event-form').dataset.editId = id;
        document.getElementById('event-modal').classList.add('active');
    }
}

window.editPartner = async function(id) {
    const { data } = await window.supabaseClient.from('partners').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('partner-name').value = data.name || '';
        setPreview('partner-image', data.image_url);
        document.getElementById('partner-form').dataset.editId = id;
        document.getElementById('partner-modal').classList.add('active');
    }
}

window.editNews = async function(id) {
    const { data } = await window.supabaseClient.from('news_items').select('*').eq('id', id).single();
    if(data) {
        document.getElementById('news-title').value = data.title || '';
        document.getElementById('news-badge').value = data.badge_text || '';
        document.getElementById('news-form').dataset.editId = id;
        document.getElementById('news-modal').classList.add('active');
    }
}
