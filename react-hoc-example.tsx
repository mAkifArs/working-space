// ============================================
// React Higher-Order Component (HOC) Example
// ============================================
// This demonstrates how HOCs work, similar to higher-order functions

import React, { ComponentType } from 'react';

// ----------------------------
// 1. BASIC HOC PATTERN
// ----------------------------

// A HOC is a function that takes a component and returns a new component
// Similar to: function mapArray<T, U>(arr: T[], transformer: Transformer<T, U>)

// Example: HOC that adds loading state
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & { isLoading?: boolean }> {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Usage:
interface UserProps {
  name: string;
  email: string;
}

const UserProfile: React.FC<UserProps> = ({ name, email }) => (
  <div>
    <h1>{name}</h1>
    <p>{email}</p>
  </div>
);

// Enhance the component with loading functionality
const UserProfileWithLoading = withLoading(UserProfile);

// Now you can use it:
// <UserProfileWithLoading name="John" email="john@example.com" isLoading={true} />

// ----------------------------
// 2. HOC WITH DATA FETCHING
// ----------------------------

// HOC that fetches data and passes it as props
function withUserData<P extends object>(
  WrappedComponent: ComponentType<P & { user: { id: number; name: string } }>
): ComponentType<P & { userId: number }> {
  return function WithUserDataComponent(props: P & { userId: number }) {
    const [user, setUser] = React.useState<{ id: number; name: string } | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      // Simulate API call
      fetch(`/api/users/${props.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        });
    }, [props.userId]);

    if (loading) return <div>Loading user...</div>;
    if (!user) return <div>User not found</div>;

    const { userId, ...restProps } = props;
    return <WrappedComponent {...(restProps as P)} user={user} />;
  };
}

// ----------------------------
// 3. HOC WITH AUTHENTICATION
// ----------------------------

// HOC that protects routes - redirects if not authenticated
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return function WithAuthComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [checking, setChecking] = React.useState(true);

    React.useEffect(() => {
      // Check authentication
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setChecking(false);
    }, []);

    if (checking) return <div>Checking authentication...</div>;
    if (!isAuthenticated) {
      // Redirect to login (in real app, use React Router)
      return <div>Please log in</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

// ----------------------------
// 4. COMPOSING MULTIPLE HOCs
// ----------------------------

// You can combine multiple HOCs (similar to function composition)
const ProtectedUserProfile = withAuth(withLoading(UserProfile));

// Or use a compose utility function (like Redux does)
function compose(...funcs: Array<(component: ComponentType<any>) => ComponentType<any>>) {
  return (component: ComponentType<any>) =>
    funcs.reduceRight((acc, func) => func(acc), component);
}

const EnhancedUserProfile = compose(withAuth, withLoading)(UserProfile);

// ----------------------------
// 5. MODERN ALTERNATIVE: CUSTOM HOOKS
// ----------------------------

// Modern React prefers custom hooks over HOCs for most use cases
function useUserData(userId: number) {
  const [user, setUser] = React.useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading };
}

// Usage with hooks (cleaner than HOC):
const UserProfileComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const { user, loading } = useUserData(userId);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
};

// ----------------------------
// KEY DIFFERENCES: HOC vs Higher-Order Functions
// ----------------------------

// Higher-Order Function (from your lesson):
// - Takes a function, returns a function
// - Works with data transformation
function mapArray<T, U>(arr: T[], transformer: (value: T) => U): U[] {
  return arr.map(transformer);
}

// Higher-Order Component:
// - Takes a component, returns a component
// - Works with component enhancement
function withFeature<P>(Component: ComponentType<P>): ComponentType<P & { feature: boolean }> {
  return (props) => <Component {...props} />;
}

// Both follow the same pattern: function that takes X, returns enhanced X

export { withLoading, withUserData, withAuth, useUserData };

