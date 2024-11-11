# Sample corrupted text
corrupted_text = b'\x39\x30\x47\x20\x2e\x42\x02\x17\x20\x15\x40\x20\x38\x2c\x4d\x5b\x40'

# Try decoding with multiple encodings
encodings_to_try = ["utf-8", "utf-16", "utf-32", "iso-8859-1", "windows-1252"]

for encoding in encodings_to_try:
    try:
        decoded_text = corrupted_text.decode(encoding)
        print(f"Decoded with {encoding}: {decoded_text}")
    except UnicodeDecodeError:
        print(f"Failed to decode with {encoding}")
