FROM nginx:latest

RUN apt-get update && apt-get install -y \
    fcgiwrap \
    bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/lib/cgi-bin && chmod +x /usr/lib/cgi-bin

COPY purge_cache.sh /usr/lib/cgi-bin/
RUN chmod +x /usr/lib/cgi-bin/purge_cache.sh

EXPOSE 80
