import { Hero } from '@/components/home/Hero'
import { CategoryCards } from '@/components/home/CategoryCards'
import { PopularTools } from '@/components/home/PopularTools'
import { RecentlyUsed } from '@/components/home/RecentlyUsed'
import { HomeTestimonials } from '@/components/home/HomeTestimonials'

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <PopularTools />
      <RecentlyUsed />
      <HomeTestimonials />
    </>
  )
}
