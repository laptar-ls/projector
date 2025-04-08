const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("redis");
const fivebeans = require("fivebeans");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const redisRdbClient = createClient({ url: "redis://redis_rdb:6379" });
const redisAofClient = createClient({ url: "redis://redis_aof:6379" });

(async () => {
  try {
    await redisRdbClient.connect();
    await redisAofClient.connect();
    console.log("Redis-clients are connected");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

const beanstalkdClient = new fivebeans.client("beanstalkd", 11300);

beanstalkdClient
  .on("connect", () => console.log("Connected to beanstalkd"))
  .on("error", (err) => console.error("Failed to connect to beanstalkd:", err))
  .connect();

app.post("/push", async (req, res) => {
  const { type, message } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    switch (type) {
      case "redisRdb":
        await redisRdbClient.lPush("queue:redisRdb", String(message));
        break;
      case "redisAof":
        await redisAofClient.lPush("queue:redisAof", String(message));
        break;
      case "beanstalkd":
        beanstalkdClient.use("default", (err, tubeName) => {
          if (err) {
            console.error(err);

            return res.status(500).json({ error: "Tube beanstalkd error" });
          }
          beanstalkdClient.put(0, 0, 60, String(message), (err, jobId) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "Failed adding to beanstalkd" });
            }
            return res.json({ status: "Message is pushed", jobId });
          });
        });
        return;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }
    res.json({ status: "Message is pushed" });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Server internal error" });
  }
});

app.get("/pop", async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  try {
    switch (type) {
      case "redisRdb": {
        const message = await redisRdbClient.rPop("queue:redisRdb");
        return res.json({ message });
      }
      case "redisAof": {
        const message = await redisAofClient.rPop("queue:redisAof");
        return res.json({ message });
      }
      case "beanstalkd":
        beanstalkdClient.watch("default", (err, numWatched) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error watch beanstalkd" });
          }
          beanstalkdClient.reserve_with_timeout(5, (err, jobId, payload) => {
            if (err) {
              if (err === "TIMED_OUT") {
                return res.json({ message: "Don't have any tasks" });
              }
              console.error(err);
              return res
                .status(500)
                .json({ error: "Failed getting message from beanstalkd" });
            }
            beanstalkdClient.destroy(jobId, (err) => {
              if (err) {
                console.error(err);
              }
              return res.json({ message: payload, jobId });
            });
          });
        });
        return;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server internal error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
