import time
import base64

# Obfuscated string (Base64 encoded)
_s = b'VGhpcyBpcyBhIHZlcnkgc2VjcmV0IGtleS4='

def _c(_i):
    """A function with a meaningless name."""
    _r = _i * 2
    return _r

def _m():
    print("Starting application logic...")
    time.sleep(1)
    
    # Decode the secret key at runtime
    _d = base64.b64decode(_s).decode('utf-8')
    _p = _c(5)
    
    print(f"Key: {_d}")
    print(f"Result: {_p}")

if __name__ == "__main__":
    _m()
