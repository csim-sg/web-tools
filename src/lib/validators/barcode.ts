'use server';

export const validateEAN13 = async (value: string) => {
  return /^\d{12,13}$/.test(value);
};

export const validateCode128 = async (value: string) => {
  return /^[\x20-\x7F]+$/.test(value);
};