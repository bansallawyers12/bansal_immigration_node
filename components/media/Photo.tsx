import Image from "next/image";

export function Photo({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={960}
      height={640}
      priority={priority}
      className={className}
    />
  );
}
