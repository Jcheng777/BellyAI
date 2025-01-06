'use server'

import { RecommendationResponse, Restaurant } from '@/types/restaurant'

export async function getRecommendation(query: string): Promise<RecommendationResponse> {
  console.log('getRecommendation called with query:', query)
  
  try {
    console.log('Sending request to API...')
    const response = await fetch('https://belly-ai-a59dd26f0499.herokuapp.com/recommend/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    console.log('Received response from API. Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API response not OK:', response.status, errorText)
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const apiData = await response.json()
    console.log('Parsed response data:', apiData)

    // Reshape the API response to match our expected structure
    const restaurantData: Restaurant = {
      id: apiData.business_id,
      name: apiData.name,
      image_url: apiData.image_url,
      business_url: apiData.business_url,
      display_address: apiData.display_address,
      display_phone: apiData.display_phone,
      rating: apiData.rating
    }

    const recommendationResponse: RecommendationResponse = {
      data: restaurantData,
      summary: apiData.summary
    }

    return recommendationResponse
  } catch (error) {
    console.error('Error in getRecommendation:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('An unknown error occurred while fetching the recommendation')
    }
  }
}