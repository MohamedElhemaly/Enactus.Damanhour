document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-excel-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            if (!window.supabaseClient || typeof XLSX === 'undefined') {
                alert("Dependencies not loaded");
                return;
            }
            
            try {
                exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
                exportBtn.disabled = true;
                
                const { data, error } = await window.supabaseClient
                    .from('form_submissions')
                    .select('*, forms(title)')
                    .order('submitted_at', { ascending: false });
                    
                if (error) throw error;
                
                if (!data || data.length === 0) {
                    alert("No submissions to export");
                    exportBtn.innerHTML = '<i class="fas fa-file-excel"></i> Export to Excel';
                    exportBtn.disabled = false;
                    return;
                }
                
                // Format data for Excel
                const excelData = data.map(sub => {
                    const row = {
                        'Date': new Date(sub.submitted_at).toLocaleString(),
                        'Form Title': sub.forms?.title || 'Unknown',
                        'Email': sub.email || ''
                    };
                    
                    // Flatten JSON data
                    if (sub.data) {
                        Object.keys(sub.data).forEach(key => {
                            row[key] = Array.isArray(sub.data[key]) ? sub.data[key].join(', ') : sub.data[key];
                        });
                    }
                    return row;
                });
                
                // Create workbook
                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
                
                // Download
                XLSX.writeFile(workbook, "Enactus_Submissions.xlsx");
                
            } catch (err) {
                console.error(err);
                alert("Failed to export data");
            } finally {
                exportBtn.innerHTML = '<i class="fas fa-file-excel"></i> Export to Excel';
                exportBtn.disabled = false;
            }
        });
    }
});
