const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5001/api/:path*',  // Proxy to Flask backend
        },
      ];
    },
  };
  
  export default nextConfig;