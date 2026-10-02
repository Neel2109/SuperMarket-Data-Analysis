import { GoogleGenAI } from '@google/genai';
import { ChatMessage, SaleRecord } from '../types';

// Vite-safe environment loading: prefer VITE_GEMINI_API_KEY and fall back to legacy names.
const apiKey =
  (typeof import.meta !== 'undefined' && (import.meta.env as any).VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) ||
  (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__) ||
  '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function ensureGeminiClient() {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is missing. Add it to .env.local or set it before using AI features.');
  }
}

export type GeminiModelType = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

export const SYSTEM_INSTRUCTION = `You are a Senior Retail Business Intelligence Consultant & University Data Analytics Professor.
You specialize in Microsoft Power BI, DAX formulas, Star Schema data modeling, ETL via Power Query, and retail analytics.
You are helping a college student with their Supermarket Sales Data Analytics project.
Your responses should be:
1. Technically rigorous yet easy to understand for college presentations, project reports, and viva voce defense.
2. Provide exact Power BI DAX code with comments whenever formulas are discussed.
3. Provide practical business context (e.g., inventory turnover, customer acquisition, basket size economics).
4. When grounding or retail search is used, cite real-world retail industry standards (such as Walmart, Kroger, Target benchmarks).`;

export async function askGeminiChat(
  history: ChatMessage[],
  newMessage: string,
  model: GeminiModelType = 'gemini-3.5-flash',
  useSearchGrounding: boolean = false,
  datasetContextSummary?: string
): Promise<{ text: string; sources: { uri: string; title: string }[] }> {
  try {
    ensureGeminiClient();

    // Format conversation history for Gemini contents
    const contents: any[] = [];

    // System instruction or initial context
    let promptWithContext = newMessage;
    if (datasetContextSummary && history.length === 0) {
      promptWithContext = `[DATASET CONTEXT]:\n${datasetContextSummary}\n\n[STUDENT QUERY]:\n${newMessage}`;
    }

    // Map history to Gemini message format
    history.forEach((msg) => {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (useSearchGrounding) {
      // Force gemini-3.5-flash when Google Search is enabled as specified by guidelines
      model = 'gemini-3.5-flash';
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai!.models.generateContent({
      model: model,
      contents: contents,
      config: config,
    });

    const text = response.text || 'No response generated.';

    // Extract search grounding sources if available
    const sources: { uri: string; title: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri,
          });
        }
      });
    }

    return { text, sources };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      text: `Error generating response: ${error?.message || 'Unable to connect to Gemini API. Please check your API key.'}`,
      sources: [],
    };
  }
}

// 1-Click Comprehensive Project Insights Generation using gemini-3.1-pro-preview
export async function generateProjectInsights(kpiSummary: {
  totalSales: number;
  totalCogs: number;
  grossProfit: number;
  marginPercent: number;
  totalInvoices: number;
  aov: number;
  avgRating: number;
  topBranch: string;
  topProductLine: string;
}): Promise<string> {
  try {
    ensureGeminiClient();

    const prompt = `Perform an advanced, college-grade Data Analytics Review of this Supermarket Sales Project.
Metrics:
- Total Sales: $${kpiSummary.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Total COGS: $${kpiSummary.totalCogs.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Gross Profit: $${kpiSummary.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Gross Margin %: ${kpiSummary.marginPercent.toFixed(2)}%
- Total Transactions: ${kpiSummary.totalInvoices}
- Average Order Value (AOV): $${kpiSummary.aov.toFixed(2)}
- Average Customer Rating: ${kpiSummary.avgRating.toFixed(2)} / 10
- Highest Revenue Branch: ${kpiSummary.topBranch}
- Top Merchandise Category: ${kpiSummary.topProductLine}

Please provide:
1. Executive Performance Summary (3-4 bullet points for the project report abstract)
2. Anomaly & Risk Detection (Margin compression, branch variance, rating correlations)
3. 3 Prescriptive Business Recommendations
4. Two advanced DAX measures the student should highlight during their Viva examination to impress the professor.`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || 'No insights could be generated.';
  } catch (error: any) {
    console.error('Generate Insights Error:', error);
    return `Unable to generate automated insights at this time: ${error?.message}`;
  }
}

// Quick DAX Formula Generator using gemini-3.1-flash-lite
export async function generateCustomDAXFormula(description: string): Promise<string> {
  try {
    ensureGeminiClient();

    const prompt = `Write a production-ready Power BI DAX measure for the following requirement:
Requirement: "${description}"

Data Model:
- Fact Table: Fact_SupermarketSales (Columns: [Invoice ID], [Branch], [City], [Customer type], [Gender], [Product line], [Unit price], [Quantity], [Tax 5%], [Total], [Date], [Time], [Payment], [cogs], [gross margin percentage], [gross income], [Rating])
- Dimension Table: Dim_Date ([Date], [Year], [Month No], [Month Name], [Day Name], [Quarter])

Provide:
1. DAX Formula in code format
2. Step-by-step formula explanation
3. Which Power BI visual to use`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || 'Could not generate formula.';
  } catch (error: any) {
    console.error('DAX generator error:', error);
    return `Error: ${error?.message}`;
  }
}
