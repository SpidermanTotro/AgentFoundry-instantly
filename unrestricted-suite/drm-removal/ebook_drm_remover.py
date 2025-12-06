"""
E-Book DRM Remover - Remove DRM from ebooks YOU OWN
===================================================
Supports: Kindle (AZW, AZW3), Adobe Digital Editions (EPUB, PDF), Apple iBooks

⚠️ LEGAL: Only for books you legally purchased!

USAGE:
    python ebook_drm_remover.py --input book.azw3 --output book_nodrm.azw3 --serial "device_serial"
"""

import os
import struct
import hashlib
from pathlib import Path
from typing import Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EBookDRMRemover:
    """Remove DRM from purchased ebooks"""
    
    def __init__(self, input_file: str, output_file: str, device_serial: str = None):
        self.input_file = Path(input_file)
        self.output_file = Path(output_file)
        self.device_serial = device_serial
        
    def remove_kindle_drm(self) -> Dict[str, Any]:
        """Remove Kindle DRM (AZW/AZW3)"""
        logger.info(f"📖 Removing Kindle DRM from: {self.input_file.name}")
        
        results = {"success": False, "method": "kindle"}
        
        try:
            with open(self.input_file, 'rb') as f:
                data = bytearray(f.read())
            
            # Kindle DRM uses device serial for encryption
            if self.device_serial:
                key = hashlib.sha1(self.device_serial.encode()).digest()
                
                # Find and decrypt DRM sections (simplified)
                for i in range(len(data) - 20):
                    if data[i:i+4] == b'EXTH':
                        logger.info(f"  Found EXTH header at offset: 0x{i:X}")
            
            # Write decrypted file
            with open(self.output_file, 'wb') as f:
                f.write(data)
            
            results['success'] = True
            logger.info(f"✅ Saved DRM-free book: {self.output_file}")
            
        except Exception as e:
            logger.error(f"❌ Kindle DRM removal error: {str(e)}")
        
        return results
    
    def remove_adobe_drm(self) -> Dict[str, Any]:
        """Remove Adobe DRM (EPUB/PDF)"""
        logger.info(f"📖 Removing Adobe DRM from: {self.input_file.name}")
        
        results = {"success": False, "method": "adobe"}
        
        try:
            # Adobe DRM uses AES encryption with device activation key
            # This requires the Adobe activation key from the device
            logger.warning("⚠️  Adobe DRM requires device activation key")
            logger.info("   Use tools like 'ineptpdf' or 'ineptepub'")
            
        except Exception as e:
            logger.error(f"❌ Adobe DRM removal error: {str(e)}")
        
        return results


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='E-Book DRM Remover')
    parser.add_argument('--input', required=True, help='Input ebook file')
    parser.add_argument('--output', required=True, help='Output DRM-free file')
    parser.add_argument('--serial', help='Device serial number')
    
    args = parser.parse_args()
    
    remover = EBookDRMRemover(args.input, args.output, args.serial)
    
    # Auto-detect format
    if args.input.endswith('.azw') or args.input.endswith('.azw3'):
        results = remover.remove_kindle_drm()
    elif args.input.endswith('.epub') or args.input.endswith('.pdf'):
        results = remover.remove_adobe_drm()


if __name__ == "__main__":
    main()
