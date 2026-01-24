#!/bin/bash

# AgroConnect - Production Setup Script
# This script optimizes and builds the application for production

set -e  # Exit on error

echo "🚀 AgroConnect Production Setup"
echo "================================\n"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo -e "${RED}Error: Run this script from the project root directory${NC}"
    exit 1
fi

# 1. Frontend Setup
echo -e "${YELLOW}Step 1: Building Frontend...${NC}"
cd Frontend
npm install --production
npm run build
FRONTEND_SIZE=$(du -sh dist | cut -f1)
echo -e "${GREEN}✓ Frontend built successfully (Size: $FRONTEND_SIZE)${NC}\n"
cd ..

# 2. Backend Setup
echo -e "${YELLOW}Step 2: Setting up Backend...${NC}"
cd Backend
npm install --production
echo -e "${GREEN}✓ Backend dependencies installed${NC}\n"
cd ..

# 3. Python Setup (Optional)
echo -e "${YELLOW}Step 3: Setting up ML Model...${NC}"
if command -v python3 &> /dev/null; then
    cd Backend
    pip install -r requirements.txt --no-cache-dir --no-deps
    echo -e "${GREEN}✓ Python dependencies installed${NC}\n"
    cd ..
else
    echo -e "${YELLOW}⚠ Python not found. Skipping ML model setup.${NC}\n"
fi

# 4. Environment setup
echo -e "${YELLOW}Step 4: Checking environment configuration...${NC}"
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓ Production environment file exists${NC}"
    echo -e "${YELLOW}  Don't forget to update the values in .env.production${NC}\n"
else
    echo -e "${RED}✗ .env.production not found${NC}"
    exit 1
fi

# 5. Docker setup (Optional)
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Step 5: Building Docker images (optional)...${NC}"
    echo "Run: docker-compose -f docker-compose.yml up -d"
    echo ""
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Production setup complete!${NC}"
echo -e "${GREEN}========================================\n${NC}"

echo "📋 Next steps:"
echo "1. Update .env.production with your credentials"
echo "2. For standalone: npm start in Backend, npm start in Frontend"
echo "3. For Docker: docker-compose -f docker-compose.yml up -d"
echo "4. Verify health: curl http://localhost:5000/health"
echo ""
echo "📚 See PRODUCTION_DEPLOYMENT.md for detailed instructions"
