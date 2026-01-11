import sys

with open(sys.argv[1], 'rb') as f:
    content = f.read()
    if b'\t' in content:
        print("TABS FOUND")
    else:
        print("NO TABS FOUND")
    
    # Print first few lines with hex
    lines = content.split(b'\n')[:20]
    for i, line in enumerate(lines):
        print(f"{i+1}: {line.hex(' ')}")
