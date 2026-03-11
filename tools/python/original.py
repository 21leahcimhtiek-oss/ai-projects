import time

SECRET_KEY = "This is a very secret key."

def calculate_something(input_value):
    """A function with a meaningful name."""
    result = input_value * 2
    return result

def main_logic():
    print("Starting application logic...")
    time.sleep(1)
    
    # Use the secret key
    processed_value = calculate_something(5)
    
    print(f"Key: {SECRET_KEY}")
    print(f"Result: {processed_value}")

if __name__ == "__main__":
    main_logic()
