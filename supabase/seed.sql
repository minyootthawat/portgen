-- ============================================================
-- Portgen Demo Seed Data
-- Run this in Supabase SQL Editor after migrations
-- ============================================================

-- Demo user (use a real auth.uid from your Supabase auth.users)
-- Replace 'DEMO_USER_ID' with actual user ID from auth.users table
-- Or insert a demo auth user first

-- Demo profiles
insert into public.profiles (id, email, name, avatar_url, provider, plan) values
  ('00000000-0000-0000-0000-000000000001', 'demo@portgen.dev', 'Demo User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', 'email', 'pro'),
  ('00000000-0000-0000-0000-000000000002', 'alice@example.com', 'Alice Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', 'google', 'free'),
  ('00000000-0000-0000-0000-000000000003', 'bob@example.com', 'Bob Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 'github', 'pro')
on conflict (id) do nothing;

-- Demo portfolios
insert into public.portfolios (id, user_id, slug, subdomain, name, tagline, about, avatar_url, skills, projects, social_links, theme, is_published, view_count) values

  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'demo-portfolio',
    'demo',
    'Demo User',
    'Full-Stack Developer | React & Node.js',
    'Passionate developer with 5 years of experience building web applications. I love creating beautiful, user-friendly interfaces and scalable backends.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    '[
      {"id": "1", "name": "React", "level": 90},
      {"id": "2", "name": "Node.js", "level": 85},
      {"id": "3", "name": "TypeScript", "level": 88},
      {"id": "4", "name": "PostgreSQL", "level": 75},
      {"id": "5", "name": "Docker", "level": 70}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "E-Commerce Platform",
        "description": "Full-stack e-commerce with React, Node.js, and Stripe payments",
        "url": "https://github.com/demo/ecommerce",
        "image": "https://picsum.photos/seed/shop/400/300"
      },
      {
        "id": "2",
        "title": "Task Management App",
        "description": "Real-time collaboration tool with WebSocket",
        "url": "https://github.com/demo/taskapp",
        "image": "https://picsum.photos/seed/task/400/300"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "github", "url": "https://github.com/demo"},
      {"id": "2", "platform": "linkedin", "url": "https://linkedin.com/in/demo"},
      {"id": "3", "platform": "twitter", "url": "https://twitter.com/demo"}
    ]'::jsonb,
    'gradient-dark',
    true,
    1245
  ),

  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'alice-chen',
    'alice',
    'Alice Chen',
    'UX Designer & Frontend Developer',
    'Designing delightful user experiences with a focus on accessibility and inclusivity.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    '[
      {"id": "1", "name": "Figma", "level": 95},
      {"id": "2", "name": "React", "level": 80},
      {"id": "3", "name": "CSS/SCSS", "level": 90},
      {"id": "4", "name": "Vue.js", "level": 70}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "Design System",
        "description": "Company-wide design system with 50+ components",
        "url": "https://dribbble.com/alice",
        "image": "https://picsum.photos/seed/design/400/300"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "dribbble", "url": "https://dribbble.com/alice"},
      {"id": "2", "platform": "linkedin", "url": "https://linkedin.com/in/alice"}
    ]'::jsonb,
    'minimal-light',
    true,
    892
  ),

  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'bob-smith',
    'bob',
    'Bob Smith',
    'DevOps Engineer | AWS & Kubernetes',
    'Building and maintaining scalable cloud infrastructure. Love automating everything.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    '[
      {"id": "1", "name": "AWS", "level": 92},
      {"id": "2", "name": "Kubernetes", "level": 88},
      {"id": "3", "name": "Terraform", "level": 85},
      {"id": "4", "name": "Python", "level": 78}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "Cloud Migration",
        "description": "Migrated 50+ services to AWS with zero downtime",
        "url": "https://github.com/bob/migration",
        "image": "https://picsum.photos/seed/cloud/400/300"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "github", "url": "https://github.com/bob"},
      {"id": "2", "platform": "linkedin", "url": "https://linkedin.com/in/bob"}
    ]'::jsonb,
    'gradient-dark',
    false,
    0
  )

on conflict (id) do nothing;

-- Update published_at for published portfolios
update public.portfolios set published_at = now() where is_published = true;
