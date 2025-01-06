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

type ChatItem =
  | { type: "message"; role: "user" | "assistant"; content: string }
  | { type: "recommendation"; data: RecommendationResponse };

export default function RestaurantChat() {
  const [input, setInput] = useState("");
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const handleSubmit = async (e: FormEvent, promptOverride?: string) => {
    e.preventDefault();
    const query = promptOverride || input;
    if (!query.trim()) return;

    setChatStarted(true);
    setChatItems((prev) => [
      ...prev,
      { type: "message", role: "user", content: query },
    ]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling getRecommendation with query:", query);
      const result = await getRecommendation(query);
      console.log("Received recommendation:", result);
      if (result && result.data && result.summary) {
        setChatItems((prev) => [
          ...prev,
          { type: "message", role: "assistant", content: result.summary },
          { type: "recommendation", data: result },
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
          {chatItems.map((item, index) => (
            <div key={index}>
              {item.type === "message" && (
                <div
                  className={`${
                    item.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      item.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.content}
                  </span>
                </div>
              )}
              {item.type === "recommendation" && (
                <div className="mt-2">
                  <RestaurantCard restaurant={item.data.data} />
                </div>
              )}
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
