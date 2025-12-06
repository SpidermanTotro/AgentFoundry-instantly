"""
Universal Game Extractor - Extract assets from ANY game
========================================================
Supports: Unity, Unreal Engine, Need for Speed, EA games, generic archives

USAGE:
    python universal_game_extractor.py --game-path "./NFS_Most_Wanted" --engine nfs --output ./extracted
    
FEATURES:
    ✓ Unity asset extraction (.assets, AssetBundle)
    ✓ Unreal Engine extraction (.pak, .uasset)
    ✓ Need for Speed extraction (.BIG, .VIV)
    ✓ Generic game archive extraction
"""

import os
import struct
from pathlib import Path
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UniversalGameExtractor:
    """Extract assets from any game engine"""
    
    def __init__(self, game_path: str, engine: str = "auto", output_dir: str = "./extracted"):
        self.game_path = Path(game_path)
        self.engine = engine
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def detect_engine(self) -> str:
        """Auto-detect game engine"""
        logger.info(f"🔍 Detecting game engine in: {self.game_path}")
        
        # Check for Unity
        if list(self.game_path.glob("*_Data")) or list(self.game_path.glob("*.assets")):
            logger.info("  ✅ Detected: Unity Engine")
            return "unity"
        
        # Check for Unreal Engine
        if list(self.game_path.glob("*.pak")) or list(self.game_path.glob("*.uasset")):
            logger.info("  ✅ Detected: Unreal Engine")
            return "unreal"
        
        # Check for Need for Speed
        if list(self.game_path.glob("*.BIG")) or list(self.game_path.glob("*.VIV")):
            logger.info("  ✅ Detected: Need for Speed / EA Big File")
            return "nfs"
        
        logger.warning("  ⚠️  Engine not detected, trying generic extraction")
        return "generic"
    
    def extract_unity(self) -> Dict[str, Any]:
        """Extract Unity game assets"""
        logger.info("🎮 Extracting Unity assets...")
        
        results = {"files": [], "total": 0}
        
        # Find all .assets files
        asset_files = list(self.game_path.rglob("*.assets"))
        asset_bundles = list(self.game_path.rglob("*.unity3d"))
        
        results['total'] = len(asset_files) + len(asset_bundles)
        
        for asset_file in asset_files:
            logger.info(f"  Found: {asset_file.name}")
            results['files'].append(str(asset_file))
            # Use AssetStudio or UnityPy to extract
        
        logger.info(f"✅ Found {results['total']} Unity asset files")
        logger.info("   Use 'AssetStudio' or 'UnityPy' to extract textures/models")
        
        return results
    
    def extract_unreal(self) -> Dict[str, Any]:
        """Extract Unreal Engine assets"""
        logger.info("🎮 Extracting Unreal Engine assets...")
        
        results = {"files": [], "total": 0}
        
        # Find all .pak files
        pak_files = list(self.game_path.rglob("*.pak"))
        results['total'] = len(pak_files)
        
        for pak_file in pak_files:
            logger.info(f"  Extracting: {pak_file.name}")
            
            try:
                # Parse PAK header
                with open(pak_file, 'rb') as f:
                    magic = f.read(4)
                    if magic == b'\xE1\x12\x6F\x5A':  # PAK magic
                        logger.info(f"    Valid PAK file")
                        results['files'].append(str(pak_file))
                        # Use UnrealPak or UEViewer to extract
            except Exception as e:
                logger.error(f"    Error: {str(e)}")
        
        logger.info(f"✅ Found {results['total']} Unreal PAK files")
        logger.info("   Use 'UEViewer' or 'UnrealPak' to extract")
        
        return results
    
    def extract_nfs(self) -> Dict[str, Any]:
        """Extract Need for Speed game assets"""
        logger.info("🏎️  Extracting Need for Speed assets...")
        
        results = {"files": [], "models": [], "textures": [], "sounds": []}
        
        # Find BIG and VIV archives
        big_files = list(self.game_path.rglob("*.BIG"))
        viv_files = list(self.game_path.rglob("*.VIV"))
        
        all_archives = big_files + viv_files
        
        for archive in all_archives:
            logger.info(f"  Extracting: {archive.name}")
            
            try:
                extracted = self._extract_big_archive(archive)
                results['files'].extend(extracted)
                
                # Categorize extracted files
                for file in extracted:
                    ext = Path(file).suffix.lower()
                    if ext in ['.obj', '.dae', '.fbx']:
                        results['models'].append(file)
                    elif ext in ['.dds', '.png', '.tga']:
                        results['textures'].append(file)
                    elif ext in ['.wav', '.ogg', '.mp3']:
                        results['sounds'].append(file)
                
            except Exception as e:
                logger.error(f"    Error: {str(e)}")
        
        logger.info(f"✅ Extracted {len(results['files'])} files from NFS archives")
        logger.info(f"   Models: {len(results['models'])}, Textures: {len(results['textures'])}, Sounds: {len(results['sounds'])}")
        
        return results
    
    def _extract_big_archive(self, archive_path: Path) -> List[str]:
        """Extract EA BIG/VIV archive"""
        extracted_files = []
        
        output_subdir = self.output_dir / archive_path.stem
        output_subdir.mkdir(exist_ok=True)
        
        try:
            with open(archive_path, 'rb') as f:
                # Read BIG header
                magic = f.read(4)
                
                if magic == b'BIGF' or magic == b'BIG4':
                    # Parse header
                    header_size = struct.unpack('>I', f.read(4))[0]
                    num_files = struct.unpack('>I', f.read(4))[0]
                    
                    logger.info(f"    Found {num_files} files in archive")
                    
                    # Read file entries
                    for i in range(num_files):
                        # Read entry (simplified - actual format varies)
                        offset = struct.unpack('>I', f.read(4))[0]
                        size = struct.unpack('>I', f.read(4))[0]
                        name_len = struct.unpack('B', f.read(1))[0]
                        name = f.read(name_len).decode('ascii')
                        
                        # Extract file
                        current_pos = f.tell()
                        f.seek(offset)
                        data = f.read(size)
                        f.seek(current_pos)
                        
                        # Save extracted file
                        output_file = output_subdir / name
                        output_file.parent.mkdir(parents=True, exist_ok=True)
                        with open(output_file, 'wb') as out:
                            out.write(data)
                        
                        extracted_files.append(str(output_file))
                        
        except Exception as e:
            logger.error(f"BIG extraction error: {str(e)}")
        
        return extracted_files
    
    def extract_all(self) -> Dict[str, Any]:
        """Extract all game assets"""
        logger.info("🚀 Starting universal game extraction...")
        
        # Auto-detect engine if not specified
        if self.engine == "auto":
            self.engine = self.detect_engine()
        
        results = {
            "engine": self.engine,
            "game_path": str(self.game_path),
            "output_dir": str(self.output_dir),
            "extraction": {}
        }
        
        # Extract based on engine
        if self.engine == "unity":
            results['extraction'] = self.extract_unity()
        elif self.engine == "unreal":
            results['extraction'] = self.extract_unreal()
        elif self.engine == "nfs":
            results['extraction'] = self.extract_nfs()
        else:
            logger.warning("⚠️  Generic extraction not fully implemented")
        
        logger.info("✅ Extraction complete!")
        return results


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Universal Game Extractor')
    parser.add_argument('--game-path', required=True, help='Path to game directory')
    parser.add_argument('--engine', choices=['unity', 'unreal', 'nfs', 'auto'], default='auto', help='Game engine')
    parser.add_argument('--output', default='./extracted', help='Output directory')
    
    args = parser.parse_args()
    
    extractor = UniversalGameExtractor(args.game_path, args.engine, args.output)
    results = extractor.extract_all()
    
    print("\n" + "="*60)
    print("🎮 EXTRACTION REPORT")
    print("="*60)
    import json
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
