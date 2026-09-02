import { json } from "@tanstack/react-start";
import {
  summarizeArticle,
  extractKeyPoints,
  generateOneSentenceSummary,
} from "./article-summarizer";

/**
 * Server action to summarize an article
 * Called from client-side components
 */
export async function getSummary(
  title: string,
  content: string,
  maxLength: number = 150
): Promise<string> {
  try {
    const summary = await summarizeArticle(title, content, maxLength);
    return summary;
  } catch (error) {
    console.error("Error in getSummary:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
}

/**
 * Server action to extract key points from an article
 */
export async function getKeyPoints(
  title: string,
  content: string,
  numPoints: number = 5
): Promise<string[]> {
  try {
    const points = await extractKeyPoints(title, content, numPoints);
    return points;
  } catch (error) {
    console.error("Error in getKeyPoints:", error);
    throw new Error("Failed to extract key points. Please try again later.");
  }
}

/**
 * Server action to generate a one-sentence summary
 */
export async function getOneSentenceSummary(
  title: string,
  content: string
): Promise<string> {
  try {
    const summary = await generateOneSentenceSummary(title, content);
    return summary;
  } catch (error) {
    console.error("Error in getOneSentenceSummary:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
}
