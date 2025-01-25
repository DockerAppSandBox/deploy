FROM ubuntu:22.04

RUN apt update && apt install -y python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# RUN mkdir -p /images

COPY ./Server-Python/images ./images

CMD ["python3", "-m", "http.server", "8000", "--directory", "/app/images"]