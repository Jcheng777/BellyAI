'use server'

import { RecommendationResponse } from '@/types/restaurant'

export async function getRecommendation(query: string): Promise<RecommendationResponse> {
  const response = await fetch('https://belly-ai-a59dd26f0499.herokuapp.com//recommend/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recommendation')
  }

  return response.json()
}

