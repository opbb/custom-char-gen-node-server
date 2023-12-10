import axios from "axios";
function SongRoutes(app) {
  let authorization; // Don't access this directly, instead use _getAccessToken_ to ensure token is refreshed
  const client_id = process.env.SPOTIFY_API_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_API_CLIENT_SECRET;
  const encodedAuthorization =
    "Basic " +
    new Buffer.from(client_id + ":" + client_secret).toString("base64");
  const accessTokenRequestOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      Authorization: encodedAuthorization,
    },
    params: {
      grant_type: "client_credentials",
    },
  };

  const getAuthorization = async () => {
    if (authorization !== undefined) {
      return authorization;
    } else {
      try {
        const res = await axios(accessTokenRequestOptions);
        const { access_token, expires_in } = res.data;
        authorization = `Bearer ${access_token}`;
        setTimeout(() => {
          authorization = undefined;
        }, (expires_in - 5) * 1000); // Convert seconds to miliseconds. Give 5 second's of leway for setTimeout
        return authorization;
      } catch (err) {
        console.log("ERR GETTING SPOTIFY ACCESS TOKEN", err);
      }
    }
  };

  const cleanTrackData = (trackData) => {
    const artistNames = trackData.artists.map((artist) => artist.name);
    return {
      _id: trackData.id,
      title: trackData.name,
      albumName: trackData.album.name,
      albumImage: trackData.album.images[0],
      artistNames: artistNames,
    };
  };

  const searchSongs = async (searchQuery, searchLimit) => {
    const currentAuthorization = await getAuthorization();
    const searchSongsRequestOptions = {
      url: `https://api.spotify.com/v1/search`,
      method: "GET",
      headers: {
        Authorization: currentAuthorization,
      },
      params: {
        q: searchQuery,
        type: "track",
        limit: searchLimit,
      },
    };
    try {
      const res = await axios(searchSongsRequestOptions);
      const { data } = res;
      //const numTracks = Math.min(data.tracks.total, data.tracks.limit);
      const cleanedTracksData = data.tracks.items.map(cleanTrackData);
      return cleanedTracksData;
    } catch (err) {
      console.log("ERR GETTING SPOTIFY SEARCH", err);
    }
  };

  const getSongByID = async (songID) => {
    const currentAuthorization = await getAuthorization();
    const searchSongsRequestOptions = {
      url: `https://api.spotify.com/v1/tracks/${songID}`,
      method: "GET",
      headers: {
        Authorization: currentAuthorization,
      },
    };
    try {
      const res = await axios(searchSongsRequestOptions);
      const { data } = res;
      return cleanTrackData(data);
    } catch (err) {
      console.log("ERR GETTING SPOTIFY SONG", err);
    }
  };

  const getSongsByID = async (songIDs) => {
    const currentAuthorization = await getAuthorization();
    const searchSongsRequestOptions = {
      url: `https://api.spotify.com/v1/tracks`,
      method: "GET",
      headers: {
        Authorization: currentAuthorization,
      },
      params: {
        ids: songIDs,
      },
    };
    try {
      const res = await axios(searchSongsRequestOptions);
      const { data } = res;
      const cleanedTracksData = data.tracks.map(cleanTrackData);
      return cleanedTracksData;
    } catch (err) {
      console.log("ERR GETTING SPOTIFY SONGS", err);
    }
  };

  app.get("/api/songs/search/:limit/:searchQuery", async (req, res) => {
    const { limit, searchQuery } = req.params;
    const searchResults = await searchSongs(searchQuery, limit);
    res.send(searchResults);
  });
  app.get("/api/song/:songID", async (req, res) => {
    const { songID } = req.params;
    const trackData = await getSongByID(songID);
    res.send(trackData);
  });
  app.get("/api/songs/:songIDs", async (req, res) => {
    const { songIDs } = req.params;
    const tracksData = await getSongsByID(songIDs);
    res.send(tracksData);
  });
}
export default SongRoutes;
