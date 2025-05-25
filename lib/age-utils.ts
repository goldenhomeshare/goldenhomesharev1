/**
 * Calculate age range based on date of birth
 * Shows a range within 10 years (5 years on each side) of the actual age
 * Limited to a minimum of 18 and maximum show of 65+
 */
export function calculateAgeRange(dateOfBirth: string): string {
  if (!dateOfBirth) return 'Age not specified';
  
  try {
    const birthDate = new Date(dateOfBirth);
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      return 'Age not specified';
    }
    
    const today = new Date();
    
    // Calculate actual age
    const actualAge = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
    
    // Check if age is reasonable (between 0 and 150)
    if (actualAge < 0 || actualAge > 150) {
      return 'Age not specified';
    }
    
    // Calculate range (5 years on each side)
    let minAge = actualAge - 5;
    let maxAge = actualAge + 5;
    
    // Apply constraints
    minAge = Math.max(minAge, 18); // Minimum of 18
    
    // Handle 65+ case
    if (maxAge >= 65) {
      return minAge >= 65 ? '65+' : `${minAge}-65+`;
    }
    
    // Ensure minAge doesn't exceed maxAge after constraints
    if (minAge > maxAge) {
      minAge = maxAge;
    }
    
    return `${minAge}-${maxAge}`;
  } catch (error) {
    console.error('Error calculating age range:', error);
    return 'Age not specified';
  }
}

/**
 * Extract date of birth from lifestyle data
 */
export function extractDateOfBirth(lifestyle: any): string | null {
  if (!lifestyle) return null;
  
  try {
    const lifestyleData = typeof lifestyle === 'string' ? JSON.parse(lifestyle) : lifestyle;
    return lifestyleData.dateOfBirth || null;
  } catch {
    return null;
  }
} 