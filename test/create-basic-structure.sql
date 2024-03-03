
DO $$
DECLARE
    user_profile_id INT;
    user_id INT;
    series_id INT;

BEGIN

    -- create user profile
    INSERT INTO user_profile (age, balance) VALUES (25, 1200) RETURNING id INTO user_profile_id;

    -- create user
    INSERT INTO "user" (email, username, password, first_name, last_name, is_banned, profile_id) VALUES (
        'test@mail.ru', 'test-user', '$2b$05$C27P30jHKi.hOLRzjrHl.ucMyawQy8QKv6iKanAsaL5lDjTzb6W7.', 'test', 'test-surname', False, user_profile_id
    ) RETURNING id INTO user_id;

    -- assign user role
    INSERT INTO user_roles (user_id, user_role_id) VALUES (user_id, 1);

    -- create series
    INSERT INTO book_series (name, author_id) VALUES ('Great series', user_id) RETURNING id INTO series_id;

    -- create book
    INSERT INTO book (title, description, views_count, rewards_count, adds_to_library_count, status, is_published, is_banned, age_restriction, author_id, series_id)
        VALUES ('test book title', 'book description', 0, 0, 0, 'finished', False, False, '12+', user_id, series_id);


END$$;


