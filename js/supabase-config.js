// Supabase Configuration
// REPLACE THESE WITH YOUR ACTUAL SUPABASE PROJECT URL AND ANON KEY
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
// We assume the Supabase JS library is loaded in the HTML
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

try {
    window.supabaseClient = window.supabase.createClient("https://agkhuuhrvrjsfmenxgyk.supabase.co", "sb_publishable_453laHBG1cSoPYdN1m5-fg_utRqJh1q");
} catch (e) {
    console.warn("Supabase client not initialized. Did you include the Supabase CDN and add your keys?", e);
}

// Helper functions for data fetching
window.supabaseAPI = {
    async getHeroContent() {
        if (!window.supabaseClient) return null;
        const { data, error } = await window.supabaseClient.from('hero_content').select('*').limit(1).single();
        if (error) console.error('Error fetching hero content:', error);
        return data;
    },

    async getProjects() {
        if (!window.supabaseClient) return [];
        const { data, error } = await window.supabaseClient.from('projects').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching projects:', error);
        return data || [];
    },

    async getTeamMembers() {
        if (!window.supabaseClient) return [];
        const { data, error } = await window.supabaseClient.from('team_members').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching team members:', error);
        return data || [];
    },

    async getEvents() {
        if (!window.supabaseClient) return [];
        const { data, error } = await window.supabaseClient.from('events').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching events:', error);
        return data || [];
    },

    async getPartners() {
        if (!window.supabaseClient) return [];
        const { data, error } = await window.supabaseClient.from('partners').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching partners:', error);
        return data || [];
    },

    async getNewsItems() {
        if (!window.supabaseClient) return [];
        const { data, error } = await window.supabaseClient.from('news_items').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching news items:', error);
        return data || [];
    }
};
