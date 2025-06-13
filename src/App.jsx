import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [input_val, set_input_val] = useState('');
  const [results, set_results] = useState([]);
  const [pg, set_pg] = useState(1);
  const [show_btn, set_show_btn] = useState(false);
  const [error_msg, set_error_msg] = useState('');
  const [search_trigger, set_search_trigger] = useState(false);

  const run_search = async () => {
    if (!input_val.trim()) {
      set_error_msg('Enter something to search.');
      return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${pg}&query=${input_val}&client_id=KCpjrqT8XsktPguKVsSNDK7xdU4L8OPoPFllENIDM-4`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const incoming = data.results || [];

      if (incoming.length === 0 && pg === 1) {
        set_error_msg('No results found.');
        set_results([]);
        set_show_btn(false);
        return;
      }

      set_results(pg === 1 ? incoming : results.concat(incoming));
      set_pg(pg + 1);
      set_show_btn(incoming.length > 0);
      set_error_msg('');
    } catch {
      set_error_msg('Could not load results. Try again later.');
    }
  };

  const handle_submit = (e) => {
    e.preventDefault();
    set_pg(1); // Reset page
    set_results([]); // Clear previous results
    set_search_trigger(prev => !prev); // Trigger useEffect
  };

  useEffect(() => {
    if (input_val.trim()) {
      run_search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_trigger]);

  const handle_input = (e) => {
    set_input_val(e.target.value);
    if (error_msg) set_error_msg('');
  };

  const more = () => {
    run_search();
  };

  return (
    <div>
      <h1>Photo Search</h1>
      <form onSubmit={handle_submit}>
        <input
          type="text"
          placeholder="Search term"
          value={input_val}
          onChange={handle_input}
        />
        <button>Search</button>
      </form>
      {error_msg && <p style={{ color: 'red' }}>{error_msg}</p>}
      <div className="search-results">
        {results.map((r, i) => (
          <div key={i} className="search-result">
            <img src={r.urls.small} alt={r.alt_description || 'img'} />
            <a href={r.links.html} target="_blank" rel="noreferrer">
              {r.alt_description || 'link'}
            </a>
          </div>
        ))}
      </div>
      {show_btn && (
        <button onClick={more}>More</button>
      )}
    </div>
  );
}

export default App;

