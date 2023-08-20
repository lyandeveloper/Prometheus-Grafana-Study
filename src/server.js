const express = require("express");
const {
  register,
  routeDuration,
  request_total_counter,
} = require("./prometheus");
const app = express();
const PORT = 3333;

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(res.statusCode)
    request_total_counter
      .labels({ method: "GET", statusCode: res.statusCode })
      .inc();
    routeDuration.labels(req.path, req.path, res.statusCode.toString()).observe(duration);
  });

  next();
});



app.get("/custom", (req, res) => {
  res.send("Custom metric updated");
});

app.get("/home", (req, res) => {
  setTimeout(() => {
    res.send("Hello, World!");
  }, 5000);
});

app.use('*', function(req,res){
  res.status(404) 
  res.send("URL cannot found")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
