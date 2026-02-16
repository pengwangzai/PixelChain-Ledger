
import { GoogleGenAI } from "@google/genai";
import { GlobalState, AIProvider } from "./types";

const SYSTEM_INSTRUCTION = `你是一名赛博朋克风格的财务黑客顾问。
你的语言风格必须包含：财富哈希率、能量护盾状态、矿井开采效率、流动性枯竭、黑天鹅波动、资产格式化、节点负载、加密协议等术语。
例如："检测到零系统负载。财富哈希率爆表，投资池极速运转；但能量护盾仅10%负载，防御极度脆弱。"
请根据用户提供的资产数据，输出一段100字以内的中文分析报告。`;

export async function getFinancialAdvice(state: GlobalState) {
  const { ai: aiSettings } = state.user;
  
  const liquidTotal = state.blocks.reduce((s, b) => s + b.balance, 0);
  const investmentTotal = state.tradingPit.reduce((s, i) => s + (i.currentValue * i.quantity), 0);
  const mineTotal = state.mines.reduce((s, m) => s + m.currentAmount, 0);
  const shieldIntegrity = state.shield.emergencyGoal !== 0 ? (state.shield.emergencyFund / state.shield.emergencyGoal) * 100 : 0;
  const debtTotal = state.shield.debts.reduce((s, d) => s + d.amount, 0);

  const prompt = `分析以下数据：
- 流动资产: ${liquidTotal}
- 投资总市值: ${investmentTotal}
- 长期矿产积累: ${mineTotal}
- 护盾能量(应急金): ${shieldIntegrity.toFixed(1)}%
- 系统漏洞(债务): ${debtTotal}
`;

  try {
    // 1. Gemini Implementation (Internal)
    if (aiSettings.provider === AIProvider.GEMINI) {
      // Fix: Exclusively use process.env.API_KEY as per GenAI coding guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: aiSettings.model || "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      // Fix: Ensure property access for .text instead of method call
      return response.text;
    }

    // 2. OpenAI Compatible APIs (DeepSeek, Kimi, etc.)
    const baseUrl = aiSettings.baseUrl || 
      (aiSettings.provider === AIProvider.DEEPSEEK ? "https://api.deepseek.com/v1" : 
       aiSettings.provider === AIProvider.KIMI ? "https://api.moonshot.cn/v1" : 
       aiSettings.provider === AIProvider.DOUBAO ? "https://ark.cn-beijing.volces.com/api/v3" : "");

    if (!baseUrl || !aiSettings.apiKey) {
      return "警告: AI节点配置缺失。请在个人中心配置 API_KEY 及 ENDPOINT。";
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aiSettings.apiKey}`
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Remote Node Error");
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return "警告: 顾问模块哈希频率受限 [QUOTA_EXHAUSTED]。请检查节点余额或稍后重试。";
    }
    return `连接中断 [${error.message || 'UNKNOWN_ERR'}]。正在重新尝试握手...`;
  }
}
