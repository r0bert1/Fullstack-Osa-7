import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'

const Users = (props) => {
  useEffect(() => {
    props.initializeUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h2>Users</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {props.users.map(user => 
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const mapDispatchToProps =  {
  initializeUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)