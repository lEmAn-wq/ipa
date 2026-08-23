import json
import re
import hashlib
import urllib.request
import os

# 1. Read ipa-data.js and parse JSON objects
js_file_path = "/Users/leminh/Desktop/ipa/js/ipa-data.js"
with open(js_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract items from JS array using regex
pattern = r'\{\s*id:\s*(\d+),\s*ipa:\s*"([^"]+)",[^}]*audioUrl:\s*"([^"]+)",\s*remoteAudioUrl:\s*"([^"]+)"\s*\}'
matches = re.findall(pattern, content)

print(f"Loaded {len(matches)} IPA items from ipa-data.js\n")
print(f"{'ID':<4} | {'IPA':<8} | {'Status':<12} | {'Local Hash (SHA-256)':<16} | {'Remote Hash (SHA-256)':<16}")
print("-" * 70)

def get_file_sha256(filepath):
    full_path = os.path.join("/Users/leminh/Desktop/ipa", filepath)
    if not os.path.exists(full_path):
        return None
    with open(full_path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

def get_url_sha256(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            return hashlib.sha256(response.read()).hexdigest()
    except Exception as e:
        return None

match_count = 0
diff_count = 0
error_count = 0

results = []

for item_id, ipa, local_path, remote_url in matches:
    local_hash = get_file_sha256(local_path)
    remote_hash = get_url_sha256(remote_url)
    
    if not local_hash or not remote_hash:
        status = "⚠️ ERROR"
        error_count += 1
    elif local_hash == remote_hash:
        status = "🟢 MATCH"
        match_count += 1
    else:
        status = "🔴 DIFFERENT"
        diff_count += 1
    
    loc_short = local_hash[:12] + "..." if local_hash else "NOT FOUND"
    rem_short = remote_hash[:12] + "..." if remote_hash else "DOWNLOAD FAIL"
    
    print(f"{item_id:<4} | {ipa:<8} | {status:<12} | {loc_short:<16} | {rem_short:<16}")
    results.append({
        "id": item_id,
        "ipa": ipa,
        "status": status,
        "local_hash": local_hash,
        "remote_hash": remote_hash
    })

print("\n" + "=" * 70)
print(f"SUMMARY: Total 44 items | 🟢 Match: {match_count} | 🔴 Different: {diff_count} | ⚠️ Error: {error_count}")
