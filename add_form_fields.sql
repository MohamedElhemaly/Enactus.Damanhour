-- Script to add default fields to the Membership Application form

DO $$ 
DECLARE
    v_form_id uuid;
BEGIN
    -- Get the ID of the Membership Application form
    SELECT id INTO v_form_id FROM public.forms WHERE title = 'Membership Application' LIMIT 1;
    
    IF v_form_id IS NOT NULL THEN
        -- Insert First Name
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, sort_order)
        VALUES (v_form_id, 'Full Name', 'text', 'Enter your full name', true, 1);
        
        -- Insert Email
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, sort_order)
        VALUES (v_form_id, 'Email Address', 'email', 'Enter your email', true, 2);
        
        -- Insert Phone
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, sort_order)
        VALUES (v_form_id, 'Phone Number', 'tel', 'Enter your phone number', true, 3);
        
        -- Insert University/Faculty
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, sort_order)
        VALUES (v_form_id, 'Faculty / Year', 'text', 'e.g. Commerce - 3rd Year', true, 4);
        
        -- Insert Committee Preference (Dropdown)
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, options, sort_order)
        VALUES (v_form_id, 'Preferred Committee', 'select', 'Choose a committee', true, '["HR", "Marketing", "PR", "Projects", "Presentation", "Multimedia"]'::jsonb, 5);
        
        -- Insert Motivation
        INSERT INTO public.form_fields (form_id, label, type, placeholder, is_required, sort_order)
        VALUES (v_form_id, 'Why do you want to join Enactus?', 'textarea', 'Tell us about your motivation...', true, 6);
        
    END IF;
END $$;
