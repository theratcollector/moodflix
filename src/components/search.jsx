import React from 'react'

const search = (props) => {
  return (
    <div className='search'>
      <div>
        <img src='search.svg' alt='search'></img>

        <input type='text' placeholder='Search through thousands of movies' value={props.searchTerm} onChange={(event) => props.setSearchTerm(event.target.value)}></input>
      </div>
    </div>
  )
}

export default search