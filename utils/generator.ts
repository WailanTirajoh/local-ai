import { ulid } from "ulid";

export function generateULID(): string {
  return ulid();
}
