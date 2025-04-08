# ⚖️ Load Balancing

## Setup Instructions

1.  **Run the load balancer using Docker Compose:**
    Navigate to the project directory and execute:
    ```bash
    docker-compose up -d load-balancer
    ```

2.  **Set up and run ngrok:**
    Use `ngrok` to create a public tunnel to your local port 80:
    ```bash
    ngrok http 80
    ```
    Take note of the generated `ngrok` URL.

3.  **Verify the load balancer in your web browser:**
    Open `http://localhost/` in your web browser. You should see a response from one of your servers.

4.  **Test switching to the backup upstream server:**
    To test the automatic failover to the backup server, stop the currently active server.

    For example, if you were receiving a response from the `other` server:
    ```bash
    docker stop server-other
    ```

    Then, refresh the page in your browser. You should now receive a response from the backup server.

    To receive responses from the original server again, start it:
    ```bash
    docker start server-other
    ```
