import io from 'socket.io-client';

class Socket {
  constructor() {
    this.socket = io(('http://localhost:8080'));
  }

  extendedLogin = () => (
    new Promise((resolve) => {
      console.log('checking token');
      if (!localStorage.token) {
        resolve(false);
      }
      this.socket.on('valid_token', (res) => {
        if (!('loggedIn' in res)) {
          throw new Error('token authentication failed');
        } else if (res.loggedIn) {
          console.log('token valid');
          this.socket.off('valid_token');
          resolve(true);
        }
        console.log('token invalid');
        this.socket.off('valid_token');
        resolve(false);
      });
      this.socket.emit('token_check', { token: localStorage.token });
    })
  )

  login = (handler) => {
    this.socket.on('authenticated', (res) => {
      handler(res);
    });
    return ({ user, pass, loginSuccess }, signUp) => {
      if (loginSuccess) {
        this.socket.off('authenticated');
      } else {
        this.socket.emit('authenticate', ({ user, pass, signUp }));
      }
    };
  }

  nytSearch = (handler) => {
    this.socket.on('search_response', (data) => {
      console.log(data);
      handler(data);
    });
    return (q = '', page = 0) => {
      this.socket.emit('nyt_search', { q, page });
    };
  }

  saveArticle = (handler) => {
    this.socket.on('save_complete', (data) => {
      handler(data);
    });
    return ({
      title,
      snippet,
      web_url,
      word_count
    }) => {
      const article = {
        title,
        snippet,
        web_url,
        word_count
      };
      this.socket.emit('save_article', { token: localStorage.token, article });
    };
  }

  getSavedArticles = (handler) => {
    this.socket.on('return_saved_articles', (data) => {
      console.log(data);
      handler(data);
    });
    return () => {
      this.socket.emit('get_saved_articles', { token: localStorage.token });
    };
  }
}

export default Socket;
