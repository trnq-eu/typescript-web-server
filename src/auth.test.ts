import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });
});

describe("JWT Functions", () => {
    const secret = "test-secret";
    const userID = "user123";
    const expiresIn = 3600;
    let token: string;

    beforeAll(() => {
        token = makeJWT(userID, expiresIn, secret);
    });

    it("should create a valid JWT token", () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    });

    it("should validate a correct JWT token", () => {
    const result = validateJWT(token, secret);
    expect(result).toBe(userID);
    });

    it("should reject JWT with Invalid token payload", () => {
    expect(() => {
      validateJWT(token, "Invalid token payload");
    }).toThrow();
    });

    it("should reject expired JWT", () => {
    const expiredToken = makeJWT(userID, -1, secret); // Already expired
    expect(() => {
      validateJWT(expiredToken, secret);
    }).toThrow();
    });


})