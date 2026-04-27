import { notFound } from 'next/navigation'
import getCollections from '@/lib/mongodb'
import { PublicPortfolioView } from '@/components/PublicPortfolioView'

interface Props {
  params: { subdomain: string }
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { subdomain } = params

  try {
    const { portfolios } = await getCollections()
    const portfolio = await portfolios.findOne({
      subdomain,
      is_published: true,
      is_deleted: false,
    })

    if (!portfolio) {
      notFound()
    }

    // Increment view count
    await portfolios.updateOne({ _id: portfolio._id }, { $inc: { view_count: 1 } })

    const result = {
      id: portfolio._id.toString(),
      user_id: portfolio.user_id,
      name: portfolio.name,
      slug: portfolio.slug,
      subdomain: portfolio.subdomain,
      tagline: portfolio.tagline || '',
      avatar_url: portfolio.avatar_url || '',
      about: portfolio.about || '',
      skills: portfolio.skills || [],
      projects: portfolio.projects || [],
      social_links: portfolio.social_links || [],
      theme: portfolio.theme || 'gradient-dark',
      theme_config: portfolio.theme_config || {},
      custom_sections: portfolio.custom_sections || [],
      is_published: portfolio.is_published,
      published_at: portfolio.published_at,
      view_count: (portfolio.view_count || 0) + 1,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at,
    }

    return <PublicPortfolioView portfolio={result} />
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Props) {
  const { subdomain } = params

  try {
    const { portfolios } = await getCollections()
    const portfolio = await portfolios.findOne({
      subdomain,
      is_published: true,
      is_deleted: false,
    })

    return {
      title: portfolio ? `${portfolio.name} — PortGen` : 'Portfolio — PortGen',
      description: portfolio?.tagline || 'Portfolio ของฉันบน PortGen',
    }
  } catch {
    return {
      title: 'Portfolio — PortGen',
      description: 'Portfolio ของฉันบน PortGen',
    }
  }
}
