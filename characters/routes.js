import axios from "axios";
function CharacterRoutes(app) {
  app.get("/api/test/authToken", async (req, res) => {
    const client_id = process.env.SPOTIFY_API_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_API_CLIENT_SECRET;
    const encodedString =
      "Basic " +
      new Buffer.from(client_id + ":" + client_secret).toString("base64");
    console.log(encodedString);
    let options = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        // 'Content-Type':'application/x-www-form-urlencoded',
        Authorization: encodedString,
      },
      params: {
        grant_type: "client_credentials",
      },
    };
    axios(options)
      .then((resp) => {
        console.log("resp", resp.data);
      })
      .catch((err) => {
        console.log("ERR GETTING SPOTIFY ACCESS TOKEN", err);
      });

    res.send("got");
  });
}
export default CharacterRoutes;
