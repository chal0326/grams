export interface TelegramGroup {
  id: string;  // Changed to string as Telegram's BigInt IDs are often represented as strings
  title: string;
}

export interface SendMessageRequest {
  message: string;
  groupIds: string[];  // Changed to string[] to match the TelegramGroup id type
}

