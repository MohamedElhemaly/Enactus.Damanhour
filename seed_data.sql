-- Seed Data Script for Enactus Damanhour Website Content
-- Run this in your Supabase SQL Editor to populate all the old data into your dynamic database!

-- 1. Insert Hero Content
INSERT INTO public.hero_content (title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, background_image)
VALUES (
    'Transform Lives Through<br><span class="gradient-text">Entrepreneurial Action</span>',
    'Empowering student-led initiatives at Damanhour University to create sustainable social impact through innovation',
    'Explore Projects',
    '#projects',
    'Get in Touch',
    '#contact',
    'images/download1.webp'
);

-- 2. Insert Projects
INSERT INTO public.projects (name, description, image_url, link, sort_order, is_visible) VALUES
('Saadany - Enactus Damanhour', 'Saadany empowers deaf and mute individuals by connecting them with real job opportunities. We bridge the gap to the labor market in sectors like manufacturing and hospitality with skill-building content. Our platform prepares them for employment and entrepreneurship.', 'images/saadny.jpg', '', 1, true),
('Margosa - Enactus Damanhour', 'Margosa creates natural pesticides from neem extracts, offering farmers a safe, eco-friendly alternative to chemicals. Our solutions protect crops and soil health while supporting sustainable farming practices in Egypt.', 'images/margosa.jpg', '', 2, true),
('VetSea - Enactus Damanhour', 'VetSea protects cattle from parasites using natural algae-based treatments instead of chemicals. Our solution improves animal health and promotes sustainable livestock farming by replacing harmful drugs in Egyptian farms.', 'images/vetsea.jpg', '', 3, true),
('Ecoplast - Enactus Damanhour', 'Ecoplast tackles plastic waste by recycling it into new products like eco-friendly bricks. We empower communities by creating jobs and providing technical training, increasing workers'' income by 350%.', 'images/ecoplast.jpg', '', 4, true),
('Organalia - Enactus Damanhour', 'Organalia produces organic fertilizer from Nile rose and animal waste to reduce environmental impact. We empower communities by creating jobs and providing technical training.', 'images/organalia.jpg', '', 5, true),
('Brickstick - Enactus Damanhour', 'Brickstick transforms plastic waste into eco-friendly bricks, offering a sustainable construction material. We partner with factories to scale production in Egypt.', 'images/brickstick.jpg', '', 6, true),
('Mushraws - Enactus Damanhour', 'Mushraws transforms rice straw waste into valuable products like mushrooms, animal feed, and organic fertilizer. Our zero-waste model prevents harmful burning in Egyptian farms.', 'images/mushraws.jpg', '', 7, true);

-- 3. Insert Team Members
INSERT INTO public.team_members (name, role, category, image_url, linkedin_url, sort_order, is_visible) VALUES
('Mohamed Zewail', 'Enactus Team President', 'leaders', 'images/president.jpg', 'https://www.linkedin.com/in/mohamed-zewail-b25910320', 1, true),
('Mahmoud Naeem', 'Enactus Vice President', 'leaders', 'images/naeem.jpg', 'https://www.linkedin.com/in/mahmoud-naeem-3aa47927b', 2, true),
('Yasmin Ali', 'Enactus Vice President', 'leaders', 'images/yasmin.jpg', 'https://www.linkedin.com/in/yasmin-aly-951836317', 3, true),
('Saif Aboalkhair', 'Enactus Head Project', 'leaders', 'images/aboalkhair.jpg', '#', 4, true),
('Habiba Eltelwany', 'Enactus Head Multimedia', 'leaders', 'images/habiba.jpg', 'https://www.linkedin.com/in/habiba-eltlwany-616231254', 5, true),
('Samira Elshaer', 'Enactus Head HR', 'leaders', 'images/samira.jpg', 'https://eg.linkedin.com/in/samira-alaa-75b71427b', 6, true),
('Fayez kenawy', 'Enactus Head Marketing', 'leaders', 'images/fayez.jpg', 'https://www.linkedin.com/in/fayez-kenawy-79113033b', 7, true),
('Menna Khater', 'Enactus Head Presentation', 'leaders', 'images/menna.jpg', 'https://www.linkedin.com/in/menna-khater-1132a3248', 8, true),
('Sama Khaled', 'Enactus Head PR', 'leaders', 'images/SAMA KHALED PR HEAD.png', '#', 9, true),
('Dr. Khaled Rohouma', 'Enactus Faculty Advisor', 'advisors', 'images/advisor.jpg', '#', 10, true),
('Abdelrahman Shaheen', 'Enactus Team Advisor', 'advisors', 'images/advisor2.jpg', '#', 11, true);

-- 4. Insert Partners (Sponsors)
INSERT INTO public.partners (name, image_url, link, sort_order, is_visible) VALUES
('Sharks', 'images/sharks.jpg', '', 1, true),
('MIA Robotics', 'images/mia-robotics.jpeg', '', 2, true),
('Black Bear', 'images/black-bear.jpeg', '', 3, true),
('XAcademia', 'images/xacademia.jpg', '', 4, true),
('Creativa', 'images/creativa.jpg', '', 5, true),
('PRSE', 'images/prse.jpg', '', 6, true),
('Oxford', 'images/oxford.jpg', '', 7, true),
('Codera Tech', 'images/coderaTech.jpg', '', 8, true),
('British Council', 'images/britchCouncil.jpg', '', 9, true),
('European Union', 'images/europeanUnion.jpg', '', 10, true),
('German Embassy', 'images/german.jpg', '', 11, true),
('GIZ', 'images/giz.jpg', '', 12, true),
('Hermopoaita', 'images/hermopoaita.jpg', '', 13, true),
('IRC', 'images/irc.jpg', '', 14, true),
('Circle', 'images/circle.jpg', '', 15, true),
('Techne', 'images/techne.jpg', '', 16, true),
('Kahwawetamer', 'images/Kahwawetamer.jpg', '', 17, true),
('Alrakwa', 'images/alrakwa.jpg', '', 18, true),
('Grand Force', 'images/grandForce.jpg', '', 19, true);

-- 5. Insert Events
INSERT INTO public.events (title, description, image_url, location, time_info, event_month, event_day, registration_link, sort_order, is_visible) VALUES
('Enactus Damanhour Leadership Training', 'Enactus Damanhour at BUE: A day of learning, connection, and growth with inspiring collaboration between different Enactus teams.', 'images/leadership.jpg', 'BUE, Cairo', '10:00 AM - 5:00 PM', 'Nov', 29, '#', 1, true),
('InSolution - Enactus Damanhour', 'Business Skills Program in collaboration with In Solution covering Strategy, Marketing, Sales, Leadership, Finance, Innovation and more.', 'images/InSolution partnership .jpg', 'Sharks, Damanhour', 'Every Wednesday From 3:00 PM - 5:00 PM', 'Nov', 19, '#', 2, true),
('CoderaTech Bootcamp - Enactus Damanhour', 'CodeRatech Bootcamp trained 50 people in web development, graduating 40 with industry-ready skills in HTML, CSS, and JavaScript.', 'images/coderatechBootcamp.jpg', 'Sharks, Damanhour', 'Every Sunday 3:00 PM - 5:00 PM', 'Oct', 12, '#', 3, true);

-- 6. Insert News Items
INSERT INTO public.news_items (badge_text, title, link, date_text, sort_order, is_visible) VALUES
('AWARD', 'Looking forward seeing you inshallah on January 25th isa', '#', '25 Jan', 1, true),
('TRAINING', 'Enactus Damanhour successfully cooperates with Damanhour University on future projects', '#', '2 days ago', 2, true),
('PARTNERSHIP', 'New partnership: Enactus Damanhour collaborates with Black-Bear Burger', '#', '1 week ago', 3, true);
