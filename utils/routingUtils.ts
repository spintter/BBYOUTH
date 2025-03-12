/**
 * Utility functions for routing between the 3D chessboard and humanities pages
 */

import { HUMANITIES } from '../components/KnowledgeIsPowerHero';

/**
 * Navigate to a humanities subject page
 * @param subjectId The ID of the subject to navigate to
 * @param router Next.js router instance (optional)
 */
export function navigateToSubject(subjectId: string, router?: any) {
  // If we have a router instance, use it for client-side navigation
  if (router) {
    router.push(`/humanities/${subjectId}`);
    return;
  }
  
  // Fallback to window.location for direct navigation
  if (typeof window !== 'undefined') {
    window.location.href = `/humanities/${subjectId}`;
  }
}

/**
 * Get a subject by ID
 * @param subjectId The ID of the subject to get
 * @returns The subject object or undefined if not found
 */
export function getSubjectById(subjectId: string) {
  return HUMANITIES.find(subject => subject.id === subjectId);
}

/**
 * Check if a subject ID is valid
 * @param subjectId The ID to check
 * @returns True if the subject ID exists
 */
export function isValidSubjectId(subjectId: string): boolean {
  return HUMANITIES.some(subject => subject.id === subjectId);
}

/**
 * Generate a canonical URL for a subject
 * @param subjectId The ID of the subject
 * @param baseUrl The base URL of the site (optional)
 * @returns The canonical URL for the subject
 */
export function getSubjectUrl(subjectId: string, baseUrl = 'https://bbyouths.org'): string {
  return `${baseUrl}/humanities/${subjectId}`;
}

/**
 * Get the next and previous subjects for pagination
 * @param currentId The current subject ID
 * @returns Object with next and previous subject IDs
 */
export function getAdjacentSubjects(currentId: string) {
  const currentIndex = HUMANITIES.findIndex(subject => subject.id === currentId);
  
  if (currentIndex === -1) {
    return { next: null, prev: null };
  }
  
  const nextIndex = (currentIndex + 1) % HUMANITIES.length;
  const prevIndex = (currentIndex - 1 + HUMANITIES.length) % HUMANITIES.length;
  
  return {
    next: HUMANITIES[nextIndex].id,
    prev: HUMANITIES[prevIndex].id
  };
}

/**
 * Get all subjects in a specific category
 * @param category The category to filter by (optional)
 * @returns An array of subjects filtered by category
 */
export function getSubjectsByCategory(category?: string) {
  if (!category) return HUMANITIES;
  
  // This is a placeholder - add real categories if needed
  const categories: Record<string, string[]> = {
    arts: ['music', 'theatre', 'dance', 'visual', 'performing', 'digital'],
    academic: ['philosophy', 'stem', 'law', 'economics', 'heritage'],
    spiritual: ['faith']
  };
  
  const categoryIds = categories[category] || [];
  return HUMANITIES.filter(subject => categoryIds.includes(subject.id));
}