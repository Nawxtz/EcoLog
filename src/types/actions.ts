export interface ActionItem {
  id: string;
  name: string;
  co2Saved: number;
}

export interface GoalMultiplier {
  rate: number;
  period: "daily" | "weekly" | "monthly";
}

export interface PutActionPayload {
  items: ActionItem[];
  goalMultiplier?: GoalMultiplier;
}
