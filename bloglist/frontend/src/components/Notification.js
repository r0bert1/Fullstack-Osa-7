import React from 'react' 

const Notification = ({ store }) => {
  if (store.getState().message === null) {
    return null
  }

  const style = {
    color: store.getState().type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {store.getState().message}
    </div>
  )
}

export default Notification