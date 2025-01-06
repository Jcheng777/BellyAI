'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import { getRecommendation } from '../actions/getRecommendation'
import { RecommendationResponse } from '@/types/restaurant'
import RestaurantCard from './RestaurantCard'

export default function RestaurantChat() {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async (message) => {
      try {
        const result = await getRecommendation(message.content)
        setRecommendation(result)
      } catch (error) {
        console.error('Failed to get recommendation:', error)
      }
    },
  })

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
        {recommendation && (
          <div className="mb-4">
            <RestaurantCard restaurant={recommendation.data} />
            <p className="mt-2 p-2 bg-gray-100 rounded-lg">{recommendation.summary}</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for a restaurant recommendation..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </form>
    </div>
  )
}

