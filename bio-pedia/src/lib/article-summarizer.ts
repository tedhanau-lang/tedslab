import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Extract plain text from HTML string
 */
export function extractTextFromHtml(html: string): string {
  return (
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
      .replace(/<[^>]*>/g, " ") // Remove all HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, " ") // Collapse whitespace
      .trim()
  );
}

/**
 * Generate a concise summary of an article using Claude
 * @param title - Article title
 * @param content - Article content (can be HTML or plain text)
 * @param maxLength - Maximum length of summary in words (default: 150)
 */
export async function summarizeArticle(
  title: string,
  content: string,
  maxLength: number = 150
): Promise<string> {
  try {
    // Extract text from HTML if needed
    const plainText =
      content.includes("<") && content.includes(">")
        ? extractTextFromHtml(content)
        : content;

    // Limit input to first 5000 characters to avoid token limits
    const truncatedContent = plainText.substring(0, 5000);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Please provide a concise summary of the following article in approximately ${maxLength} words. The summary should be clear, informative, and suitable for a student learning platform. Focus on the key concepts and main takeaways.

Article Title: ${title}

Content:
${truncatedContent}

Provide only the summary without any additional commentary or formatting.`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text.trim();
    }

    return "";
  } catch (error) {
    console.error("Error summarizing article:", error);
    throw error;
  }
}

/**
 * Generate key points/bullet points from an article
 * @param title - Article title
 * @param content - Article content (can be HTML or plain text)
 * @param numPoints - Number of key points to extract (default: 5)
 */
export async function extractKeyPoints(
  title: string,
  content: string,
  numPoints: number = 5
): Promise<string[]> {
  try {
    const plainText =
      content.includes("<") && content.includes(">")
        ? extractTextFromHtml(content)
        : content;

    const truncatedContent = plainText.substring(0, 5000);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Extract ${numPoints} key points from the following article. Format each point as a single line. These are for a student learning platform.

Article Title: ${title}

Content:
${truncatedContent}

Provide only the key points, one per line, without numbering or bullet symbols.`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text
        .split("\n")
        .map((point) => point.trim())
        .filter((point) => point.length > 0);
    }

    return [];
  } catch (error) {
    console.error("Error extracting key points:", error);
    throw error;
  }
}

/**
 * Generate a brief one-sentence summary
 * @param title - Article title
 * @param content - Article content (can be HTML or plain text)
 */
export async function generateOneSentenceSummary(
  title: string,
  content: string
): Promise<string> {
  try {
    const plainText =
      content.includes("<") && content.includes(">")
        ? extractTextFromHtml(content)
        : content;

    const truncatedContent = plainText.substring(0, 3000);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Provide a single clear sentence that summarizes the main point of this article. The sentence should be suitable for a student learning platform.

Article Title: ${title}

Content:
${truncatedContent}

Provide only the sentence without any additional commentary.`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text.trim();
    }

    return "";
  } catch (error) {
    console.error("Error generating one-sentence summary:", error);
    throw error;
  }
}
