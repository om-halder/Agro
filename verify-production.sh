#!/bin/bash

# AgroConnect - Production Verification Script
# Verifies that your production deployment is working correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 AgroConnect Production Verification${NC}\n"

# Test variables
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost}"
TIMEOUT=5

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -n "Testing $name ... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$url" 2>/dev/null); then
        if [ "$response" = "$expected_code" ]; then
            echo -e "${GREEN}✓ ($response)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ (Got $response, expected $expected_code)${NC}"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}✗ (Connection failed)${NC}"
        ((TESTS_FAILED++))
    fi
}

# Run tests
echo "=== Backend Tests ==="
test_endpoint "Backend Health" "$BACKEND_URL/health" "200"
test_endpoint "Backend Root" "$BACKEND_URL/" "200"

echo -e "\n=== Frontend Tests ==="
test_endpoint "Frontend" "$FRONTEND_URL/" "200"

echo -e "\n=== Docker Tests ==="
if command -v docker &> /dev/null; then
    echo -n "Checking Docker service ... "
    if docker ps > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Docker running${NC}"
        ((TESTS_PASSED++))
        
        echo -n "Checking backend container ... "
        if docker ps | grep -q "agroconnect-backend\|agroconnect_backend"; then
            echo -e "${GREEN}✓ Backend container running${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}⚠ Backend container not found${NC}"
        fi
        
        echo -n "Checking frontend container ... "
        if docker ps | grep -q "agroconnect-frontend\|agroconnect_frontend"; then
            echo -e "${GREEN}✓ Frontend container running${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}⚠ Frontend container not found${NC}"
        fi
    else
        echo -e "${RED}✗ Docker not running${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ Docker not installed${NC}"
fi

echo -e "\n=== Environment Variables ==="
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓ .env.production exists${NC}"
    ((TESTS_PASSED++))
    
    if grep -q "MONGO_URI" .env.production; then
        echo -e "${GREEN}✓ MONGO_URI configured${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ MONGO_URI not found${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗ .env.production not found${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n=== File Sizes ==="
if [ -d "Frontend/dist" ]; then
    size=$(du -sh Frontend/dist | cut -f1)
    echo -e "${GREEN}✓ Frontend dist: $size${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ Frontend dist not built${NC}"
fi

if [ -d "Backend/node_modules" ]; then
    size=$(du -sh Backend/node_modules | cut -f1)
    echo "Backend node_modules: $size"
fi

echo -e "\n=== Summary ==="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
else
    echo -e "${GREEN}Failed: $TESTS_FAILED${NC}"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All checks passed! Ready for production.${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ Some checks failed. Review above.${NC}\n"
    exit 1
fi
