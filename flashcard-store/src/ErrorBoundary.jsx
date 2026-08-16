import { Component } from "react";

// A render crash anywhere below this (e.g. malformed data pulled out of
// localStorage) used to unmount the entire app to a blank page. Catch it
// and show something recoverable instead.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-2xl mb-3">Something went wrong.</h1>
          <p className="text-ink/60 text-sm mb-6">
            This section couldn't be displayed. Reloading the page usually fixes it.
          </p>
          <button
            className="border border-ink/20 rounded-full px-4 py-2 text-sm hover:border-ink/45 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
