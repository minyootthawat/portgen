-- ============================================================
-- Portgen Demo Seed Data
-- Run this in Supabase SQL Editor after migrations
-- ============================================================

-- Demo user (use a real auth.uid from your Supabase auth.users)
-- Replace 'DEMO_USER_ID' with actual user ID from auth.users table
-- Or insert a demo auth user first

-- Demo profiles
insert into public.profiles (id, email, name, avatar_url, provider, plan) values
  ('00000000-0000-0000-0000-000000000001', 'demo@portgen.dev', 'Alex Rivera', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'email', 'pro'),
  ('00000000-0000-0000-0000-000000000002', 'alice@example.com', 'Alice Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', 'google', 'free'),
  ('00000000-0000-0000-0000-000000000003', 'bob@example.com', 'Bob Kim', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 'github', 'pro')
on conflict (id) do nothing;

-- Demo portfolios
insert into public.portfolios (id, user_id, slug, subdomain, name, tagline, about, avatar_url, skills, projects, social_links, theme, is_published, view_count) values

  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'alex-rivera',
    'alex',
    'Alex Rivera',
    'Full-Stack Engineer · React & Node.js · Open Source Enthusiast',
    'I build products that people love to use. With 6 years of experience spanning startups and scale-ups, I specialize in crafting performant web applications with clean, maintainable code. When I''m not coding, you can find me contributing to open source or mentoring junior developers.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    '[
      {"id": "1", "name": "React", "level": "expert"},
      {"id": "2", "name": "TypeScript", "level": "expert"},
      {"id": "3", "name": "Node.js", "level": "intermediate"},
      {"id": "4", "name": "PostgreSQL", "level": "intermediate"},
      {"id": "5", "name": "Docker", "level": "intermediate"},
      {"id": "6", "name": "GraphQL", "level": "intermediate"}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "ShopFlow — E-Commerce Platform",
        "description": "Full-stack marketplace with real-time inventory, Stripe payments, and admin dashboard. 2,000+ DAU, $50K+ monthly GMV processed.",
        "tags": ["React", "Node.js", "Stripe", "PostgreSQL", "Redis"],
        "live_url": "https://shopflow.demo.com",
        "repo_url": "https://github.com/alexrivera/shopflow"
      },
      {
        "id": "2",
        "title": "CollabBoard — Real-time Whiteboard",
        "description": "WebSocket-powered collaborative whiteboard with infinite canvas, shape tools, and export to PDF/PNG. Built for remote teams.",
        "tags": ["Next.js", "WebSocket", "Canvas API", "Prisma"],
        "live_url": "https://collabboard.demo.com",
        "repo_url": "https://github.com/alexrivera/collabboard"
      },
      {
        "id": "3",
        "title": "DevPulse — Dev News Aggregator",
        "description": "AI-curated tech news dashboard with personalized feeds, sentiment analysis, and weekly digest emails. 5,000+ subscribers.",
        "tags": ["Next.js", "OpenAI", "Vercel", "Resend"],
        "live_url": "https://devpulse.demo.com",
        "repo_url": "https://github.com/alexrivera/devpulse"
      },
      {
        "id": "4",
        "title": "FitTrack — Health Metrics Dashboard",
        "description": "Apple HealthKit & Google Fit integration with trend visualization, goal tracking, and personalized insights powered by ML.",
        "tags": ["React", "D3.js", "Node.js", "HealthKit API"],
        "live_url": "https://fittrack.demo.com",
        "repo_url": "https://github.com/alexrivera/fittrack"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "github", "url": "https://github.com/alexrivera"},
      {"id": "2", "platform": "linkedin", "url": "https://linkedin.com/in/alexrivera"},
      {"id": "3", "platform": "twitter", "url": "https://twitter.com/alexrivera"}
    ]'::jsonb,
    'gradient-dark',
    true,
    2341
  ),

  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'alice-chen',
    'alice',
    'Alice Chen',
    'UX Designer & Frontend Developer · Design Systems Advocate',
    'Designing and building digital products that balance beauty with usability. I believe the best interfaces are invisible — they get out of the way and let people do what they need to do. Previously at Figma and Linear.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    '[
      {"id": "1", "name": "Figma", "level": "expert"},
      {"id": "2", "name": "React", "level": "intermediate"},
      {"id": "3", "name": "CSS / SCSS", "level": "expert"},
      {"id": "4", "name": "Framer Motion", "level": "intermediate"},
      {"id": "5", "name": "Storybook", "level": "intermediate"}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "Prism Design System",
        "description": "Company-wide design system with 60+ accessible components, dark mode support, and comprehensive documentation. Adopted by 12 product teams.",
        "tags": ["Figma", "React", "Storybook", "TypeScript"],
        "live_url": "https://prism.design",
        "repo_url": "https://github.com/alicechen/prism"
      },
      {
        "id": "2",
        "title": "Onboarding Redesign — Linear",
        "description": "Reduced onboarding drop-off by 40% through research-driven redesign of the first-run experience. Improved time-to-value from 8 min to 3 min.",
        "tags": ["UX Research", "Figma", "Prototyping"],
        "live_url": "https://linear.app/onboarding",
        "repo_url": ""
      },
      {
        "id": "3",
        "title": "Motion UI Library",
        "description": "Open-source animation library with 50+ pre-built transitions. Used by 1,000+ developers in production apps.",
        "tags": ["React", "Framer Motion", "CSS"],
        "live_url": "https://motion-ui.demo.com",
        "repo_url": "https://github.com/alicechen/motion-ui"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "linkedin", "url": "https://linkedin.com/in/alicechen"},
      {"id": "2", "platform": "website", "url": "https://alicechen.design"},
      {"id": "3", "platform": "twitter", "url": "https://twitter.com/alicechen"}
    ]'::jsonb,
    'minimal-light',
    true,
    1205
  ),

  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'bob-kim',
    'bob',
    'Bob Kim',
    'DevOps Engineer · AWS & Kubernetes · Platform Builder',
    'Building the infrastructure that lets product teams ship faster. I''m passionate about automation, observability, and making complex systems boring. 8 years of cloud-native experience across fintech and e-commerce.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    '[
      {"id": "1", "name": "AWS", "level": "expert"},
      {"id": "2", "name": "Kubernetes", "level": "expert"},
      {"id": "3", "name": "Terraform", "level": "expert"},
      {"id": "4", "name": "Python", "level": "intermediate"},
      {"id": "5", "name": "Go", "level": "intermediate"},
      {"id": "6", "name": "Prometheus", "level": "intermediate"}
    ]'::jsonb,
    '[
      {
        "id": "1",
        "title": "Zero-Downtime Migration — Fintech Platform",
        "description": "Led migration of 50+ microservices from on-prem to AWS EKS with zero downtime. Reduced infrastructure costs by 35% while improving reliability.",
        "tags": ["AWS EKS", "Terraform", "RDS", "ElastiCache"],
        "live_url": "",
        "repo_url": "https://github.com/bobkim/fintech-migration"
      },
      {
        "id": "2",
        "title": "AutoScale — ML-Powered Autoscaling",
        "description": "Kubernetes HPA replacement using custom metrics and ML-based prediction. Reduces cloud spend by 25% during off-peak hours.",
        "tags": ["Go", "Kubernetes", "Prometheus", "ML"],
        "live_url": "",
        "repo_url": "https://github.com/bobkim/autoscale"
      },
      {
        "id": "3",
        "title": "Observability Stack — Unified Monitoring",
        "description": "Centralized logging, tracing, and metrics platform using Grafana, Loki, and Tempo. Handles 500K+ events/second.",
        "tags": ["Grafana", "Loki", "Tempo", "Kubernetes"],
        "live_url": "https://observability.demo.internal",
        "repo_url": "https://github.com/bobkim/observability"
      },
      {
        "id": "4",
        "title": "InfraCLI — Infrastructure as Code Toolkit",
        "description": "CLI tool that generates production-ready Terraform modules from simple YAML definitions. 800+ GitHub stars, used by 50+ teams.",
        "tags": ["Go", "Terraform", "CLI"],
        "live_url": "",
        "repo_url": "https://github.com/bobkim/infracli"
      }
    ]'::jsonb,
    '[
      {"id": "1", "platform": "github", "url": "https://github.com/bobkim"},
      {"id": "2", "platform": "linkedin", "url": "https://linkedin.com/in/bobkim"},
      {"id": "3", "platform": "twitter", "url": "https://twitter.com/bobkim"}
    ]'::jsonb,
    'brutalist',
    false,
    0
  )

on conflict (id) do nothing;

-- Update published_at for published portfolios
update public.portfolios set published_at = now() where is_published = true;
