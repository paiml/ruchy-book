#!/usr/bin/env python3
# Generate realistic JSON test data for BENCH-009
# Creates nested API response structure (50MB)

import json
import sys
import random
from datetime import datetime, timedelta

def generate_user(user_id):
    """Generate a realistic user object"""
    return {
        "id": user_id,
        "username": f"user{user_id}",
        "email": f"user{user_id}@example.com",
        "created_at": (datetime(2020, 1, 1) + timedelta(days=user_id)).isoformat(),
        "profile": {
            "first_name": f"First{user_id}",
            "last_name": f"Last{user_id}",
            "age": 20 + (user_id % 50),
            "location": {
                "city": random.choice(["New York", "London", "Tokyo", "Paris", "Berlin"]),
                "country": random.choice(["USA", "UK", "Japan", "France", "Germany"]),
                "coordinates": {
                    "lat": round(random.uniform(-90, 90), 6),
                    "lng": round(random.uniform(-180, 180), 6)
                }
            }
        },
        "stats": {
            "posts": random.randint(0, 1000),
            "followers": random.randint(0, 10000),
            "following": random.randint(0, 500)
        },
        "preferences": {
            "theme": random.choice(["light", "dark", "auto"]),
            "notifications": random.choice([True, False]),
            "language": random.choice(["en", "es", "fr", "de", "ja"])
        }
    }

def generate_json(output_file, target_mb=50):
    """Generate JSON with target size in MB"""
    target_bytes = target_mb * 1024 * 1024

    print(f"Generating {target_mb}MB JSON file...", file=sys.stderr)

    data = {
        "metadata": {
            "version": "1.0",
            "generated_at": datetime.now().isoformat(),
            "total_users": 0,
            "description": "Test dataset for JSON parsing benchmark"
        },
        "users": []
    }

    user_id = 1
    while True:
        data["users"].append(generate_user(user_id))
        user_id += 1

        if user_id % 1000 == 0:
            # Check size periodically
            json_str = json.dumps(data)
            current_bytes = len(json_str.encode('utf-8'))
            current_mb = current_bytes / 1024 / 1024

            print(f"Generated {current_mb:.1f}MB ({user_id} users)...", file=sys.stderr)

            if current_bytes >= target_bytes:
                break

    data["metadata"]["total_users"] = len(data["users"])

    # Write final JSON
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)

    final_size = len(json.dumps(data).encode('utf-8'))
    final_mb = final_size / 1024 / 1024

    print(f"✅ Generated {final_mb:.1f}MB ({len(data['users'])} users)", file=sys.stderr)
    print(f"   Target value: users[500].profile.location.city", file=sys.stderr)
    print(f"   Actual value: {data['users'][500]['profile']['location']['city']}", file=sys.stderr)

    return output_file

if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "test-data/sample-50mb.json"
    generate_json(output)
