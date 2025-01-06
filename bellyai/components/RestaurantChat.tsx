"use client";

import { useState, FormEvent } from "react";
import { getRecommendation } from "../app/actions/getRecommendation";
import { RecommendationResponse } from "@/types/restaurant";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with input:", input);

    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling getRecommendation with query:", input);
      const result = await getRecommendation(input);
      console.log("Received recommendation:", result);
      if (result && result.data && result.summary) {
        setRecommendation(result);
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
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
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
        {recommendation && recommendation.data && (
          <div className="mb-4">
            <RestaurantCard restaurant={recommendation.data} />
          </div>
        )}
      </div>
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
