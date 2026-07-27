-- Initial Gestory content. Run after migrations/001_gestory_schema.sql.

INSERT INTO public.courses (slug, title, description, image_url)
VALUES
('bab-1', 'Bab 1: Sejarah Kemerdekaan Indonesia - Menuju Proklamasi', 'Pelajari perjalanan panjang bangsa Indonesia menuju kemerdekaan, mulai dari latar belakang penjajahan hingga detik-detik proklamasi pada 17 Agustus 1945.', '/assets/bab1_thumb.png'),
('bab-2', 'Bab 2: Misi Investigasi - Menguak Tokoh Pergerakan', 'Bacalah materi terkait bagaimana peran para Tokoh Pergerakan Nasional dalam membangun pondasi kemerdekaan.', '/assets/bab2_thumb.png'),
('bab-3', 'Bab 3: Momen Krusial - Menjelajahi Kongres Pemuda', 'Bacalah materi tentang proses kongres pemuda dan hasil dari kongres tersebut yang menjadi tonggak persatuan.', '/assets/bab3_thumb.png'),
('bab-4', 'Bab 4: Proyek Akhir - Sintesis Perjalanan', 'Sebagai tahap akhir, mari kita buat sebuah sintesis pemahaman tentang seluruh perjalanan sejarah ini.', '/assets/bab4_thumb.png')
ON CONFLICT (slug) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
image_url = EXCLUDED.image_url;

INSERT INTO public.materials (course_id, title, type, order_index, content, url)
SELECT id, 'Materi PDF - Bab 1: Sejarah Kemerdekaan Indonesia', 'pdf', 1, NULL, '/material/sejarahkemerdekaan.pdf'
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, order_index) DO UPDATE SET
title = EXCLUDED.title,
type = EXCLUDED.type,
content = EXCLUDED.content,
url = EXCLUDED.url;

INSERT INTO public.materials (course_id, title, type, order_index, content, url)
SELECT id, 'Materi Teks - Ringkasan Sejarah Kemerdekaan', 'text', 2, 'Sejarah kemerdekaan Indonesia mencakup beberapa fase krusial: 1. Latar Belakang Penjajahan yang memicu semangat perlawanan. 2. Masa Pendudukan Jepang yang berakhir setelah kekalahan Jepang di Perang Pasifik. 3. Peristiwa Rengasdengklok, di mana para pemuda mendesak Soekarno-Hatta agar proklamasi segera dilaksanakan. 4. Proklamasi 17 Agustus 1945 di Jakarta.', NULL
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, order_index) DO UPDATE SET
title = EXCLUDED.title,
type = EXCLUDED.type,
content = EXCLUDED.content,
url = EXCLUDED.url;

INSERT INTO public.materials (course_id, title, type, order_index, content, url)
SELECT id, 'Materi Video - Detik-detik Proklamasi', 'video', 3, NULL, 'https://youtu.be/TTeRijrtDhg?si=zC-k-ia-QHAqKMH_'
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, order_index) DO UPDATE SET
title = EXCLUDED.title,
type = EXCLUDED.type,
content = EXCLUDED.content,
url = EXCLUDED.url;

INSERT INTO public.materials (course_id, title, type, order_index, content, url)
SELECT id, 'Pre Test - Sejarah Kemerdekaan', 'quiz', 4, NULL, NULL
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, order_index) DO UPDATE SET
title = EXCLUDED.title,
type = EXCLUDED.type,
content = EXCLUDED.content,
url = EXCLUDED.url;

INSERT INTO public.quiz_questions (course_id, question, options, correct_answer, explanation, difficulty)
SELECT id, 'Di mana proklamasi kemerdekaan Indonesia dibacakan?', '{"A":"Jl. Pegangsaan Timur 56","B":"Lapangan IKADA"}'::jsonb, 'A', 'Proklamasi dibacakan di kediaman Soekarno, Jl. Pegangsaan Timur 56, Jakarta.', 'medium'
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, question) DO UPDATE SET
options = EXCLUDED.options,
correct_answer = EXCLUDED.correct_answer,
explanation = EXCLUDED.explanation,
difficulty = EXCLUDED.difficulty;

INSERT INTO public.quiz_questions (course_id, question, options, correct_answer, explanation, difficulty)
SELECT id, 'Peristiwa apa yang terjadi sebelum proklamasi?', '{"A":"Peristiwa Rengasdengklok","B":"Sumpah Pemuda"}'::jsonb, 'A', 'Peristiwa Rengasdengklok terjadi pada 16 Agustus 1945, di mana golongan muda menculik Soekarno-Hatta untuk mendesak proklamasi.', 'easy'
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, question) DO UPDATE SET
options = EXCLUDED.options,
correct_answer = EXCLUDED.correct_answer,
explanation = EXCLUDED.explanation,
difficulty = EXCLUDED.difficulty;

INSERT INTO public.quiz_questions (course_id, question, options, correct_answer, explanation, difficulty)
SELECT id, 'Siapa yang mengetik teks proklamasi?', '{"A":"Sayuti Melik","B":"Sukarni"}'::jsonb, 'A', 'Teks proklamasi diketik oleh Sayuti Melik setelah disusun oleh Soekarno, Hatta, dan Ahmad Soebardjo.', 'medium'
FROM public.courses WHERE slug = 'bab-1'
ON CONFLICT (course_id, question) DO UPDATE SET
options = EXCLUDED.options,
correct_answer = EXCLUDED.correct_answer,
explanation = EXCLUDED.explanation,
difficulty = EXCLUDED.difficulty;
