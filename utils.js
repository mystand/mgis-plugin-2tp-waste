export function buildWasteCreationCachePropertyKey(hazardClass) {
  return `waste_creation_cache_${hazardClass}`.replace(/\s/, '-')
}
