import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level safety net. Without this, an uncaught render error (e.g. a missing
 * prop in a deeply nested component) unmounts the whole app to a blank white
 * screen with no recovery. This shows a recoverable fallback instead.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for debugging; in production this could go to a monitoring service.
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center bg-white">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E]/5 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl font-bold text-[#1A1A2E]">
              Something went wrong
            </p>
            <p className="text-sm text-[#1A1A2E]/50 max-w-sm">
              An unexpected error occurred. Please try again or return to the
              homepage.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="btn-dark px-6 py-3 text-sm"
            >
              Try again
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-6 py-3 text-sm font-semibold text-[#1A1A2E]/60 border border-[#1A1A2E]/15 hover:text-[#1A1A2E] transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
