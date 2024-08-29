import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch,
  useNavigate
} from 'react-router-dom';
import { useField } from './hooks';

const Menu = ({ anecdotes, addNew, setNotification }) => {
  const padding = {
    paddingRight: 5
  };

  const match = useMatch('/anecdotes/:id');
  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id)): null;

  return (
    <>
      <div>
        <Link style={padding} to="/">anecdotes</Link>
        <Link style={padding} to="/create">create new</Link>
        <Link style={padding} to="/about">about</Link>
      </div>

      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification}/>} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2024</i>
      </div>
    </>
  );
};

const Notification = ({ message }) => {
  if(!message)return;

  return (
    <h3>{message}</h3>
  );
};

const Anecdote = ({ anecdote }) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info} /></div>
    </>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>)
      }
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.</em>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
);

const CreateNew = ({ addNew, setNotification }) => {
  const navigate = useNavigate();

  const { setValue: setContent, content } = useField('text');
  const { setValue: setAuthor, author } = useField('text');
  const { setValue: setInfo, info } = useField('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    setNotification(`a new anecdote ${content.value} created`);
    setTimeout(() => setNotification(''), 5000);
    navigate('/');
  };

  const handleReset = (e) => {
    setContent('');
    setAuthor('');
    setInfo('');
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input  {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="reset">clear</button>
      </form>
    </div>
  );

};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const [notification, setNotification] = useState('');

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a));
  };

  return (
    <Router>
      <h1>Software anecdotes</h1>
      <Notification message={notification}/>
      <Menu anecdotes = { anecdotes } addNew={addNew} setNotification={setNotification} />
      <Footer />
    </Router>
  );
};

export default App;