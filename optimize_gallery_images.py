"""Create lightweight WebP thumbnails for the original gallery JPGs."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "assets" / "gallery"
OUTPUT_DIR = SOURCE_DIR / "optimized"
MAX_EDGE = 1200


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    images = sorted(
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}
    )

    for path in images:
        with Image.open(path) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            image.save(
                OUTPUT_DIR / f"{path.stem}-thumb.webp",
                "WEBP",
                quality=82,
                method=6,
                icc_profile=original.info.get("icc_profile"),
            )

    print(f"Optimized {len(images)} gallery images into {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
