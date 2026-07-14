type MasjidBuildingPictureProps = {
  alt: string;
  className?: string;
  priority?: boolean;
};

export function MasjidBuildingPicture({ alt, className, priority = false }: MasjidBuildingPictureProps) {
  return (
    <picture className={className}>
      <source media="(max-width: 760px)" srcSet="/images/new-masjid-building-760.webp" />
      {/* The static Cloudflare export cannot use Next.js image optimization, so a picture element supplies the responsive source. */}
      <img
        src="/images/new-masjid-building-1600.webp"
        alt={alt}
        width={1600}
        height={1226}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
