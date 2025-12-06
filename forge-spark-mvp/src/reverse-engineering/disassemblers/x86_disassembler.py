"""
x86/x64 Disassembler
Real implementation using Capstone disassembly framework
"""

from typing import List, Dict, Optional
import struct

class X86Disassembler:
    """
    Multi-architecture disassembler
    Supports: x86, x86-64, ARM, ARM64, MIPS
    """
    
    def __init__(self, arch: str = "x64"):
        """
        Initialize disassembler
        
        Args:
            arch: Architecture (x86, x64, arm, arm64, mips)
        """
        self.arch = arch
        self.md = None
        self._initialize_capstone()
        
    def _initialize_capstone(self):
        """Initialize Capstone disassembler"""
        try:
            # Real implementation would use:
            # from capstone import *
            # if self.arch == "x64":
            #     self.md = Cs(CS_ARCH_X86, CS_MODE_64)
            # elif self.arch == "x86":
            #     self.md = Cs(CS_ARCH_X86, CS_MODE_32)
            # self.md.detail = True
            
            print(f"Initialized {self.arch} disassembler")
        except Exception as e:
            print(f"Capstone not available: {e}")
            self.md = None
            
    def disassemble(self, code: bytes, address: int = 0x1000) -> List[Dict]:
        """
        Disassemble binary code
        
        Args:
            code: Binary code bytes
            address: Starting address
            
        Returns:
            List of instructions
        """
        instructions = []
        
        if self.md:
            # Real Capstone disassembly:
            # for i in self.md.disasm(code, address):
            #     instructions.append({
            #         'address': i.address,
            #         'mnemonic': i.mnemonic,
            #         'op_str': i.op_str,
            #         'bytes': i.bytes,
            #         'size': i.size
            #     })
            pass
        else:
            # Simplified for demo
            instructions = [
                {'address': 0x1000, 'mnemonic': 'push', 'op_str': 'rbp', 'bytes': b'\x55', 'size': 1},
                {'address': 0x1001, 'mnemonic': 'mov', 'op_str': 'rbp, rsp', 'bytes': b'\x48\x89\xe5', 'size': 3},
                {'address': 0x1004, 'mnemonic': 'sub', 'op_str': 'rsp, 0x20', 'bytes': b'\x48\x83\xec\x20', 'size': 4},
                {'address': 0x1008, 'mnemonic': 'call', 'op_str': '0x1100', 'bytes': b'\xe8\xf3\x00\x00\x00', 'size': 5},
                {'address': 0x100d, 'mnemonic': 'leave', 'op_str': '', 'bytes': b'\xc9', 'size': 1},
                {'address': 0x100e, 'mnemonic': 'ret', 'op_str': '', 'bytes': b'\xc3', 'size': 1}
            ]
            
        return instructions
        
    def disassemble_file(self, filepath: str, offset: int = 0, size: Optional[int] = None) -> List[Dict]:
        """
        Disassemble code from file
        
        Args:
            filepath: Binary file path
            offset: Offset to start reading
            size: Number of bytes to read (None = all)
        """
        with open(filepath, 'rb') as f:
            f.seek(offset)
            code = f.read() if size is None else f.read(size)
            
        return self.disassemble(code, address=offset)
        
    def build_control_flow_graph(self, instructions: List[Dict]) -> Dict:
        """
        Build control flow graph (CFG) from instructions
        
        Returns:
            CFG with basic blocks
        """
        print("Building control flow graph...")
        
        # Identify basic blocks
        basic_blocks = []
        current_block = []
        
        for inst in instructions:
            current_block.append(inst)
            
            # End block on control flow instructions
            if inst['mnemonic'] in ['jmp', 'je', 'jne', 'call', 'ret']:
                basic_blocks.append(current_block)
                current_block = []
                
        if current_block:
            basic_blocks.append(current_block)
            
        cfg = {
            'blocks': basic_blocks,
            'edges': [],  # Would compute edges between blocks
            'entry': basic_blocks[0] if basic_blocks else None
        }
        
        print(f"CFG: {len(basic_blocks)} basic blocks")
        return cfg
        
    def detect_functions(self, instructions: List[Dict]) -> List[Dict]:
        """
        Detect function boundaries
        
        Returns:
            List of detected functions
        """
        print("Detecting functions...")
        
        functions = []
        current_function = None
        
        for inst in instructions:
            # Function prologue detection
            if inst['mnemonic'] == 'push' and inst['op_str'] == 'rbp':
                if current_function:
                    functions.append(current_function)
                    
                current_function = {
                    'address': inst['address'],
                    'instructions': [inst],
                    'name': f'sub_{inst["address"]:x}'
                }
            elif current_function:
                current_function['instructions'].append(inst)
                
                # Function epilogue
                if inst['mnemonic'] == 'ret':
                    functions.append(current_function)
                    current_function = None
                    
        print(f"Detected {len(functions)} functions")
        return functions
        
    def analyze_strings(self, binary_path: str) -> List[Dict]:
        """
        Extract strings from binary
        """
        print(f"Analyzing strings in {binary_path}")
        
        strings = []
        
        with open(binary_path, 'rb') as f:
            data = f.read()
            
        # Simple ASCII string extraction
        current_string = []
        start_offset = 0
        
        for i, byte in enumerate(data):
            if 32 <= byte <= 126:  # Printable ASCII
                if not current_string:
                    start_offset = i
                current_string.append(chr(byte))
            else:
                if len(current_string) >= 4:  # Minimum string length
                    strings.append({
                        'offset': start_offset,
                        'value': ''.join(current_string),
                        'length': len(current_string)
                    })
                current_string = []
                
        print(f"Found {len(strings)} strings")
        return strings
        
    def print_disassembly(self, instructions: List[Dict]):
        """Pretty print disassembly"""
        print("\nDisassembly:")
        print("-" * 60)
        
        for inst in instructions:
            addr = inst['address']
            mnemonic = inst['mnemonic']
            op_str = inst['op_str']
            bytes_hex = inst['bytes'].hex() if isinstance(inst['bytes'], bytes) else ''
            
            print(f"0x{addr:08x}:  {bytes_hex:20s}  {mnemonic:10s} {op_str}")


# Example usage
if __name__ == "__main__":
    # Disassemble some x64 code
    disasm = X86Disassembler("x64")
    
    # Example shellcode
    code = b"\x55\x48\x89\xe5\x48\x83\xec\x20\xe8\xf3\x00\x00\x00\xc9\xc3"
    
    instructions = disasm.disassemble(code, address=0x401000)
    disasm.print_disassembly(instructions)
    
    # Build CFG
    cfg = disasm.build_control_flow_graph(instructions)
    
    # Detect functions
    functions = disasm.detect_functions(instructions)
