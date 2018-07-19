const Odm = require('../db/odm');
const axios = require('axios');

const odm = new Odm();
const baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

const queryNyt = async ({ q, page }) => {
  const url = `${baseUrl}?api-key=e3ca6073db6240b99664780a0e729c67&q=${q}&page=${page}`;
  const res = await axios.get(url);
  const { docs } = res.data.response;
  return docs.map(({
    headline,
    id,
    snippet,
    web_url,
    word_count
  }) => (
    {
      title: headline.main,
      id,
      snippet,
      web_url,
      word_count,
    }
  ));
};

const handlers = [
  // main authentication route
  socket => (
    socket.on('authenticate', (data) => {
      if (!data.signUp) {
        odm.authenticate(data)
          .then(result => socket.emit('authenticated', result));
      } else {
        odm.createUser(data)
          .then(result => socket.emit('authenticated', result));
      }
    })
  ),

  // sign in token validation
  socket => (
    socket.on('token_check', (data) => {
      odm.validateToken(data.token)
        .then(result => socket.emit('valid_token', result));
    })
  ),

  // nyt api interaction
  socket => (
    socket.on('nyt_search', (data) => {
      queryNyt(data).then((docs => socket.emit('search_response', docs)));
    })
  ),

  // add saved article route
  socket => (
    socket.on('save_article', (data) => {
      odm.saveArticle(data).then(() => {
        socket.emit('save_complete', { success: true });
      }).catch(() => {
        socket.emit('save_complete', { success: false });
      });
    })
  ),

  socket => (
    socket.on('get_saved_articles', (data) => {
      odm.getSavedArticles(data)
        .then(articles => socket.emit('return_saved_articles', { articles }));
    })
  )
];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');
    handlers.forEach(handler => handler(socket));
  });
};
