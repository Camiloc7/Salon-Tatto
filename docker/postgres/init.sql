SELECT 'CREATE DATABASE salon_tatto'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'salon_tatto')\gexec
