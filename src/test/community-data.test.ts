import { describe, expect, it } from "vitest";
import { visibleInventory } from "@/lib/community-data";
describe("Inventory privacy", () => {
  it("hides a private inventory from other players", () => {
    expect(visibleInventory(false, false)).toBe(false);
  });
  it("shows an inventory explicitly made public", () => {
    expect(visibleInventory(false, true)).toBe(true);
  });
  it("allows the owner to see their private inventory", () => {
    expect(visibleInventory(true, false)).toBe(true);
  });
});
