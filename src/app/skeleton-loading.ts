export const SKELETON_MINIMUM_DURATION_MS = 5000;

export function waitForMinimumSkeletonDuration(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, SKELETON_MINIMUM_DURATION_MS),
  );
}
