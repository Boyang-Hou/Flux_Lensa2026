import base64
import io
import logging
import os
import uuid
from datetime import datetime

from PIL import Image
from config import IMAGE_DIR

logger = logging.getLogger(__name__)


def save_uploaded_image(image_base64: str, user_id: str) -> str:
    os.makedirs(IMAGE_DIR, exist_ok=True)

    image_bytes = base64.b64decode(image_base64)

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img.thumbnail((1024, 1024), Image.LANCZOS)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    uid = uuid.uuid4().hex[:6]
    filename = f"{user_id}_{timestamp}_{uid}.jpg"
    filepath = os.path.join(IMAGE_DIR, filename)

    img.save(filepath, format="JPEG", quality=85)
    logger.info(f"Saved uploaded image: {filepath}")

    return filepath


def image_path_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_thumbnail(image_path: str, max_size: tuple[int, int] = (200, 200), quality: int = 70) -> str | None:
    try:
        if not os.path.exists(image_path):
            logger.warning(f"Image file not found: {image_path}")
            return None
        
        img = Image.open(image_path)
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        img.thumbnail(max_size, Image.LANCZOS)
        
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        thumb_filename = f"{base_name}_thumb.jpg"
        thumb_path = os.path.join(IMAGE_DIR, thumb_filename)
        
        img.save(thumb_path, format="JPEG", quality=quality, optimize=True)
        logger.info(f"Generated thumbnail: {thumb_path}")
        
        return thumb_path
        
    except Exception as e:
        logger.error(f"Failed to generate thumbnail for {image_path}: {e}")
        return None


def get_or_create_thumbnail(image_path: str | None, max_size: tuple[int, int] = (200, 200)) -> str | None:
    if not image_path:
        return None
    
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    thumb_filename = f"{base_name}_thumb.jpg"
    thumb_path = os.path.join(IMAGE_DIR, thumb_filename)
    
    if os.path.exists(thumb_path):
        if os.path.getmtime(thumb_path) >= os.path.getmtime(image_path):
            return thumb_path
    
    return generate_thumbnail(image_path, max_size)
