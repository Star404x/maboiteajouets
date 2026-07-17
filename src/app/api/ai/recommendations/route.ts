import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { productName, category, budget } = await req.json();

    const prompt = `Tu es un conseiller produits expert pour une boutique de jouets pour enfants.
    
L'utilisateur regarde: ${productName} (Catégorie: ${category})
Budget: ${budget}€

Fournis 3-4 recommandations de produits SIMILAIRES ou COMPLÉMENTAIRES de la même boutique.
Sois bref, persuasif et naturel en français.
Format: "Nous recommandons aussi: [liste]"`;

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
      maxTokens: 200,
    });

    return Response.json({
      recommendations: result.text,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
      },
    });
  } catch (error) {
    console.error("AI Gateway error:", error);
    return Response.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
