// Simple test to verify Jest setup
describe("Basic Test Setup", () => {
  it("should run basic tests", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve("test");
    expect(result).toBe("test");
  });

  it("should work with objects", () => {
    const obj = { name: "Test Game", price: 59.99 };
    expect(obj).toHaveProperty("name", "Test Game");
    expect(obj.price).toBeGreaterThan(0);
  });
});
