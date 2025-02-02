export type ChatStream = {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done_reason: string;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export type Chat = {
  id: string;
  role: string;
  content: string;
  parsedContent?: string;
  isDone: boolean;
  model?: string;
};
