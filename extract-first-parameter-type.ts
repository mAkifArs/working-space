// ============================================
// Extracting the First Parameter Type from a Function
// ============================================

// Note: For React types, you would import React in a .tsx file
// import * as React from "react";
// For this example file, we'll use type-only references

// ----------------------------
// 1. USING BUILT-IN UTILITY TYPES
// ----------------------------

// TypeScript has Parameters<T> that gets ALL parameters as a tuple
// Then we can get the first one with [0]

// Example function
function createUser(name: string, age: number, email: string): void {
  console.log(`Creating user: ${name}, ${age}, ${email}`);
}

// Get ALL parameters as a tuple
type AllParams = Parameters<typeof createUser>;
// Result: [string, number, string]

// Get the FIRST parameter type
type FirstParam = Parameters<typeof createUser>[0];
// Result: string ✅

// ----------------------------
// 2. PRACTICAL EXAMPLE: REACT EVENT HANDLERS
// ----------------------------

// You have a function that handles click events
// In a real React app, you'd import React and use React.MouseEvent
// For this example, we'll use a simplified type
type MouseEvent = {
  clientX: number;
  clientY: number;
  preventDefault(): void;
};

function handleClick(event: MouseEvent): void {
  console.log("Clicked!", event.clientX, event.clientY);
}

// Extract the event type
type ClickEventType = Parameters<typeof handleClick>[0];
// Result: MouseEvent

// Now you can reuse this type
function anotherHandler(event: ClickEventType): void {
  // TypeScript knows event is MouseEvent
  console.log(event.clientX);
}

// ----------------------------
// 3. API CALL FUNCTIONS
// ----------------------------

// Function that fetches user data
async function fetchUser(
  userId: number,
  includeProfile: boolean
): Promise<User> {
  const url = `/api/users/${userId}?profile=${includeProfile}`;
  const response = await fetch(url);
  return response.json();
}

// Extract the first parameter (userId type)
type UserIdType = Parameters<typeof fetchUser>[0];
// Result: number ✅

// Use it to create a type-safe wrapper
function validateUserId(id: UserIdType): boolean {
  return typeof id === "number" && id > 0;
}

// ----------------------------
// 4. CUSTOM UTILITY TYPE (More Advanced)
// ----------------------------

// Create a reusable utility type
type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0];

// Now you can use it easily:
type FirstParam1 = FirstParameter<typeof createUser>; // string
type FirstParam2 = FirstParameter<typeof fetchUser>; // number
type FirstParam3 = FirstParameter<typeof handleClick>; // React.MouseEvent<...>

// ----------------------------
// 5. REAL-WORLD REACT EXAMPLE
// ----------------------------

// You have a form handler
type FormEvent = {
  preventDefault(): void;
  target: HTMLFormElement;
};

function handleSubmit(event: FormEvent, formData: FormData): void {
  event.preventDefault();
  // Process form...
}

// Extract the event type
type FormEventType = Parameters<typeof handleSubmit>[0];
// Result: FormEvent

// Extract the formData type
type FormDataType = Parameters<typeof handleSubmit>[1];
// Result: FormData

// Use in another component
function MyForm() {
  const handleFormSubmit = (event: FormEventType, data: FormDataType) => {
    // TypeScript knows the exact types!
    event.preventDefault();
    console.log(data);
  };

  // In a real React app, you'd use JSX:
  // return <form onSubmit={(e) => handleFormSubmit(e, new FormData())}>...</form>;
  return null; // Simplified for example
}

// ----------------------------
// 6. CALLBACK FUNCTIONS
// ----------------------------

// Library function that takes a callback
function processData(
  data: string[],
  callback: (item: string, index: number) => void
): void {
  data.forEach(callback);
}

// Extract the callback's first parameter type
type CallbackFirstParam = Parameters<Parameters<typeof processData>[1]>[0];
// Breaking it down:
// 1. Parameters<typeof processData> = [string[], (item: string, index: number) => void]
// 2. [1] = (item: string, index: number) => void (the callback)
// 3. Parameters<...> = [string, number] (callback's parameters)
// 4. [0] = string (first parameter of callback)
// Result: string ✅

// ----------------------------
// 7. EXTRACTING MULTIPLE PARAMETERS
// ----------------------------

function complexFunction(
  id: number,
  name: string,
  options: { active: boolean; role: string }
): void {
  // ...
}

// Get first parameter
type First = Parameters<typeof complexFunction>[0]; // number

// Get second parameter
type Second = Parameters<typeof complexFunction>[1]; // string

// Get third parameter
type Third = Parameters<typeof complexFunction>[2]; // { active: boolean; role: string }

// ----------------------------
// 8. WITH GENERIC FUNCTIONS
// ----------------------------

function identity<T>(value: T): T {
  return value;
}

// For generic functions, you need to specify the type
type IdentityFirstParam<T> = Parameters<typeof identity<T>>[0];
// But this is tricky - better to use the generic directly

// More practical: Extract from a specific usage
const stringIdentity = identity<string>;
type StringIdentityParam = Parameters<typeof stringIdentity>[0]; // string

// ----------------------------
// 9. PRACTICAL USE CASE: TYPE-SAFE WRAPPERS
// ----------------------------

// Original function
function saveUser(user: { id: number; name: string; email: string }): void {
  // Save to database
}

// Extract the user type
type UserType = Parameters<typeof saveUser>[0];
// Result: { id: number; name: string; email: string }

// Create a validation wrapper
function validateAndSave(user: UserType): void {
  // Validate user before saving
  if (!user.email.includes("@")) {
    throw new Error("Invalid email");
  }
  saveUser(user); // Type-safe!
}

// ----------------------------
// 10. COMPLETE EXAMPLE: REACT HOOK
// ----------------------------

// You have a custom hook
function useUserData(userId: number, options?: { includeProfile: boolean }) {
  // Fetch user data
  return { user: null, loading: false };
}

// Extract the first parameter type
type UserIdParam = Parameters<typeof useUserData>[0]; // number

// Extract the second parameter type
type OptionsParam = Parameters<typeof useUserData>[1];
// Result: { includeProfile: boolean } | undefined

// Use in a component
function UserProfile() {
  const userId: UserIdParam = 123; // Type-safe!
  const { user, loading } = useUserData(userId);
  // In a real React app, you'd return JSX:
  // return <div>...</div>;
  return null; // Simplified for example
}

// ----------------------------
// SUMMARY
// ----------------------------

// To get the first parameter type of a function:
// Parameters<typeof functionName>[0]

// Examples:
// function example(a: string, b: number) {}
// type First = Parameters<typeof example>[0]; // string
// type Second = Parameters<typeof example>[1]; // number

// This is useful for:
// - Creating type-safe wrappers
// - Reusing types from existing functions
// - Building generic utilities
// - Type inference in React components

// Helper types for reference
interface User {
  id: number;
  name: string;
  email: string;
}

export {};
