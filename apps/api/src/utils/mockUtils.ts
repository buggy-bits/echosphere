type ExtractedRouteInfo = {
  resourcesWithParams: { resource: string; param: string; value: string }[];
};

export function extractRouteInfo(
  pattern: string,
  actual: string
): ExtractedRouteInfo {
  // Remove leading/trailing slashes for consistency
  const patternParts = pattern.replace(/^\/|\/$/g, "").split("/");
  const actualParts = actual.replace(/^\/|\/$/g, "").split("/");
  const resources: string[] = [];
  const resourcesWithParams: {
    resource: string;
    param: string;
    value: string;
  }[] = [];

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    const value = actualParts[i];
    if (part.startsWith(":")) {
      // Match current resource (previous entry in the array)
      resourcesWithParams.push({
        resource: resources[resources.length - 1],
        param: part.substring(1),
        value,
      });
    } else {
      resources.push(part);
    }
  }

  return {
    resourcesWithParams,
  };
}
