import React from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";

// Define the fallback UI component
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <h1>Something went wrong:</h1>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};

// Define the ErrorBoundary component that accepts a render function
interface ErrorBoundaryProps {
  render: React.ReactNode; // A render prop function that returns a JSX element
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ render }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {render} {/* Call the render function */}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
