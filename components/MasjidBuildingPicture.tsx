type MasjidBuildingPictureProps = {
  alt: string;
  className?: string;
  priority?: boolean;
};

export function MasjidBuildingPicture({ alt, className, priority = false }: MasjidBuildingPictureProps) {
  return (
    <picture className={className}>
      <img
        src="/images/new-masjid-building-live.webp"
        alt={alt}
        width={1880}
        height={1440}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
