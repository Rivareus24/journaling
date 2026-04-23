export const PROMPTS = [
  "Cosa stai tenendo dentro da stamattina?",
  "Cosa hai notato oggi che di solito non noti?",
  "Di cosa avresti bisogno adesso?",
  "Cosa vorresti che qualcuno ti chiedesse oggi?",
  "Cosa ti ha sorpreso?",
  "Cosa stai evitando di pensare?",
  "A cosa stai dando troppa importanza in questo momento?",
  "Cosa ti ha fatto sentire vivo oggi?",
  "Di cosa sei grato, anche solo un po'?",
  "Cosa ti pesa e non hai ancora detto ad alta voce?",
  "Se potessi cambiare una cosa di oggi, quale sarebbe?",
  "Cosa ha occupato i tuoi pensieri più del solito?",
  "Con chi ti sei sentito più te stesso oggi?",
  "Cosa stai aspettando che succeda?",
  "Cosa vorresti ricordare di questo periodo tra dieci anni?",
  "Dove hai trovato un momento di pace oggi?",
  "Cosa ti ha rallentato, e per quale motivo?",
  "Qual è la cosa più piccola che ha fatto la differenza oggi?",
]

export function getRandomPrompt(): string {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
}
