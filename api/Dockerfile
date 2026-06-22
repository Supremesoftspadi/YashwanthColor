FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
        wget \
        apt-transport-https \
        gnupg \
        unixodbc-dev \
        gcc \
        g++ \
        build-essential \
        libssl-dev \
        libffi-dev \
        bash \
    && rm -rf /var/lib/apt/lists/*

# Add Microsoft package repository and install ODBC driver
RUN wget https://packages.microsoft.com/keys/microsoft.asc -O- | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg && \
    wget https://packages.microsoft.com/config/debian/11/prod.list -O /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add mssql-tools to PATH
ENV PATH="$PATH:/opt/mssql-tools/bin"

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy entrypoint script and make it executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
