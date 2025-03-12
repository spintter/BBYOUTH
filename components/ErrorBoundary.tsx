'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex items-center justify-center bg-black text-white"
          role="alert"
          aria-label="Error: 3D experience failed to load. Displaying fallback content."
        >
          <div className="text-center p-8 max-w-lg">
            <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto mb-6" aria-label="Static chessboard with pawn-to-queen transformation">
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => {
                  const isBlack = (row + col) % 2 === 1;
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={col * 37.5}
                      y={row * 37.5}
                      width="37.5"
                      height="37.5"
                      fill={isBlack ? '#222222' : '#EEEEEE'}
                    />
                  );
                })
              )}
              <circle cx="150" cy="225" r="15" fill="#FFD700" className="pawn">
                <animate attributeName="cy" from="225" to="75" dur="3s" repeatCount="1" fill="freeze" />
                <animate attributeName="r" from="15" to="20" dur="3s" repeatCount="1" fill="freeze" />
              </circle>
              <path d="M150 50 C 120 20, 100 50, 100 80 C 100 110, 150 140, 150 140 C 150 140, 200 110, 200 80 C 200 50, 180 20, 150 50 Z" fill="none" stroke="#FFD700" strokeWidth="5" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">3D Experience Not Available</h2>
            <p className="text-gray-300 mb-6">Your device doesn’t support WebGL, or an error occurred. Explore our journey through this static chessboard—symbolizing transformation from potential to leadership.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              aria-label="Refresh the page to try again"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; // Ensure default export