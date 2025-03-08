interface EnvConfig {
  google: {
    tagManager: string
  },
  api: {
    exchangeRate: string;
    translation: string;
    imageProcessing: string;
    barcode: string;
    pdf: string;
  };
  services: {
    redis: string;
    postgres: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const env: EnvConfig = {
  google: {
    tagManager: getEnvVar('NEXT_PUBLIC_TAG_MANAGER_KEY', ''),
  },
  api: {
    exchangeRate: getEnvVar('NEXT_PUBLIC_EXCHANGE_RATE_API_URL', 'https://api.exchangerate-api.com/v4'),
    translation: getEnvVar('NEXT_PUBLIC_TRANSLATION_API_URL', 'https://translation-api.example.com'),
    imageProcessing: getEnvVar('NEXT_PUBLIC_IMAGE_PROCESSING_API_URL', 'https://api.cloudinary.com/v1'),
    barcode: getEnvVar('NEXT_PUBLIC_BARCODE_API_URL', 'https://barcode-api.example.com'),
    pdf: getEnvVar('NEXT_PUBLIC_PDF_API_URL', 'https://pdf-api.example.com'),
  },
  services: {
    redis: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
    postgres: getEnvVar('POSTGRES_URL', 'postgresql://user:password@localhost:5432/webtools'),
  },
  auth: {
    jwtSecret: getEnvVar('JWT_SECRET', 'your-secret-key'),
    jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  },
}; 