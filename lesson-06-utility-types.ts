// ============================================
// LESSON 6: Utility Types and Advanced Types
// ============================================

// TypeScript provides many built-in utility types to transform types

// ----------------------------
// 1. UNION TYPES
// ----------------------------

// A value can be one of several types
type StringOrNumber = string | number;

function processValue(value: StringOrNumber): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}

// Multiple unions
type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

// ----------------------------
// 2. INTERSECTION TYPES
// ----------------------------

// Combines multiple types into one
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type PersonEmployee = Person & Employee;

const personEmployee: PersonEmployee = {
  name: "John",
  age: 30,
  employeeId: 123,
  department: "Engineering",
};

// ----------------------------
// 3. TYPE GUARDS
// ----------------------------

// Functions that help TypeScript narrow types

// typeof guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// instanceof guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

function isDog(value: unknown): value is Dog {
  return value instanceof Dog;
}

// Custom type guard
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

// ----------------------------
// 4. BUILT-IN UTILITY TYPES
// ----------------------------

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Partial<T> - Makes all properties optional
type PartialUser = Partial<User>;
const partialUser: PartialUser = {
  name: "John",
  // All other properties are optional
};

// Required<T> - Makes all properties required (opposite of Partial)
type RequiredUser = Required<PartialUser>;

// Readonly<T> - Makes all properties readonly
type ReadonlyUser = Readonly<User>;
const readonlyUser: ReadonlyUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  age: 30,
  isActive: true,
};
// readonlyUser.name = "Jane"; // Error! Property is readonly

// Pick<T, K> - Select specific properties
type UserNameAndEmail = Pick<User, "name" | "email">;
const nameAndEmail: UserNameAndEmail = {
  name: "John",
  email: "john@example.com",
};

// Omit<T, K> - Remove specific properties
type UserWithoutEmail = Omit<User, "email">;
const userWithoutEmail: UserWithoutEmail = {
  id: 1,
  name: "John",
  age: 30,
  isActive: true,
};

// Record<K, T> - Create object type with specific keys and values
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  user1: "admin",
  user2: "user",
  user3: "guest",
};

// ----------------------------
// 5. EXTRACT AND EXCLUDE
// ----------------------------

type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

// Extract - Get types that are assignable to a type
type ActiveStatus = Extract<ApprovalStatus, "approved" | "pending">; // "approved" | "pending"

// Exclude - Remove types that are assignable to a type
type InactiveStatus = Exclude<ApprovalStatus, "approved" | "pending">; // "rejected" | "cancelled"

// ----------------------------
// 6. NONNULLABLE
// ----------------------------

type MaybeString = string | null | undefined;

// Remove null and undefined
type DefiniteString = NonNullable<MaybeString>; // string

// ----------------------------
// 7. PARAMETERS AND RETURN TYPE
// ----------------------------

function createUser(name: string, age: number, email: string): User {
  return {
    id: Math.random(),
    name,
    age,
    email,
    isActive: true,
  };
}

// Extract parameter types
type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]

// Extract return type
type CreateUserReturn = ReturnType<typeof createUser>; // User

// ----------------------------
// 8. TYPE ASSERTIONS
// ----------------------------

// Sometimes you know more about a type than TypeScript

// Angle bracket syntax (not available in .tsx files)
const value1 = "hello" as unknown;
const str1 = value1 as string;

// As syntax (preferred)
const value2: unknown = "hello";
const str2 = value2 as string;

// Type assertion with type guard
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value is not a string");
  }
}

const unknownValue: unknown = "hello";
assertIsString(unknownValue);
// Now TypeScript knows unknownValue is a string
console.log(unknownValue.toUpperCase()); // Works!

// ----------------------------
// 9. LITERAL TYPES
// ----------------------------

// Specific string or number values as types
type Direction = "up" | "down" | "left" | "right";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

move("up"); // OK
// move("diagonal"); // Error!

// ----------------------------
// 10. TEMPLATE LITERAL TYPES
// ----------------------------

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = `/api/${string}`;
type FullEndpoint = `${HttpMethod} ${ApiEndpoint}`;

const endpoint: FullEndpoint = "GET /api/users"; // OK
// const badEndpoint: FullEndpoint = "GET /users"; // Error!

// ----------------------------
// 11. INDEXED ACCESS TYPES
// ----------------------------

type UserName = User["name"]; // string
type UserId = User["id"]; // number

// Get all property types
type UserPropertyTypes = User[keyof User]; // string | number | boolean

// ----------------------------
// 12. PRACTICAL EXAMPLE: Form State
// ----------------------------

interface FormData {
  username: string;
  email: string;
  age: number;
  agreeToTerms: boolean;
}

// Create a type for form errors (all fields optional, all string)
type FormErrors = Partial<Record<keyof FormData, string>>;

// Create a type for form state (all fields optional, can be touched)
type FormState = {
  values: Partial<FormData>;
  errors: FormErrors;
  touched: Partial<Record<keyof FormData, boolean>>;
  isSubmitting: boolean;
};

const formState: FormState = {
  values: {
    username: "john",
    email: "john@example.com",
  },
  errors: {
    age: "Age is required",
  },
  touched: {
    username: true,
    email: true,
  },
  isSubmitting: false,
};

// ----------------------------
// EXERCISES
// ----------------------------

// 1. Create a type that makes all properties of User optional except 'id'
type userType = Pick<User, "id"> & Partial<Omit<User, "id">>;
// 2. Create a type that extracts only string properties from an interface

type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

// First, let's create a utility type that extracts only string properties
// This uses mapped types with conditional types

// Now apply it to an interface
interface Friends {
  names: string;
  ages: number;
  university: string;
  from: string;
}

// Extract only string properties from Friends
type StringsOfFriends = StringProperties<Friends>;
// Result: { names: string; university: string; from: string }
// Note: 'ages' is excluded because it's a number

// Usage example:
const friendStrings: StringsOfFriends = {
  names: "Alice, Bob",
  university: "MIT",
  from: "USA",
  // ages: 25, // ❌ Error! 'ages' is not a string property
};

// Apply to User interface as well
type UserStringProperties = StringProperties<User>;
// Result: { name: string; email: string }
// Note: id (number), age (number), isActive (boolean) are excluded

// HOW IT WORKS:
// 1. [K in keyof T] - iterate over all keys of T
// 2. as T[K] extends string ? K : never - if the property type extends string, keep the key, otherwise use 'never' (exclude it)
// 3. T[K] - the value type (which we know is string for the kept properties)

// 3. Write a type guard function for checking if a value is a number array

function guardNumArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

// 4. Create a utility type that makes a type nullable: Nullable<T>

// Utility type that makes any type nullable (adds null to the type)
type Nullable<T> = T | null;

// Usage examples:
type NullableString = Nullable<string>; // string | null
type NullableNumber = Nullable<number>; // number | null
type NullableUser = Nullable<User>; // User | null

// Practical examples:
const maybeString: NullableString = "hello"; // ✅ Can be a string
const maybeString2: NullableString = null; // ✅ Can be null
// const maybeString3: NullableString = undefined; // ❌ Error! undefined is not allowed

const maybeUser: NullableUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  age: 30,
  isActive: true,
}; // ✅ Can be a User object
const maybeUser2: NullableUser = null; // ✅ Can be null

// Common use case: API responses that might return null
function fetchUser(id: number): Nullable<User> {
  // Simulate API call
  if (id > 0) {
    return {
      id,
      name: "John",
      email: "john@example.com",
      age: 30,
      isActive: true,
    };
  }
  return null; // User not found
}

const user = fetchUser(1);
if (user !== null) {
  // TypeScript knows user is User (not null) here
  console.log(user.name); // ✅ Works!
} else {
  console.log("User not found");
}

// NOTE: Nullable<T> is similar to T | null
// The difference is that Nullable is a reusable utility type
// You could also write: type MaybeUser = User | null (same result)

// Make this file a module to avoid global scope conflicts
export {};
