import { describe, it, expect } from "vitest";
import { greet } from "../src/index";

describe("greet function", () => {
  it("should return a greeting message", () => {
    expect(greet("Alice")).toBe("Hello, Alice!");
  });
});
