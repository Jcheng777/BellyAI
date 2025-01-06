/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['s3-media1.fl.yelpcdn.com', 's3-media2.fl.yelpcdn.com'], // Add the required domain here
  },
};

export default nextConfig;
