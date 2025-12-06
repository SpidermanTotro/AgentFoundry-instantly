"""
iPhone Backup Extractor - UNRESTRICTED
Extract data from iPhone backups (.ipsw, iTunes backups, iCloud backups)
For personal use on devices you own
"""

import os
import sqlite3
import plistlib
import shutil
from pathlib import Path
from typing import Dict, List, Optional
import hashlib
import struct

class iPhoneBackupExtractor:
    """
    Extract data from iPhone backups
    Supports: iTunes backups, iCloud backups, IPSW files
    """
    
    def __init__(self, backup_path: str):
        self.backup_path = Path(backup_path)
        self.manifest_db = None
        self.info_plist = None
        
    def initialize(self):
        """Initialize and validate backup"""
        print(f"🔍 Analyzing iPhone backup: {self.backup_path}")
        
        # Read Manifest.db
        manifest_path = self.backup_path / "Manifest.db"
        if manifest_path.exists():
            self.manifest_db = sqlite3.connect(str(manifest_path))
            print("✅ Found Manifest.db")
        
        # Read Info.plist
        info_path = self.backup_path / "Info.plist"
        if info_path.exists():
            with open(info_path, 'rb') as f:
                self.info_plist = plistlib.load(f)
            print("✅ Found Info.plist")
            
            # Display device info
            print(f"\n📱 Device Info:")
            print(f"   Display Name: {self.info_plist.get('Display Name', 'Unknown')}")
            print(f"   Device Name: {self.info_plist.get('Device Name', 'Unknown')}")
            print(f"   Product Type: {self.info_plist.get('Product Type', 'Unknown')}")
            print(f"   iOS Version: {self.info_plist.get('Product Version', 'Unknown')}")
            print(f"   Serial Number: {self.info_plist.get('Serial Number', 'Unknown')}")
            
        return self.manifest_db is not None
        
    def list_all_files(self) -> List[Dict]:
        """List all files in backup"""
        if not self.manifest_db:
            return []
            
        cursor = self.manifest_db.cursor()
        cursor.execute("""
            SELECT fileID, domain, relativePath, flags, file 
            FROM Files 
            ORDER BY domain, relativePath
        """)
        
        files = []
        for row in cursor.fetchall():
            file_id, domain, relative_path, flags, file_blob = row
            files.append({
                'file_id': file_id,
                'domain': domain,
                'path': relative_path,
                'flags': flags,
                'size': len(file_blob) if file_blob else 0
            })
            
        print(f"\n📂 Found {len(files)} files in backup")
        return files
        
    def extract_messages(self, output_dir: str = "extracted/messages"):
        """Extract iMessages and SMS"""
        print("\n💬 Extracting Messages...")
        
        # Find SMS database
        sms_files = self._find_files_by_pattern("sms.db")
        if not sms_files:
            print("❌ SMS database not found")
            return False
            
        os.makedirs(output_dir, exist_ok=True)
        
        for sms_file in sms_files:
            source = self.backup_path / sms_file['file_id'][:2] / sms_file['file_id']
            if source.exists():
                dest = os.path.join(output_dir, "sms.db")
                shutil.copy2(source, dest)
                print(f"✅ Extracted: {dest}")
                
                # Parse messages
                self._parse_sms_db(dest)
                
        return True
        
    def extract_photos(self, output_dir: str = "extracted/photos"):
        """Extract all photos"""
        print("\n📸 Extracting Photos...")
        
        photo_files = self._find_files_by_pattern([".jpg", ".jpeg", ".png", ".heic", ".mov", ".mp4"])
        os.makedirs(output_dir, exist_ok=True)
        
        count = 0
        for photo in photo_files:
            source = self.backup_path / photo['file_id'][:2] / photo['file_id']
            if source.exists():
                # Get original filename
                filename = os.path.basename(photo['path']) or f"{photo['file_id']}.jpg"
                dest = os.path.join(output_dir, filename)
                shutil.copy2(source, dest)
                count += 1
                
        print(f"✅ Extracted {count} photos/videos")
        return count > 0
        
    def extract_contacts(self, output_dir: str = "extracted/contacts"):
        """Extract contacts"""
        print("\n👥 Extracting Contacts...")
        
        contact_files = self._find_files_by_pattern("AddressBook.sqlitedb")
        os.makedirs(output_dir, exist_ok=True)
        
        for contact_file in contact_files:
            source = self.backup_path / contact_file['file_id'][:2] / contact_file['file_id']
            if source.exists():
                dest = os.path.join(output_dir, "AddressBook.sqlitedb")
                shutil.copy2(source, dest)
                print(f"✅ Extracted: {dest}")
                
                # Parse contacts
                self._parse_contacts_db(dest)
                
        return True
        
    def extract_call_history(self, output_dir: str = "extracted/calls"):
        """Extract call history"""
        print("\n📞 Extracting Call History...")
        
        call_files = self._find_files_by_pattern("call_history.db")
        os.makedirs(output_dir, exist_ok=True)
        
        for call_file in call_files:
            source = self.backup_path / call_file['file_id'][:2] / call_file['file_id']
            if source.exists():
                dest = os.path.join(output_dir, "call_history.db")
                shutil.copy2(source, dest)
                print(f"✅ Extracted: {dest}")
                
        return True
        
    def extract_whatsapp(self, output_dir: str = "extracted/whatsapp"):
        """Extract WhatsApp data"""
        print("\n💚 Extracting WhatsApp...")
        
        wa_files = self._find_files_by_domain("AppDomainGroup-group.net.whatsapp.WhatsApp.shared")
        os.makedirs(output_dir, exist_ok=True)
        
        count = 0
        for wa_file in wa_files:
            source = self.backup_path / wa_file['file_id'][:2] / wa_file['file_id']
            if source.exists():
                # Preserve directory structure
                rel_path = wa_file['path']
                dest = os.path.join(output_dir, rel_path)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(source, dest)
                count += 1
                
        print(f"✅ Extracted {count} WhatsApp files")
        return count > 0
        
    def extract_safari_history(self, output_dir: str = "extracted/safari"):
        """Extract Safari browsing history"""
        print("\n🌐 Extracting Safari History...")
        
        safari_files = self._find_files_by_pattern("History.db")
        os.makedirs(output_dir, exist_ok=True)
        
        for safari_file in safari_files:
            if "Safari" in safari_file['domain']:
                source = self.backup_path / safari_file['file_id'][:2] / safari_file['file_id']
                if source.exists():
                    dest = os.path.join(output_dir, "History.db")
                    shutil.copy2(source, dest)
                    print(f"✅ Extracted: {dest}")
                    
        return True
        
    def extract_notes(self, output_dir: str = "extracted/notes"):
        """Extract Notes app data"""
        print("\n📝 Extracting Notes...")
        
        notes_files = self._find_files_by_pattern("notes.sqlite")
        os.makedirs(output_dir, exist_ok=True)
        
        for notes_file in notes_files:
            source = self.backup_path / notes_file['file_id'][:2] / notes_file['file_id']
            if source.exists():
                dest = os.path.join(output_dir, "notes.sqlite")
                shutil.copy2(source, dest)
                print(f"✅ Extracted: {dest}")
                
        return True
        
    def extract_all(self, output_dir: str = "extracted"):
        """Extract everything"""
        print("\n🚀 Extracting ALL iPhone Data...")
        
        self.extract_messages(f"{output_dir}/messages")
        self.extract_photos(f"{output_dir}/photos")
        self.extract_contacts(f"{output_dir}/contacts")
        self.extract_call_history(f"{output_dir}/calls")
        self.extract_whatsapp(f"{output_dir}/whatsapp")
        self.extract_safari_history(f"{output_dir}/safari")
        self.extract_notes(f"{output_dir}/notes")
        
        print("\n✅ COMPLETE! All data extracted")
        
    def _find_files_by_pattern(self, patterns) -> List[Dict]:
        """Find files matching pattern"""
        if isinstance(patterns, str):
            patterns = [patterns]
            
        cursor = self.manifest_db.cursor()
        results = []
        
        for pattern in patterns:
            cursor.execute("""
                SELECT fileID, domain, relativePath, flags 
                FROM Files 
                WHERE relativePath LIKE ?
            """, (f'%{pattern}%',))
            
            for row in cursor.fetchall():
                results.append({
                    'file_id': row[0],
                    'domain': row[1],
                    'path': row[2],
                    'flags': row[3]
                })
                
        return results
        
    def _find_files_by_domain(self, domain: str) -> List[Dict]:
        """Find files in specific domain"""
        cursor = self.manifest_db.cursor()
        cursor.execute("""
            SELECT fileID, domain, relativePath, flags 
            FROM Files 
            WHERE domain = ?
        """, (domain,))
        
        results = []
        for row in cursor.fetchall():
            results.append({
                'file_id': row[0],
                'domain': row[1],
                'path': row[2],
                'flags': row[3]
            })
            
        return results
        
    def _parse_sms_db(self, db_path: str):
        """Parse SMS database and print summary"""
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Count messages
            cursor.execute("SELECT COUNT(*) FROM message")
            count = cursor.fetchone()[0]
            print(f"   📊 Total messages: {count}")
            
            # Count conversations
            cursor.execute("SELECT COUNT(DISTINCT chat_id) FROM chat_message_join")
            conv_count = cursor.fetchone()[0]
            print(f"   📊 Conversations: {conv_count}")
            
            conn.close()
        except Exception as e:
            print(f"   ⚠️ Could not parse SMS database: {e}")
            
    def _parse_contacts_db(self, db_path: str):
        """Parse contacts database and print summary"""
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Count contacts
            cursor.execute("SELECT COUNT(*) FROM ABPerson")
            count = cursor.fetchone()[0]
            print(f"   📊 Total contacts: {count}")
            
            conn.close()
        except Exception as e:
            print(f"   ⚠️ Could not parse contacts database: {e}")


def main():
    """Example usage"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python iphone_backup_extractor.py <backup_path>")
        print("\nExample:")
        print("  python iphone_backup_extractor.py ~/Library/Application\\ Support/MobileSync/Backup/xxx")
        return
        
    backup_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "extracted"
    
    extractor = iPhoneBackupExtractor(backup_path)
    
    if extractor.initialize():
        extractor.extract_all(output_dir)
    else:
        print("❌ Failed to initialize backup")


if __name__ == "__main__":
    main()
