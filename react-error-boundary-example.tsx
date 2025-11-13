// ============================================
// React Error Boundary Example
// ============================================
// This is THE main reason classes are still needed in React

import React from "react";

// ----------------------------
// ERROR BOUNDARY (MUST BE A CLASS!)
// ----------------------------

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method is ONLY available in class components
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  // This lifecycle method is ONLY available in class components
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error("Error caught by boundary:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default
      return (
        this.props.fallback || (
          <div style={{ padding: "20px", border: "1px solid red" }}>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// ----------------------------
// COMPONENT THAT MIGHT CRASH
// ----------------------------

interface UserProfileProps {
  userId: number;
}

function UserProfile({ userId }: UserProfileProps) {
  // This might throw an error
  const user = getUserById(userId); // Could throw if user not found

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ----------------------------
// USAGE IN APP
// ----------------------------

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Custom error message</div>}
      onError={(error, errorInfo) => {
        // Send to error tracking service (Sentry, LogRocket, etc.)
        console.log("Sending to error service:", error);
      }}
    >
      <UserProfile userId={123} />
      {/* If UserProfile crashes, ErrorBoundary catches it */}
    </ErrorBoundary>
  );
}

// ----------------------------
// WHY NO HOOK ALTERNATIVE?
// ----------------------------

// ❌ This doesn't exist - React doesn't have error boundary hooks
// function useErrorBoundary() {
//   // No such hook!
// }

// ✅ You MUST use a class component for Error Boundaries
// This is a React limitation, not a TypeScript limitation

// ----------------------------
// HELPER FUNCTION (for demo)
// ----------------------------

interface User {
  id: number;
  name: string;
  email: string;
}

function getUserById(id: number): User | null {
  // Simulate API call
  if (id === 999) {
    return null; // User not found - will cause error
  }
  return {
    id,
    name: "John Doe",
    email: "john@example.com",
  };
}

export { ErrorBoundary, UserProfile, App };
