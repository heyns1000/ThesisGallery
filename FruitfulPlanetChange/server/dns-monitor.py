# dns_monitor.py
import requests
import time
import datetime
import os

CLOUDFLARE_ZONE_ID = "b3220969343cf767a56095ddbd6d91a"
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN", "your_cloudflare_api_token_here")

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def check_zone_status():
    url = f"https://api.cloudflare.com/client/v4/zones/{CLOUDFLARE_ZONE_ID}"
    try:
        response = requests.get(url, headers=headers)
        data = response.json()

        if data["success"]:
            status = data["result"]["status"]
            now = datetime.datetime.now().isoformat()
            if status == "active":
                print(f"[{now}] ✅ DNS is LIVE on Cloudflare!")
                # Optional: trigger webhook, update DB flag, or log file
                return True
            else:
                print(f"[{now}] ⏳ DNS Status: {status} (still syncing)")
        else:
            print(f"Error: {data}")
    except Exception as e:
        print(f"Exception occurred: {e}")
    return False

if __name__ == "__main__":
    while True:
        check_zone_status()
        time.sleep(540)  # Sleep 9 minutes (9 * 60 seconds)