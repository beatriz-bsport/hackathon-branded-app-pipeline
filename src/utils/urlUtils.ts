function getBaseURL(): string {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}

export { getBaseURL };
