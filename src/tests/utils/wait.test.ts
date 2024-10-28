import wait from "@utils/wait";

describe("wait", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should resolve after the specified timeout", async () => {
    const timeout = 1000;
    const waitPromise = wait(timeout);

    // Fast-forward time
    jest.advanceTimersByTime(timeout);

    // Assert that the promise resolves without timing out the test
    await expect(waitPromise).resolves.toBeUndefined();
  });
});
