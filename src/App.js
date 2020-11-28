import React, { useState, useEffect } from 'react';

export default function Livescores() {
  const [loading, setLoading] = useState(true);
  const [scores, setLivescores] = useState([]);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 30000);
    return () => clearInterval(interval);
  }, []);

  function getData() {
    let apia =
      'https://api-football-v1.p.rapidapi.com/v2/fixtures/live/?rapidapi-key=3b44f9bc99msh4ab4e4517cf491dp1052fajsn4791216a1d22';
    fetch(apia)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.api.fixtures);
        // const byGroup = groupBy(data.api.fixtures, 'league_id');
        const byGroup = groupById(data.api.fixtures);
        console.log(byGroup);
        setLivescores(byGroup);
        setLoading(false);
      });
  }

  // State variable to keep track of all the expanded rows
  // By default, nothing expanded. Hence initialized with empty array.
  const [expandedRows, setExpandedRows] = useState(new Set());

  // State variable to keep track which row is currently expanded.
  const [expandState, setExpandState] = useState({});

  /**
   * This function gets called when show/hide link is clicked.
   */
  const handleExpandRow = (event, fixtureId) => {
    const expanded = new Set(expandedRows);
    const action = expanded.has(fixtureId) ? 'delete' : 'add';
    expanded[action](fixtureId);
    setExpandedRows(expanded);
    // const currentExpandedRows = expandedRows;
    // const isRowExpanded = currentExpandedRows.includes(fixtureId);

    // let obj = {};
    // isRowExpanded ? (obj[fixtureId] = false) : (obj[fixtureId] = true);
    // setExpandState(obj);

    // // If the row is expanded, we are here to hide it. Hence remove
    // // it from the state variable. Otherwise add to it.
    // const newExpandedRows = isRowExpanded
    //   ? currentExpandedRows.filter((index) => index !== fixtureId)
    //   : currentExpandedRows.concat(fixtureId);

    // setExpandedRows(newExpandedRows);
  };

  const getRowspan = (games) => {
    return games.length + games.filter(game => expandedRows.has(game.fixture_id)).length;
  }

  function groupById(scores) {
    const grouped = new Map();
    for (let score of scores) {
      if (!grouped.has(score.league.name)) {
        grouped.set(score.league.name, []);
      }
      grouped.get(score.league.name).push(score);
    }
    return Array.from(grouped.values());
  }

  return (
    <div style={{ height: '100%', width: '100wh', background: '#454d65' }}>
      {loading ? (
        <div id='loading' className='spinner-border m-5 p-5' role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      ) : (
        <div className='container'>
          <div className='row' style={{ paddingTop: '100px' }}>
            <div className='col'>
              <h1 style={{ color: 'white' }}> Live table </h1>
            </div>
          </div>
          <div className='row'>
            <div className='col' style={{ margin: '0 auto' }} sm={8}>
              <table
                responsive
                variant='dark'
                className='table table-striped table-dark table-hover table-bordered'
              >
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>League</th>
                    <th>Teams</th>
                    {/* <th>Teams</th> */}
                  </tr>
                </thead>
                <tbody>
                  {scores.map((games) =>
                    games.map((score, index) => (
                      <>
                        <tr
                          key={score.fixture_id}
                          onClick={(event) => handleExpandRow(event, score.fixture_id)}
                        >
                          {!index && (
                            <td data-label='League' rowspan={getRowspan(games)}>
                              <div className='flag'>
                                <img
                                  alt=''
                                  src={score.league.flag}
                                  width='20'
                                />{' '}
                                {score.league.country.slice(0, 3)} /{' '}
                                {score.league.name}
                              </div>
                            </td>
                          )}
                          <td data-label='Minute'>
                            <div className='results'>
                              {score.elapsed} {score.homeTeam.team_name}{' '}
                              {score.goalsHomeTeam}-{score.goalsAwayTeam}{' '}
                              {score.awayTeam.team_name}
                            </div>
                          </td>
                          {/* <td className="hTime"><div className="results">{score.score.halftime}</div></td> */}
                        </tr>
                        {expandedRows.has(score.fixture_id) ? (
                          <tr>
                            <td>
                              <div
                                style={{
                                  backgroundColor: '#343A40',
                                  color: '#FFF',
                                  padding: '10px',
                                }}
                              >
                                <ul>
                                  <li>
                                    <span>
                                      <b>Half time:</b>
                                    </span>{' '}
                                    <span> {score.score.halftime} </span>
                                    <br></br>
                                    {score.events[1] && (
                                      <div className='rol results'>
                                        {score.events[1].elapsed}`{' '}
                                        {score.events[1].player}{' '}
                                        {score.events[1].detail}
                                      </div>
                                    )}
                                    {score.events[2] && (
                                      <div className='rol results'>
                                        {score.events[2].elapsed}`{' '}
                                        {score.events[2].player}{' '}
                                        {score.events[2].detail}
                                      </div>
                                    )}
                                    {score.events[3] && (
                                      <div className='rol results'>
                                        {score.events[3].elapsed}`{' '}
                                        {score.events[3].player}{' '}
                                        {score.events[3].detail}
                                      </div>
                                    )}
                                    {score.events[4] && (
                                      <div className='rol results'>
                                        {score.events[4].elapsed}`{' '}
                                        {score.events[4].player}{' '}
                                        {score.events[4].detail}
                                      </div>
                                    )}
                                    {score.events[5] && (
                                      <div className='rol results'>
                                        {score.events[5].elapsed}`{' '}
                                        {score.events[5].player}{' '}
                                        {score.events[5].detail}
                                      </div>
                                    )}
                                    <br></br>
                                    <span>Venue: {score.venue}</span>
                                    <br></br>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
