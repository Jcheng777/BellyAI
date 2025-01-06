"use client";

import { useState, FormEvent } from "react";
import { getRecommendation } from "../app/actions/getRecommendation";
import { RecommendationResponse } from "@/types/restaurant";
import RestaurantCard from "./RestaurantCard";

const samplePrompts = [
  "Find me a romantic Italian restaurant for a date night",
  "What's the best sushi place in town?",
  "Recommend a family-friendly restaurant with vegetarian options",
];

export default function RestaurantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [recommendations, setRecommendation] = useState<
    RecommendationResponse[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const handleSubmit = async (e: FormEvent, promptOverride?: string) => {
    e.preventDefault();
    const query = promptOverride || input;
    if (!query.trim()) return;

    setChatStarted(true);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling getRecommendation with query:", query);
      const result = await getRecommendation(query);
      console.log("Received recommendation:", result);
      if (result && result.data && result.summary) {
        setRecommendation((prev) => [...prev, result]);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.summary },
        ]);
      } else {
        throw new Error("Invalid recommendation data received");
      }
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      {!chatStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-8 text-blue-600">BellyAI</h1>
          <div className="space-y-4 w-full max-w-md">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                className="w-full p-4 text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                onClick={(e) => handleSubmit(e, prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {recommendations.map((recommendation, index) => (
            <div key={index} className="mt-4">
              <RestaurantCard restaurant={recommendation.data} />
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a restaurant recommendation..."
          className="flex-1 p-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
}
