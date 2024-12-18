function getBaseURL(): string {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}

function getUTMParamsFromURL(): Record<string, string> {
  // check if window is accessible, if not return empty dict to avoid crashes
  if (!window || !window.location) return {};
  // Get the current page URL search params
  const urlParams = new URLSearchParams(window.location.search);

  // Extract required UTM parameters
  const utm_source = urlParams.get('utm_source');
  const utm_medium = urlParams.get('utm_medium');
  const utm_campaign = urlParams.get('utm_campaign');

  // Return an empty object if any required UTM parameter is missing
  if (!utm_source || !utm_medium || !utm_campaign) {
    return {};
  }

  // Initialize an object with the required UTM parameters
  const utmParams: Record<string, string> = {
    utm_source,
    utm_medium,
    utm_campaign,
  };

  // Optionally add utm_term and utm_content if they exist
  const utm_term = urlParams.get('utm_term');
  const utm_content = urlParams.get('utm_content');

  if (utm_term) {
    utmParams.utm_term = utm_term;
  }

  if (utm_content) {
    utmParams.utm_content = utm_content;
  }

  return utmParams;
}

export { getBaseURL, getUTMParamsFromURL };
