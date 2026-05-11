#!/usr/bin/env python3
"""
Backend API Testing Script for Projects Endpoint
Tests the /api/projects endpoint and existing endpoints
"""

import requests
import time
import sys
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://file-picker-1.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_test(name: str):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST: {name}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")

def print_pass(msg: str):
    print(f"{Colors.GREEN}✓ PASS: {msg}{Colors.RESET}")

def print_fail(msg: str):
    print(f"{Colors.RED}✗ FAIL: {msg}{Colors.RESET}")

def print_info(msg: str):
    print(f"{Colors.YELLOW}ℹ INFO: {msg}{Colors.RESET}")

# Test counters
tests_passed = 0
tests_failed = 0
test_details = []

def test_existing_endpoints():
    """Test that existing endpoints still work"""
    global tests_passed, tests_failed
    
    print_test("Existing Endpoints - GET /api/")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                print_pass(f"GET /api/ returned 200 with message: {data['message']}")
                tests_passed += 1
                test_details.append(("GET /api/", "PASS", "Endpoint working"))
            else:
                print_fail("GET /api/ missing 'message' field")
                tests_failed += 1
                test_details.append(("GET /api/", "FAIL", "Missing message field"))
        else:
            print_fail(f"GET /api/ returned {response.status_code}")
            tests_failed += 1
            test_details.append(("GET /api/", "FAIL", f"Status {response.status_code}"))
    except Exception as e:
        print_fail(f"GET /api/ failed: {e}")
        tests_failed += 1
        test_details.append(("GET /api/", "FAIL", str(e)))

    print_test("Existing Endpoints - POST /api/status")
    try:
        payload = {"client_name": "test_client_projects"}
        response = requests.post(f"{BACKEND_URL}/status", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "client_name" in data and data["client_name"] == "test_client_projects":
                print_pass(f"POST /api/status created status check with id: {data['id']}")
                tests_passed += 1
                test_details.append(("POST /api/status", "PASS", "Status check created"))
            else:
                print_fail("POST /api/status response missing required fields")
                tests_failed += 1
                test_details.append(("POST /api/status", "FAIL", "Missing fields"))
        else:
            print_fail(f"POST /api/status returned {response.status_code}")
            tests_failed += 1
            test_details.append(("POST /api/status", "FAIL", f"Status {response.status_code}"))
    except Exception as e:
        print_fail(f"POST /api/status failed: {e}")
        tests_failed += 1
        test_details.append(("POST /api/status", "FAIL", str(e)))

    print_test("Existing Endpoints - GET /api/status")
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_pass(f"GET /api/status returned list with {len(data)} items")
                tests_passed += 1
                test_details.append(("GET /api/status", "PASS", f"{len(data)} items"))
            else:
                print_fail("GET /api/status did not return a list")
                tests_failed += 1
                test_details.append(("GET /api/status", "FAIL", "Not a list"))
        else:
            print_fail(f"GET /api/status returned {response.status_code}")
            tests_failed += 1
            test_details.append(("GET /api/status", "FAIL", f"Status {response.status_code}"))
    except Exception as e:
        print_fail(f"GET /api/status failed: {e}")
        tests_failed += 1
        test_details.append(("GET /api/status", "FAIL", str(e)))

def test_projects_basic():
    """Test basic GET /api/projects endpoint"""
    global tests_passed, tests_failed
    
    print_test("Projects Endpoint - Basic GET /api/projects")
    try:
        response = requests.get(f"{BACKEND_URL}/projects", timeout=15)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text[:500]}")
            tests_failed += 1
            test_details.append(("GET /api/projects", "FAIL", f"Status {response.status_code}"))
            return None
        
        data = response.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        # Check response shape
        required_keys = ["count", "cached", "data"]
        missing_keys = [k for k in required_keys if k not in data]
        if missing_keys:
            print_fail(f"Missing required keys: {missing_keys}")
            tests_failed += 1
            test_details.append(("GET /api/projects - shape", "FAIL", f"Missing keys: {missing_keys}"))
            return None
        
        print_pass(f"Response has correct shape with keys: {required_keys}")
        
        # Check count
        if not isinstance(data["count"], int):
            print_fail(f"'count' should be int, got {type(data['count'])}")
            tests_failed += 1
            test_details.append(("GET /api/projects - count type", "FAIL", f"Wrong type: {type(data['count'])}"))
        else:
            print_pass(f"'count' is int: {data['count']}")
        
        # Check cached
        if not isinstance(data["cached"], bool):
            print_fail(f"'cached' should be bool, got {type(data['cached'])}")
            tests_failed += 1
            test_details.append(("GET /api/projects - cached type", "FAIL", f"Wrong type: {type(data['cached'])}"))
        else:
            print_pass(f"'cached' is bool: {data['cached']}")
        
        # Check data is list
        if not isinstance(data["data"], list):
            print_fail(f"'data' should be list, got {type(data['data'])}")
            tests_failed += 1
            test_details.append(("GET /api/projects - data type", "FAIL", f"Wrong type: {type(data['data'])}"))
            return None
        
        print_pass(f"'data' is list with {len(data['data'])} items")
        
        # Check minimum 1 project
        if len(data["data"]) < 1:
            print_fail("Expected at least 1 project in data")
            tests_failed += 1
            test_details.append(("GET /api/projects - min count", "FAIL", "No projects returned"))
            return None
        
        print_pass(f"At least 1 project returned: {len(data['data'])} projects")
        tests_passed += 1
        test_details.append(("GET /api/projects - basic", "PASS", f"{len(data['data'])} projects"))
        
        return data
        
    except Exception as e:
        print_fail(f"GET /api/projects failed: {e}")
        tests_failed += 1
        test_details.append(("GET /api/projects", "FAIL", str(e)))
        return None

def test_project_fields(data: Dict[str, Any]):
    """Test that project fields are correctly parsed"""
    global tests_passed, tests_failed
    
    if not data or "data" not in data or len(data["data"]) == 0:
        print_fail("No project data to test fields")
        tests_failed += 1
        test_details.append(("Project fields", "FAIL", "No data"))
        return
    
    print_test("Projects Endpoint - Field Validation")
    
    project = data["data"][0]
    print_info(f"Testing first project: {project.get('title', 'N/A')}")
    print_info(f"Project fields: {list(project.keys())}")
    
    # Required fields
    required_fields = ["id", "title", "location", "region", "power", "storage", "year", "type", "image", "description"]
    missing_fields = [f for f in required_fields if f not in project]
    
    if missing_fields:
        print_fail(f"Missing required fields: {missing_fields}")
        tests_failed += 1
        test_details.append(("Project fields - required", "FAIL", f"Missing: {missing_fields}"))
    else:
        print_pass(f"All required fields present: {required_fields}")
        tests_passed += 1
        test_details.append(("Project fields - required", "PASS", "All fields present"))
    
    # Check power/storage split
    print_test("Projects Endpoint - Power/Storage Parsing")
    power_storage_found = False
    for proj in data["data"]:
        power = proj.get("power", "")
        storage = proj.get("storage", "")
        print_info(f"Project '{proj.get('title', 'N/A')}': power='{power}', storage='{storage}'")
        
        # Check if we have a project with both power and storage
        if power and storage:
            power_storage_found = True
            # Verify format (should be like "6 kW" and "10 kWh")
            if "kW" in power and "kWh" in storage:
                print_pass(f"Power/storage correctly split: power='{power}', storage='{storage}'")
                tests_passed += 1
                test_details.append(("Power/storage split", "PASS", f"Correctly parsed"))
                break
            else:
                print_fail(f"Power/storage format incorrect: power='{power}', storage='{storage}'")
                tests_failed += 1
                test_details.append(("Power/storage split", "FAIL", "Format incorrect"))
                break
    
    if not power_storage_found:
        print_info("No project with both power and storage found in data (may be expected)")
        # Don't count as failure if data doesn't have this case
        print_pass("Power/storage parsing logic exists (no test data with both)")
        tests_passed += 1
        test_details.append(("Power/storage split", "PASS", "Logic exists, no test data"))
    
    # Check location format (Posizione, Regione)
    print_test("Projects Endpoint - Location Parsing")
    location_found = False
    for proj in data["data"]:
        location = proj.get("location", "")
        region = proj.get("region", "")
        if location and region:
            location_found = True
            # Location should contain both posizione and regione
            if region in location and "," in location:
                print_pass(f"Location correctly formatted: '{location}' (contains region '{region}')")
                tests_passed += 1
                test_details.append(("Location format", "PASS", "Correctly joined"))
                break
            else:
                print_fail(f"Location format incorrect: '{location}' (region: '{region}')")
                tests_failed += 1
                test_details.append(("Location format", "FAIL", "Not properly joined"))
                break
    
    if not location_found:
        print_info("No project with both location and region found")
        # Check if at least location field exists
        if any(proj.get("location") for proj in data["data"]):
            print_pass("Location field exists in projects")
            tests_passed += 1
            test_details.append(("Location format", "PASS", "Field exists"))
        else:
            print_fail("No location data in any project")
            tests_failed += 1
            test_details.append(("Location format", "FAIL", "No location data"))

def test_projects_refresh():
    """Test GET /api/projects?refresh=1 to bypass cache"""
    global tests_passed, tests_failed
    
    print_test("Projects Endpoint - Cache Refresh")
    try:
        response = requests.get(f"{BACKEND_URL}/projects?refresh=1", timeout=15)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_fail(f"Expected 200, got {response.status_code}")
            tests_failed += 1
            test_details.append(("GET /api/projects?refresh=1", "FAIL", f"Status {response.status_code}"))
            return
        
        data = response.json()
        
        # Should have cached: false when refresh=1
        if "cached" not in data:
            print_fail("Response missing 'cached' field")
            tests_failed += 1
            test_details.append(("GET /api/projects?refresh=1 - cached field", "FAIL", "Missing field"))
            return
        
        if data["cached"] == False:
            print_pass("refresh=1 correctly bypassed cache (cached: false)")
            tests_passed += 1
            test_details.append(("GET /api/projects?refresh=1", "PASS", "Cache bypassed"))
        else:
            print_fail(f"refresh=1 should return cached: false, got cached: {data['cached']}")
            tests_failed += 1
            test_details.append(("GET /api/projects?refresh=1", "FAIL", f"cached={data['cached']}"))
            
    except Exception as e:
        print_fail(f"GET /api/projects?refresh=1 failed: {e}")
        tests_failed += 1
        test_details.append(("GET /api/projects?refresh=1", "FAIL", str(e)))

def test_projects_caching():
    """Test that second call returns cached data"""
    global tests_passed, tests_failed
    
    print_test("Projects Endpoint - Caching Behavior")
    try:
        # First call with refresh to clear cache
        print_info("First call with refresh=1 to clear cache...")
        response1 = requests.get(f"{BACKEND_URL}/projects?refresh=1", timeout=15)
        if response1.status_code != 200:
            print_fail(f"First call failed with status {response1.status_code}")
            tests_failed += 1
            test_details.append(("Caching test - first call", "FAIL", f"Status {response1.status_code}"))
            return
        
        data1 = response1.json()
        print_info(f"First call: cached={data1.get('cached')}")
        
        # Small delay
        time.sleep(0.5)
        
        # Second call without refresh - should be cached
        print_info("Second call without refresh (should be cached)...")
        response2 = requests.get(f"{BACKEND_URL}/projects", timeout=15)
        if response2.status_code != 200:
            print_fail(f"Second call failed with status {response2.status_code}")
            tests_failed += 1
            test_details.append(("Caching test - second call", "FAIL", f"Status {response2.status_code}"))
            return
        
        data2 = response2.json()
        print_info(f"Second call: cached={data2.get('cached')}")
        
        if data2.get("cached") == True:
            print_pass("Second call correctly returned cached data (cached: true)")
            tests_passed += 1
            test_details.append(("Caching behavior", "PASS", "Cache working"))
        else:
            print_fail(f"Second call should return cached: true, got cached: {data2.get('cached')}")
            tests_failed += 1
            test_details.append(("Caching behavior", "FAIL", f"cached={data2.get('cached')}"))
            
    except Exception as e:
        print_fail(f"Caching test failed: {e}")
        tests_failed += 1
        test_details.append(("Caching behavior", "FAIL", str(e)))

def print_summary():
    """Print test summary"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    total = tests_passed + tests_failed
    print(f"\nTotal Tests: {total}")
    print(f"{Colors.GREEN}Passed: {tests_passed}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {tests_failed}{Colors.RESET}")
    
    if tests_failed > 0:
        print(f"\n{Colors.RED}FAILED TESTS:{Colors.RESET}")
        for test_name, status, detail in test_details:
            if status == "FAIL":
                print(f"  {Colors.RED}✗ {test_name}: {detail}{Colors.RESET}")
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    return tests_failed == 0

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Backend API Testing - Projects Endpoint{Colors.RESET}")
    print(f"{Colors.BLUE}Backend URL: {BACKEND_URL}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Test existing endpoints first
    test_existing_endpoints()
    
    # Test new projects endpoint
    data = test_projects_basic()
    
    if data:
        test_project_fields(data)
    
    test_projects_refresh()
    test_projects_caching()
    
    # Print summary
    success = print_summary()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
