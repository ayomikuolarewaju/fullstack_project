export const validateUser = (userData) => {
  const { name, email, age } = userData;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (age && (isNaN(age) || age < 1 || age > 150)) {
    errors.push("Age must be a number between 1 and 150");
  }

  return errors.length > 0 ? errors : null;
};