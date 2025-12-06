"""
iOS App Unpacker (.IPA files) - UNRESTRICTED
Unpack, decrypt, and analyze iOS applications
For research and apps you own
"""

import zipfile
import os
import plistlib
import shutil
from pathlib import Path
from typing import Dict, List
import subprocess

class iOSAppUnpacker:
    """
    Unpack and analyze iOS .ipa files
    Decrypt apps (requires jailbreak for encrypted apps)
    """
    
    def __init__(self, ipa_path: str):
        self.ipa_path = Path(ipa_path)
        self.app_name = None
        self.bundle_id = None
        self.version = None
        
    def unpack(self, output_dir: str = "unpacked"):
        """Unpack .ipa file"""
        print(f"📦 Unpacking: {self.ipa_path.name}")
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        try:
            with zipfile.ZipFile(self.ipa_path, 'r') as zip_ref:
                zip_ref.extractall(output_path)
            print(f"✅ Unpacked to: {output_path}")
            
            # Find .app directory
            payload_dir = output_path / "Payload"
            if payload_dir.exists():
                app_dirs = list(payload_dir.glob("*.app"))
                if app_dirs:
                    self.app_dir = app_dirs[0]
                    print(f"📱 Found app: {self.app_dir.name}")
                    
                    # Parse Info.plist
                    self._parse_info_plist()
                    
            return True
        except Exception as e:
            print(f"❌ Failed to unpack: {e}")
            return False
            
    def _parse_info_plist(self):
        """Parse Info.plist for app info"""
        info_plist = self.app_dir / "Info.plist"
        if not info_plist.exists():
            return
            
        try:
            with open(info_plist, 'rb') as f:
                plist = plistlib.load(f)
                
            self.app_name = plist.get('CFBundleDisplayName') or plist.get('CFBundleName')
            self.bundle_id = plist.get('CFBundleIdentifier')
            self.version = plist.get('CFBundleShortVersionString')
            
            print(f"\n📋 App Info:")
            print(f"   Name: {self.app_name}")
            print(f"   Bundle ID: {self.bundle_id}")
            print(f"   Version: {self.version}")
            print(f"   Minimum iOS: {plist.get('MinimumOSVersion', 'Unknown')}")
            
            # Check for entitlements
            if 'UIRequiredDeviceCapabilities' in plist:
                print(f"   Capabilities: {', '.join(plist['UIRequiredDeviceCapabilities'])}")
                
        except Exception as e:
            print(f"⚠️ Could not parse Info.plist: {e}")
            
    def extract_binary(self, output_file: str = None):
        """Extract main executable"""
        if not hasattr(self, 'app_dir'):
            print("❌ App not unpacked yet")
            return False
            
        # Find executable name from Info.plist
        info_plist = self.app_dir / "Info.plist"
        with open(info_plist, 'rb') as f:
            plist = plistlib.load(f)
        executable_name = plist.get('CFBundleExecutable')
        
        if not executable_name:
            print("❌ Could not find executable name")
            return False
            
        binary_path = self.app_dir / executable_name
        if not binary_path.exists():
            print(f"❌ Binary not found: {binary_path}")
            return False
            
        if output_file is None:
            output_file = f"{executable_name}_binary"
            
        shutil.copy2(binary_path, output_file)
        print(f"✅ Extracted binary: {output_file}")
        
        # Check if encrypted
        self._check_encryption(output_file)
        
        return True
        
    def _check_encryption(self, binary_path: str):
        """Check if binary is encrypted"""
        try:
            with open(binary_path, 'rb') as f:
                header = f.read(4096)
                
            # Check for FairPlay DRM encryption
            if b'cryptid' in header:
                # Parse load commands to check encryption flag
                print("   🔒 Binary appears to be encrypted (FairPlay DRM)")
                print("   ℹ️  Decryption requires: Jailbroken device + dumpdecrypted")
            else:
                print("   🔓 Binary appears to be unencrypted")
        except Exception as e:
            print(f"   ⚠️ Could not check encryption: {e}")
            
    def extract_assets(self, output_dir: str = "assets"):
        """Extract app assets (images, sounds, etc.)"""
        if not hasattr(self, 'app_dir'):
            print("❌ App not unpacked yet")
            return False
            
        print("\n🎨 Extracting Assets...")
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Asset types to extract
        asset_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp3', '.wav', '.mp4', '.json', '.plist']
        
        count = 0
        for ext in asset_extensions:
            files = self.app_dir.rglob(f'*{ext}')
            for file in files:
                rel_path = file.relative_to(self.app_dir)
                dest = output_path / rel_path
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file, dest)
                count += 1
                
        print(f"✅ Extracted {count} asset files")
        return True
        
    def extract_strings(self, output_file: str = "strings.txt"):
        """Extract strings from binary"""
        if not hasattr(self, 'app_dir'):
            print("❌ App not unpacked yet")
            return False
            
        print("\n📝 Extracting Strings...")
        
        # Find executable
        info_plist = self.app_dir / "Info.plist"
        with open(info_plist, 'rb') as f:
            plist = plistlib.load(f)
        executable_name = plist.get('CFBundleExecutable')
        binary_path = self.app_dir / executable_name
        
        if not binary_path.exists():
            return False
            
        try:
            # Use strings command if available
            result = subprocess.run(
                ['strings', str(binary_path)],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                with open(output_file, 'w') as f:
                    f.write(result.stdout)
                    
                line_count = len(result.stdout.split('\n'))
                print(f"✅ Extracted {line_count} strings to: {output_file}")
                return True
        except FileNotFoundError:
            print("⚠️ 'strings' command not found")
        except Exception as e:
            print(f"❌ Failed to extract strings: {e}")
            
        return False
        
    def list_frameworks(self):
        """List embedded frameworks"""
        if not hasattr(self, 'app_dir'):
            print("❌ App not unpacked yet")
            return []
            
        print("\n📚 Embedded Frameworks:")
        
        frameworks_dir = self.app_dir / "Frameworks"
        if not frameworks_dir.exists():
            print("   No frameworks directory")
            return []
            
        frameworks = []
        for framework in frameworks_dir.glob("*.framework"):
            frameworks.append(framework.name)
            print(f"   • {framework.name}")
            
        return frameworks
        
    def analyze_permissions(self):
        """Analyze app permissions from Info.plist"""
        if not hasattr(self, 'app_dir'):
            print("❌ App not unpacked yet")
            return {}
            
        print("\n🔐 Permissions & Privacy:")
        
        info_plist = self.app_dir / "Info.plist"
        with open(info_plist, 'rb') as f:
            plist = plistlib.load(f)
            
        # Privacy permissions (iOS)
        privacy_keys = {
            'NSCameraUsageDescription': 'Camera',
            'NSPhotoLibraryUsageDescription': 'Photo Library',
            'NSLocationWhenInUseUsageDescription': 'Location (When In Use)',
            'NSLocationAlwaysUsageDescription': 'Location (Always)',
            'NSMicrophoneUsageDescription': 'Microphone',
            'NSContactsUsageDescription': 'Contacts',
            'NSCalendarsUsageDescription': 'Calendar',
            'NSRemindersUsageDescription': 'Reminders',
            'NSMotionUsageDescription': 'Motion & Fitness',
            'NSHealthShareUsageDescription': 'Health (Read)',
            'NSHealthUpdateUsageDescription': 'Health (Write)',
            'NSAppleMusicUsageDescription': 'Apple Music',
            'NSBluetoothAlwaysUsageDescription': 'Bluetooth',
            'NSSpeechRecognitionUsageDescription': 'Speech Recognition',
            'NSFaceIDUsageDescription': 'Face ID'
        }
        
        permissions = {}
        for key, name in privacy_keys.items():
            if key in plist:
                permissions[name] = plist[key]
                print(f"   • {name}: {plist[key]}")
                
        return permissions
        
    def full_analysis(self, output_dir: str = "analysis"):
        """Perform complete analysis"""
        print(f"\n🔬 Full Analysis of: {self.ipa_path.name}\n")
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Unpack
        self.unpack(f"{output_dir}/unpacked")
        
        # Extract binary
        self.extract_binary(f"{output_dir}/binary")
        
        # Extract assets
        self.extract_assets(f"{output_dir}/assets")
        
        # Extract strings
        self.extract_strings(f"{output_dir}/strings.txt")
        
        # List frameworks
        frameworks = self.list_frameworks()
        
        # Analyze permissions
        permissions = self.analyze_permissions()
        
        # Generate report
        self._generate_report(output_dir, frameworks, permissions)
        
        print(f"\n✅ Analysis complete! Check: {output_dir}/")
        
    def _generate_report(self, output_dir: str, frameworks: List, permissions: Dict):
        """Generate analysis report"""
        report_path = Path(output_dir) / "ANALYSIS_REPORT.md"
        
        with open(report_path, 'w') as f:
            f.write(f"# iOS App Analysis Report\n\n")
            f.write(f"## App Information\n\n")
            f.write(f"- **Name:** {self.app_name}\n")
            f.write(f"- **Bundle ID:** {self.bundle_id}\n")
            f.write(f"- **Version:** {self.version}\n")
            f.write(f"- **Source:** {self.ipa_path.name}\n\n")
            
            f.write(f"## Frameworks ({len(frameworks)})\n\n")
            for fw in frameworks:
                f.write(f"- {fw}\n")
            f.write("\n")
            
            f.write(f"## Permissions ({len(permissions)})\n\n")
            for name, desc in permissions.items():
                f.write(f"### {name}\n")
                f.write(f"> {desc}\n\n")
                
        print(f"   📄 Report saved: {report_path}")


def main():
    """Example usage"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python ios_app_unpacker.py <app.ipa> [output_dir]")
        print("\nExample:")
        print("  python ios_app_unpacker.py MyApp.ipa analysis_output")
        return
        
    ipa_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "analysis"
    
    unpacker = iOSAppUnpacker(ipa_path)
    unpacker.full_analysis(output_dir)


if __name__ == "__main__":
    main()
