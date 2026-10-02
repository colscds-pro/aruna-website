import heroConsultingMeeting from './images/hero_consulting_meeting_1790916424867.jpg';
import industryRetailStore from './images/industry_retail_store_1790916438753.jpg';
import industryFbOperations from './images/industry_fb_operations_1790916451581.jpg';
import industryHospitality from './images/industry_hospitality_1790916463500.jpg';
import insightErpFoundation from './images/insight_erp_foundation_1790919206386.jpg';
import insightSecondBranch from './images/insight_second_branch_1790919218110.jpg';
import authorNurcholish from './images/author_nurcholish_1790919189982.jpg';

export const BUNDLED_IMAGES = {
  hero: heroConsultingMeeting,
  retail: industryRetailStore,
  fb: industryFbOperations,
  hospitality: industryHospitality,
  erpInsight: insightErpFoundation,
  branchInsight: insightSecondBranch,
  authorNurcholish: authorNurcholish,
} as const;

/**
 * Helper to get a guaranteed valid bundled fallback image
 * for any given media slug, storage path, or key.
 */
export function getBundledFallback(keyOrPath?: string | null): string {
  if (!keyOrPath) return BUNDLED_IMAGES.hero;
  const lower = keyOrPath.toLowerCase();

  if (lower.includes('hero')) return BUNDLED_IMAGES.hero;
  if (lower.includes('retail')) return BUNDLED_IMAGES.retail;
  if (lower.includes('fb') || lower.includes('fnb') || lower.includes('kitchen') || lower.includes('operations')) {
    return BUNDLED_IMAGES.fb;
  }
  if (lower.includes('hosp') || lower.includes('hotel')) return BUNDLED_IMAGES.hospitality;
  if (lower.includes('branch') || lower.includes('cabang')) return BUNDLED_IMAGES.branchInsight;
  if (lower.includes('erp') || lower.includes('foundation') || lower.includes('technology')) {
    return BUNDLED_IMAGES.erpInsight;
  }
  if (lower.includes('author') || lower.includes('nurcholish') || lower.includes('founder') || lower.includes('avatar')) {
    return BUNDLED_IMAGES.authorNurcholish;
  }

  return BUNDLED_IMAGES.hero;
}
