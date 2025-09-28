export type Skill = {
  id: string
  name: string
  category: string | null
  description: string | null
  level: number | null
  proficiency?: number | null
  icon: string | null
  imageUrl: string | null
  imagePath: string | null
  isVisible: boolean
  order: number
  createdAt?: string | Date
  updatedAt?: string | Date
}
