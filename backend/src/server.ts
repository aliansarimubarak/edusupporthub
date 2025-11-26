import http from "http";
import app from "./app";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// server.listen(PORT, () => {
//   console.log(`EduSupportHub backend running at http://localhost:${PORT}`);
// });

server.listen(
  {
    port: Number(PORT),
    host: "0.0.0.0",
  },
  () => {
    console.log(`EduSupportHub backend running at http://0.0.0.0:${PORT}`);
  }
);

