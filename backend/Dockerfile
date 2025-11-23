FROM node:20-slim

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/requirements.txt ./services/

# Install Node.js dependencies
RUN npm ci

# Install Python dependencies
RUN python3 -m pip install --user -r services/requirements.txt

# Copy application code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

EXPOSE 5000

CMD ["npm", "start"]

