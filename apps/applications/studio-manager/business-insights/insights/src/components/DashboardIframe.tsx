interface DashboardIframeProps {
  src: string;
  title: string;
}

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 */
export const DashboardIframe = ({ src, title }: DashboardIframeProps) => {
  return (
    <iframe
      src={src}
      className="w-full h-full border-0"
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
